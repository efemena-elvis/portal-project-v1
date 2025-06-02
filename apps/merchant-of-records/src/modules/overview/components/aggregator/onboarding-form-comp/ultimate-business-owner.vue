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
import { ref, watchEffect } from "vue";
import TableComponent from "../../table-component.vue";
import { countryCurrencies } from "@packages/constants";

const props = defineProps<{
  merchantPayload: any[]; 
}>();

const emit = defineEmits<{
  (e: "update:merchantPayload", payload: any[]): void;
}>();

interface TableHeader {
  key: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  readonly?: boolean;
}

const countryList = ref<{ value: string; label: string }[]>([]);

const loadCountryList = () => {
  countryList.value = countryCurrencies.map(({ country }) => ({
    value: country.toLowerCase(),
    label: country,
  }));
};

loadCountryList();  // <-- Load countries first before headers

const tableHeaders = ref<TableHeader[]>([
  { key: "business_name", label: "Business name", type: "text", readonly: true },
  { key: "full_name", label: "Full Name", type: "text" },
  {
    key: "directors_country",
    label: "Country",
    type: "select",
    options: countryList.value,
  },
  { key: "directors_address", label: "Address", type: "text" },
  { key: "directors_id", label: "Director's ID", type: "file" },
]);

const tableData = ref<any[]>([]);

watchEffect(() => {
  tableData.value = props.merchantPayload.map((merchant) => ({
    ...merchant,
    id: merchant.id,
    business_name: merchant.business_name,
    full_name: merchant.full_name ?? "",
    directors_country: merchant.directors_country ?? "",
    directors_address: merchant.directors_address ?? "",
    directors_id: merchant.directors_id ?? "",
  }));
});

function handleDeleteRow(rowId: number) {
  tableData.value = tableData.value.filter((row) => row.id !== rowId);
  emit("update:merchantPayload", [...tableData.value]);
}

function handleUpdateRow(rowId: number, field: string, value: any) {
  tableData.value = tableData.value.map((row) =>
    row.id === rowId ? { ...row, [field]: value } : row
  );
  emit("update:merchantPayload", [...tableData.value]);
  console.log("Updated merchantPayload:", props.merchantPayload);
}
</script>
