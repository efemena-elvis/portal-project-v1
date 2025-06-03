<template>
  <div class="p-6">
    <TableComponent
      title="Business Profile"
      :headers="tableHeaders"
      :data="tableData"
      :showAddButton="true"
      @add-row="handleAddRow"
      @update-row="handleUpdateRow"
      @delete-row="handleDeleteRow"
      :showDeleteButton="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineExpose, watch } from "vue";
import { ITableHeaderType } from "@packages/models";
import TableComponent from "../../table-component.vue";

interface TableRow {
  id: number;
  business_name: string;
  business_sector: string;
  email: string;
  phone_number: string;
  website: string;
}

const props = defineProps<{
  merchantPayload: TableRow[];
}>();

const emit = defineEmits<{
  (e: "update:merchantPayload", payload: TableRow[]): void;
  (e: "stepComplete"): void;
  (e: "showError", message: string): void;
}>();

const tableHeaders = ref<ITableHeaderType[]>([
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
  { key: "website", label: "Website", type: "url" },
]);

const tableData = ref<TableRow[]>([]);
let stepCompleted = false;

watchEffect(() => {
  tableData.value = props.merchantPayload.map((row) => ({ ...row }));
});

function validate(): boolean {
  for (const row of tableData.value) {
    if (
      !row.business_name ||
      !row.business_sector ||
      !row.email ||
      !row.phone_number ||
      !row.website ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)
    ) {
      return false;
    }
  }
  return true;
}

function handleAddRow() {
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
    website: "",
  };

  tableData.value.push(newRow);
  emit("update:merchantPayload", [...tableData.value]);
}

function handleUpdateRow(
  rowId: string | number,
  field: string,
  value: string | number | File
) {
  const id = typeof rowId === "string" ? Number(rowId) : rowId;
  tableData.value = tableData.value.map((row) =>
    row.id === id ? { ...row, [field]: value } : row
  );
  emit("update:merchantPayload", [...tableData.value]);

}

function handleDeleteRow(rowId: string | number) {
  const id = typeof rowId === "string" ? Number(rowId) : rowId;
  tableData.value = tableData.value.filter((row) => row.id !== id);
  emit("update:merchantPayload", [...tableData.value]);
}

watch(
  tableData,
  (newVal) => {
    if (validate()) {
      stepCompleted = true;
      emit("stepComplete");
    }

    else {
      emit("showError", "Please complete all required fields correctly.");
    }
  },
  { deep: true }
);

defineExpose({ validate });
</script>
