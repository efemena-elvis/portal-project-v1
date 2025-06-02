<template>
  <div class="p-6">
    <TableComponent
      title="Business Address"
      :headers="tableHeaders"
      :data="tableData"
      @delete-row="handleDeleteRow"
      @update-row="handleUpdateRow"
      :showDeleteButton="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import TableComponent from "../../table-component.vue";
import { countryCurrencies } from "@packages/constants";

interface TableHeader {
  key: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  readonly?: boolean;
}

interface TableRow {
  id: number;
  business_name: string;
  country: string;
  address: string;
  billing_descriptor_1: string;
  billing_descriptor_2: string;
}


const props = defineProps<{
  merchantPayload: Partial<TableRow>[]; 
}>();

const emit = defineEmits<{
  (e: "update:merchantPayload", payload: TableRow[]): void;
}>();


const tableData = ref<TableRow[]>([]);
const countryList = ref<{ value: string; label: string }[]>([]);


const loadCountryList = () => {
  countryList.value = countryCurrencies.map(({ country }) => ({
    value: country.toLowerCase(),
    label: country,
  }));

  const countryHeader = tableHeaders.value.find(h => h.key === "country");
  if (countryHeader) countryHeader.options = countryList.value;
};


const tableHeaders = ref<TableHeader[]>([
  { key: "business_name", label: "Business name", type: "text", readonly: true },
  { key: "country", label: "Country", type: "select", options: [] },
  { key: "address", label: "Address", type: "text" },
  { key: "billing_descriptor_1", label: "Billing Descriptor 1", type: "text" },
  { key: "billing_descriptor_2", label: "Billing Descriptor 2", type: "text" },
]);


watchEffect(() => {
  tableData.value = props.merchantPayload.map((merchant, index) => ({
      ...merchant,
    id: merchant.id ?? index + 1,
    business_name: merchant.business_name ?? "",
    country: merchant.country ?? "",
    address: merchant.address ?? "",
    billing_descriptor_1: merchant.billing_descriptor_1 ?? "",
    billing_descriptor_2: merchant.billing_descriptor_2 ?? "",
  }));

  console.log("merchantPayload:", props.merchantPayload);
});

// Emit changes when data is updated
function handleUpdateRow(rowId: number, field: string, value: string | number) {
  tableData.value = tableData.value.map(row =>
    row.id === rowId ? { ...row, [field]: value } : row
  );
  emit("update:merchantPayload", [...tableData.value]);
  console.log("Updated merchantPayload:", tableData.value);
}


function handleDeleteRow(rowId: number) {
  tableData.value = tableData.value.filter(row => row.id !== rowId);
  emit("update:merchantPayload", [...tableData.value]);
}


loadCountryList();
</script>
