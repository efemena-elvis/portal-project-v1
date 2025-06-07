<template>
  <OnboardingWrapper
    :isPrimaryActionDisabled="!isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'MerchantBusinessProfile' })"
    @onContinueClick="handleBusinessAddressUpdate"
    :showActionRow="true"
  >
    <BulkUploadTable
      :headers="tableHeaders"
      :data="tableData"
      :showAddButton="false"
      :showDeleteButton="false"
      @update-row="handleUpdateRow"
    />
  </OnboardingWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import BulkUploadTable from "@packages/uikit/src/components/table-comps/bulk-upload-table.vue";
import OnboardingWrapper from "./onboarding-wrapper.vue";
import { useEvents } from "@packages/hooks";
import { useGlobalStore } from "@/modules/global/store";
import { useMerchantUtils } from "@packages/hooks/src/useMerchantUtils";

const router = useRouter();
const { processAPIRequest } = useEvents();
const { getBusinessCountries } = useGlobalStore();
const merchantStore = useMerchantUtils();

interface TableRow {
  id: number;
  business_name: string;
  country_id: string;
  address: string;
  billing_descriptor_1: string;
  billing_descriptor_2: string;
}

const tableHeaders = ref([
  {
    key: "business_name",
    label: "Business name",
    type: "text",
    readonly: true,
  },
  { key: "country_id", label: "Country", type: "select", options: [] },
  { key: "address", label: "Address", type: "text" },
  { key: "billing_descriptor_1", label: "Billing Descriptor 1", type: "text" },
  { key: "billing_descriptor_2", label: "Billing Descriptor 2", type: "text" },
]);

const tableData = ref<TableRow[]>([]);

const stopClickHandler = ref(false);

const loadCountryList = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    const countries = response.data.map(
      (item: { id: string; name: string }) => ({
        value: item.id,
        label: item.name,
      })
    );

    const countryHeader = tableHeaders.value.find(
      (h) => h.key === "country_id"
    );
    if (countryHeader) countryHeader.options = countries;
  }
};

const initializeTableData = () => {
  if (merchantStore.business.length) {
    tableData.value = merchantStore.business.map((merchant, idx) => ({
      id: idx + 1,
      business_name: merchant.business_name || "",
      country_id: "",
      address: "",
      billing_descriptor_1: "",
      billing_descriptor_2: "",
    }));
  } else {
    tableData.value = [
      {
        id: 1,
        business_name: "",
        country_id: "",
        address: "",
        billing_descriptor_1: "",
        billing_descriptor_2: "",
      },
    ];
  }
};

const handleUpdateRow = (rowId: number | string, field: string, value: any) => {
  const id = typeof rowId === "string" ? Number(rowId) : rowId;

  tableData.value = tableData.value.map((row) =>
    row.id === id ? { ...row, [field]: value } : row
  );
};

const isActionReady = computed(() =>
  tableData.value.every(
    (row) =>
      row.business_name &&
      row.country_id &&
      row.address &&
      row.billing_descriptor_1 &&
      row.billing_descriptor_2
  )
);

const handleBusinessAddressUpdate = async () => {
  const data = [...tableData.value];

  const addressPayload = data.map((row) => ({
    business_name: row.business_name,
    country_id: row.country_id,
    address: row.address,
    billing_descriptor_1: row.billing_descriptor_1,
    billing_descriptor_2: row.billing_descriptor_2,
  }));

  merchantStore.setMerchantTable([...tableData.value]);
  merchantStore.setBusinessAddress(addressPayload);
  router.push({name :  "DirectorDetails1"})
  // console.log("✅ Final merchant payload:", merchantStore.getFullPayload());
};

onMounted(() => {
  loadCountryList();
  initializeTableData();
});
</script>
