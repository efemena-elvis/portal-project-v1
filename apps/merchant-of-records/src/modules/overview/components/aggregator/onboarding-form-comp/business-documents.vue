<template>
  <OnboardingWrapper
    :showActionRow="true"
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'UboDetails1' })"
    @onContinueClick="handleMerchantAgreementUpdate"

  >
 
    <BulkUploadTable
    
      :headers="tableHeaders"
      :data="tableData"
      @update-row="handleUpdateRow"
    />

  </OnboardingWrapper>

</template>

<script setup lang="ts">
import { ref, watchEffect, defineExpose, watch } from "vue";
import BulkUploadTable from "@packages/uikit/src/components/table-comps/bulk-upload-table.vue";
import { ITableHeaderType } from "@packages/models";
import { computed } from "vue";
import { useRouter } from "vue-router";
import OnboardingWrapper from "./onboarding-wrapper.vue";

// const props = defineProps<{
//   merchantPayload: any[];
//   isPrimaryActionDisabled: boolean;
// }>();

const emit = defineEmits<{
  (e: "update:merchantPayload", payload: any[]): void;
  (e: "stepComplete"): void;
  (e: "showError", message: string): void;
  (e: "update:isPrimaryActionDisabled", value: boolean): void;
}>();

const handleMerchantAgreementUpdate = async () => {};

const tableData = ref<any[]>([
  {
    id: 1,
    business_name: "",
    tin_number: "",
    business_certificate: "",
    form_3: "",
    optional_document: "",
  },
]);

const router = useRouter();

const tableHeaders = ref<ITableHeaderType[]>([
  {
    key: "business_name",
    label: "Business name",
    type: "text",
    readonly: true,
  },
  { key: "tin_number", label: "TIN", type: "text" },
  { key: "business_certificate", label: "Business Certificate", type: "file" },
  { key: "form_3", label: "Form 3", type: "file" },
  { key: "optional_document", label: "Optional Document", type: "file" },
]);

const stopClickHandler = ref<boolean>(false);
const businessPayload = ref({});

const isActionReady = computed(() => {
  return true;
});

// watchEffect(() => {
//   tableData.value = props.merchantPayload.map((merchant) => ({
//     ...merchant,
//     id: merchant.id,
//     tin: merchant.tin ?? "",
//     business_certificate: merchant.business_certificate ?? "",
//     form_3: merchant.form_3 ?? "",
//     optional_document: merchant.optional_document ?? "",
//   }));
// });

const handleUpdateRow = (
  rowId: string | number,
  field: string,
  value: string | number | File
) => {
  tableData.value = tableData.value.map((row) =>
    row.id === rowId ? { ...row, [field]: value } : row
  );
  emit("update:merchantPayload", [...tableData.value]);
};

const validate = (): boolean => {
  for (const row of tableData.value) {
    if (!row.tin || !row.business_certificate || !row.form_3) {
      return false;
    }
  }
  return true;
};

// watch(
//   tableData,
//   () => {
//     if (tableData.value.length === 0) {
//       emit("update:isPrimaryActionDisabled", true);
//       return;
//     }
//     const isValid = validate();
//     emit("update:isPrimaryActionDisabled", !isValid);

//     if (isValid) {
//       emit("stepComplete");
//     } else {
//       emit(
//         "showError",
//         "Please fill in all required business document fields."
//       );
//     }
//   },
//   { deep: true }
// );

defineExpose({ validate });
</script>
