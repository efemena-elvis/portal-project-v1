<template>
  <OnboardingWrapper
   
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'MerchantBusinessProfile' })"
    @onContinueClick="handleBusinessProfileUpdate"
    :showActionRow="true"
   
  >
    <BulkUploadTable
      :headers="tableHeaders"
      :data="tableData"
      :showAddButton="true"
      @add-row="handleAddRow"
      @update-row="handleUpdateRow"
      @delete-row="handleDeleteRow"
      :showDeleteButton="true"
    />
  </OnboardingWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import BulkUploadTable from "@packages/uikit/src/components/table-comps/bulk-upload-table.vue";
import OnboardingWrapper from "./onboarding-wrapper.vue";
import { useMerchantUtils } from "@packages/hooks/src/useMerchantUtils";
import { useValidators } from "@packages/hooks";

const router = useRouter();
const merchantStore = useMerchantUtils();
const {
  validateRequired,
  validateEmail,
  validateURL,
} = useValidators();

interface TableRow {
  id: number;
  business_name: string;
  business_sector: string;
  email: string;
  phone_number: string;
  website_link: string;
}

const tableHeaders = ref([
  { key: "business_name", label: "Business name", type: "text" },
  {
    key: "business_sector",
    label: "Business sector",
    type: "select",
    options: [
      { value: "int_decors", label: "Int & Decors" },
      { value: "small_business", label: "Small business" },
      { value: "technology", label: "Technology" },
      { value: "healthcare", label: "Healthcare" },
      { value: "finance", label: "Finance" },
      { value: "retail", label: "Retail" },
    ],
  },
  { key: "email", label: "Email", type: "email" },
  { key: "phone_number", label: "Phone number", type: "number" },
  { key: "website_link", label: "Website", type: "url" },
]);

const tableData = ref<TableRow[]>([]);

const handleAddRow = () => {
  const newId =
    tableData.value.length > 0
      ? Math.max(...tableData.value.map((row) => row.id)) + 1
      : 1;

  const newRow: TableRow = {
    id: newId,
    business_name: "",
    business_sector: "",
    email: "",
    phone_number: "",
    website_link: "",
  };

  tableData.value.push(newRow);
  merchantStore.addRow(newRow);
};

const handleUpdateRow = (rowId: number | string, field: string, value: any) => {
  const id = typeof rowId === "string" ? Number(rowId) : rowId;

  tableData.value = tableData.value.map((row) =>
    row.id === id ? { ...row, [field]: value } : row
  );
  merchantStore.updateRow(id, { [field]: value });
};

const handleDeleteRow = (rowId: number | string) => {
  const id = typeof rowId === "string" ? Number(rowId) : rowId;
  tableData.value = tableData.value.filter((row) => row.id !== id);
  merchantStore.deleteRow(id);
};

const isActionReady = computed(() =>
  tableData.value.every(
    (row) =>
      !!validateRequired(row.business_name) &&
      !!validateRequired(row.business_sector) &&
      !!validateEmail(row.email) &&
      !!validateRequired(row.phone_number) &&
      !!validateURL(row.website_link)
  )
);

const stopClickHandler = ref(false);

const handleBusinessProfileUpdate = async () => {
  const data = [...tableData.value];

  const profiles = data.map((row) => ({
    business_name: row.business_name,
    mcc: row.business_sector,
    email: row.email,
    phone_number: row.phone_number,
    website_link: row.website_link,
  }));

  merchantStore.setBusinessProfile(profiles);
  router.push({name :  "MerchantBusinessAddress"})
};

// console.log(isActionReady.value)

onMounted(() => {
  if (merchantStore.business.length > 0) {
    tableData.value = merchantStore.business.map(
      (row: any, idx: number) => ({
        id: row.id ?? idx + 1,
        business_name: row.business_name ?? "",
        business_sector: row.mcc ?? "",
        email: row.email ?? "",
        phone_number: row.phone_number ?? "",
        website_link: row.website_link ?? "",
      })
    );
  } else {
    tableData.value = [
      {
        id: 1,
        business_name: "",
        business_sector: "",
        email: "",
        phone_number: "",
        website_link: "",
      },
    ];
  }
});
</script>
