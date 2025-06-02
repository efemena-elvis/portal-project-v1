<template>
  <div class="p-6">
    <TableComponent
      title="Business Address"
      :headers="tableHeaders"
      :data="tableData"
      :showDeleteButton="true"
      @delete-row="handleDeleteRow"
      @update-row="handleUpdateRow"
      @onDocumentUploaded="handleDocumentUploaded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import TableComponent from "../../table-component.vue";

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

const tableData = ref<any[]>([]);
const tableHeaders = ref<TableHeader[]>([
  { key: "business_name", label: "Business name", type: "text", readonly: true },
  { key: "tin", label: "TIN", type: "text" },
  { key: "business_certificate", label: "Business Certificate", type: "file" },
  { key: "form_3", label: "Form 3", type: "file" },
  { key: "optional_document", label: "Optional Document", type: "file" },
]);

watchEffect(() => {
  tableData.value = props.merchantPayload.map((merchant) => ({
    ...merchant,
    id: merchant.id,
    tin: merchant.tin ?? "",
    business_certificate: merchant.business_certificate ?? "",
    form_3: merchant.form_3 ?? "",
    optional_document: merchant.optional_document ?? "",
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
}


</script>
