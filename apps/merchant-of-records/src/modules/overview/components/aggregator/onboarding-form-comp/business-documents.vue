<template>
  <div class="p-6">
    <TableComponent
      title="Business Documents"
      :headers="tableHeaders"
      :data="tableData"
      @update-row="handleUpdateRow"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineExpose, watch } from "vue";
import TableComponent from "../../table-component.vue";
import { ITableHeaderType } from "@packages/models";

const props = defineProps<{
  merchantPayload: any[];
  isPrimaryActionDisabled: boolean;
}>();

const emit = defineEmits<{
  (e: "update:merchantPayload", payload: any[]): void;
  (e: "stepComplete"): void;
  (e: "showError", message: string): void;
  (e: "update:isPrimaryActionDisabled", value: boolean): void;
}>();

const tableData = ref<any[]>([]);

const tableHeaders = ref<ITableHeaderType[]>([
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

function handleUpdateRow(rowId: string | number, field: string, value: string | number | File) {
  tableData.value = tableData.value.map((row) =>
    row.id === rowId ? { ...row, [field]: value } : row
  );
  emit("update:merchantPayload", [...tableData.value]);
}

function validate(): boolean {
  for (const row of tableData.value) {
    if (!row.tin || !row.business_certificate || !row.form_3) {
      return false;
    }
  }
  return true;
}

watch(
  tableData,
  () => {
    if (tableData.value.length === 0) {
      emit("update:isPrimaryActionDisabled", true);
      return;
    }
    const isValid = validate();
    emit("update:isPrimaryActionDisabled", !isValid);

    if (isValid) {
      emit("stepComplete");
    } else {
      emit("showError", "Please fill in all required business document fields.");
    }
  },
  { deep: true }
);


defineExpose({ validate });
</script>
