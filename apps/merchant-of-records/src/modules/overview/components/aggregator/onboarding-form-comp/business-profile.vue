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
import { ref, watchEffect } from "vue";
import TableComponent from "../../table-component.vue";

interface TableHeader {
  key: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
}

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
}>();


const tableHeaders = ref<TableHeader[]>([
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


watchEffect(() => {
  tableData.value = props.merchantPayload.map((row) => ({ ...row }));
});


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


function handleUpdateRow(rowId: number, field: string, value: string | number) {
  tableData.value = tableData.value.map((row) =>
    row.id === rowId ? { ...row, [field]: value } : row
  );
  emit("update:merchantPayload", [...tableData.value]);
}

function handleDeleteRow(rowId: number) {
  tableData.value = tableData.value.filter((row) => row.id !== rowId);
  emit("update:merchantPayload", [...tableData.value]);
}
</script>
