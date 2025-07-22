<template>
  <MerchantWrapper
    :stopClickHandler="stopClickHandler"
    :isPrimaryActionDisabled="!isActionReady"
    showActionRow
    @onBackClick="router.push({ name: 'AggregatorBusinessProfile' })"
    @onContinueClick="handleBusinessAddressUpdate"
  >
    <BulkUploadTable
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :showAddMerchantBtn="false"
      :showRemoveBtn="false"
      :updateMerchantAction="updateMerchantData"
    />
  </MerchantWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { BulkUploadTableType, IMerchantBaseType } from "@packages/models";
import { useValidators, useEvents } from "@packages/hooks";
import { BulkUploadTable } from "@packages/uikit";
import { MerchantWrapper } from "@/modules/compliance/components";
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";

const router = useRouter();

const { processAPIRequest, pushToastAlert } = useEvents();
const { getBusinessCountries } = useGlobalStore();
const complianceStore = useComplianceStore();
const { validateRequired } = useValidators();

const { merchantDataComputed } = storeToRefs(complianceStore);
const { updateMerchantData, transformMerchantData, onboardBulkMerchant } =
  complianceStore;
const stopClickHandler = ref(false);

const tableHeader = ref<BulkUploadTableType[]>([
  {
    name: "legal_name",
    label: "Business name",
    type: "text",
    path: "profile.legal_name",
    placeholder: "Enter business name",
    readonly: true,
  },
  {
    name: "country_id",
    label: "Country of operation",
    type: "select",
    path: "address.country_id",
    placeholder: "Select business country",
    options: [],
    validator: validateRequired,
  },
  {
    name: "address",
    label: "Business address",
    type: "text",
    path: "address.address",
    placeholder: "Enter business address",
    validator: validateRequired,
  },
  {
    name: "billing_descriptor1",
    label: "Billing descriptor 1",
    type: "text",
    path: "address.billing_descriptor1",
    placeholder: "Enter billing descriptor 1",
    validator: validateRequired,
  },
  {
    name: "billing_descriptor2",
    label: "Billing descriptor 2",
    type: "text",
    path: "address.billing_descriptor2",
    placeholder: "Enter billing descriptor 2",
    validator: validateRequired,
  },
]);

const tableBody = ref<IMerchantBaseType[]>(merchantDataComputed.value || []);

const isActionReady = computed(() => {
  return merchantDataComputed.value.every((item) => {
    const address = item.address;

    const validations = [
      validateRequired(address.country_id),
      validateRequired(address.address),
      validateRequired(address.billing_descriptor1),
      validateRequired(address.billing_descriptor2),
    ];

    // If any validator returned a non-empty error string, form is not ready
    return validations.every((result) => result === "");
  });
});

const loadBusinessCountries = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    const countries = response.data.map(
      (item: { id: string; name: string }) => ({
        value: item.id,
        name: item.name,
      })
    );

    tableHeader.value[1].options = countries;
  }
};

const handleBusinessAddressUpdate = async () => {
  const transformedData = transformMerchantData(merchantDataComputed.value);

  const response = await processAPIRequest({
    action: onboardBulkMerchant,
    payload: {
      data: transformedData,
    },
  });

  stopClickHandler.value = true;

  if (response.code === 201) {
    router.push({ name: "AggregatorBusinessDocuments" });
  } else {
    pushToastAlert({
      message: "Failed to update business address. Please try again.",
      type: "error",
    });
  }
};

watch(
  merchantDataComputed,
  (newValue) => {
    if (newValue) {
      tableBody.value = newValue;
    }
  },
  { immediate: true }
);

// LOAD BUSINESS COUNTRIES
onMounted(() => loadBusinessCountries());
</script>
