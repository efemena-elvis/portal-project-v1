<template>
  <MerchantWrapper
    :stopClickHandler="stopClickHandler"
    :isPrimaryActionDisabled="!isActionReady"
    showActionRow
    @onBackClick="router.push({ name: 'AggregatorDirectorDetails2' })"
    @onContinueClick="handleBusinessUBOUpdate"
  >
    <BulkUploadTable
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :showAddMerchantBtn="false"
      :showRemoveBtn="false"
      :uploadAction="uploadFile"
      :updateMerchantAction="updateMerchantData"
    />
  </MerchantWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { BulkUploadTableType, IMerchantBaseType } from "@packages/models";
import { useValidators, useEvents } from "@packages/hooks";
import { BulkUploadTable } from "@packages/uikit";
import { MerchantWrapper } from "@/modules/compliance/components";
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";

const router = useRouter();

const { uploadFile, getBusinessCountries } = useGlobalStore();
const complianceStore = useComplianceStore();
const { validateRequired } = useValidators();
const { processAPIRequest } = useEvents();

const { merchantDataComputed } = storeToRefs(complianceStore);
const { updateMerchantData } = complianceStore;
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
    name: "full_name",
    label: "UBO Fullname",
    type: "text",
    path: "ubo1.full_name",
    placeholder: "Enter UBO fullname",
    validator: validateRequired,
  },
  {
    name: "country",
    label: "Country of residence",
    type: "select",
    path: "ubo1.country",
    placeholder: "Select country",
    options: [],
    validator: validateRequired,
  },
  {
    name: "address",
    label: "UBO Address",
    type: "text",
    path: "ubo1.address",
    placeholder: "Enter UBO address",
    validator: validateRequired,
  },
  {
    name: "doc_id_url",
    label: "UBO ID",
    type: "file",
    path: "ubo1.doc_id_url",
    placeholder: "Upload UBO ID",
    validator: validateRequired,
  },
]);

const tableBody = ref<IMerchantBaseType[]>(merchantDataComputed.value || []);

const isActionReady = computed(() => {
  return merchantDataComputed.value.every((item) => {
    const ubo1 = item.ubo1;

    const validations = [
      validateRequired(ubo1.full_name),
      validateRequired(ubo1.country),
      validateRequired(ubo1.address),
      validateRequired(ubo1.doc_id_url),
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

    tableHeader.value[2].options = countries;
  }
};

const handleBusinessUBOUpdate = () => {
  router.push({ name: "AggregatorUboDetails2" });
};

// LOAD BUSINESS COUNTRIES
onMounted(() => loadBusinessCountries());
</script>
