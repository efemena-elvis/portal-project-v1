<template>
  <OnboardingWrapper
    :isPrimaryActionDisabled="!isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'UboDetails1' })"
    @onContinueClick="handleBusinessDocumentsUpdate"
    :showActionRow="true"
    primaryActionText="Onboard Merchants"
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
import { useMerchantUtils } from "@packages/hooks/src/useMerchantUtils";
import { onboardMerchant } from "@/modules/overview/store/actions";
import { useEvents } from "@packages/hooks";

const router = useRouter();
const merchantStore = useMerchantUtils();

interface TableRow {
  id: number;
  business_name: string;
  tin_number: string;
  business_certificate: string;
  form_3: string;
  optional_document: string;
}

const { processAPIRequest, pushToastAlert } = useEvents();

const tableHeaders = ref([
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

const tableData = ref<TableRow[]>([]);

const stopClickHandler = ref(false);
const onboardMerchantBtnRef = ref<HTMLButtonElement | null>(null);

const initializeTableData = () => {
  if (merchantStore.businessProfile.length) {
    tableData.value = merchantStore.businessProfile.map((merchant, idx) => ({
      id: idx + 1,
      business_name: merchant.business_name || "",
      tin_number: "",
      business_certificate: "",
      form_3: "",
      optional_document: "",
    }));
  } else {
    tableData.value = [
      {
        id: 1,
        business_name: "",
        tin_number: "",
        business_certificate: "",
        form_3: "",
        optional_document: "",
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
  tableData.value.every((row) => row.business_name && row.tin_number)
);

const handleBusinessDocumentsUpdate = async () => {
  const data = [...tableData.value];

  const documentsPayload = data
    .flatMap((row) => [
      {
        id: row.id,
        type: "business_certificate",
        url: row.business_certificate,
        tin_number: row.tin_number,
      },
      {
        id: row.id,
        type: "form_3",
        url: row.form_3,
        tin_number: row.tin_number,
      },
      {
        id: row.id,
        type: "optional_document",
        url: row.optional_document,
        tin_number: row.tin_number,
      },
    ])
    .filter((doc) => doc.url && typeof doc.url === "string");

  const uniqueDocumentsPayload = documentsPayload.filter(
    (doc, index, self) =>
      index ===
      self.findIndex(
        (d) =>
          d.id === doc.id &&
          d.url === doc.url &&
          d.type === doc.type &&
          d.tin_number === doc.tin_number
      )
  );
  merchantStore.setBusinessDocuments(uniqueDocumentsPayload);

  merchantStore.setMerchantTable([...tableData.value]);

  try {
    try {
      const response = await processAPIRequest({
        action: onboardMerchant,
        btnRef: onboardMerchantBtnRef,
        btnText: "Next",
        payload: merchantStore.getFullPayload(),
        showAlert: true,
      });

      if (response.code === 201) {
        pushToastAlert({
          message: "Merchants onboarded successfully.",
          type: "success",
        });
        router.push("/merchant/add-merchant-status");
      } else {
        pushToastAlert({
          message: response.error.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error("Error during business documents update:", error);
  }

  // console.log("✅ Final merchant payload:", merchantStore.getFullPayload());
};

onMounted(() => {
  initializeTableData();
});
</script>
