<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceBusinessAddress' })"
    @onContinueClick="handleBusinessConfirmUpdate"
  >
    <UploadGuidelines
      title="Please upload a proof of address that:"
      :guidelines="[
        `Confirm your business address at: <br/> ${businessAddress || '------'}`,
        'Is less than 3 months old either in JPG, JPEG, PNG or PDF',
      ]"
    />

    <!-- <UploadGuidelines
      title="We accept any ONE of the following documents:"
      :guidelines="[
        'Bank statement',
        'Utility bills (e.g electricity, water bills)',
        'Signed lease/tenancy agreement',
      ]"
    /> -->

    <SelectFieldInput
      labelId="DocumentType"
      labelTitle="Document Type"
      :labelCompact="false"
      inputPlaceholder="Select document type"
      :inputValue="businessPayload.doc_type"
      :selectData="documentTypes"
      isRequired
      @onSelectionChange="businessPayload.doc_type = $event"
    />

    <!-- DOCUMENT FIELD UPLOAD -->
    <div class="mb-14">
      <FileUploadInput
        showSkip
        skipRoute="ComplianceRegistrationDocuments"
        :hasDocumentUploaded="!!uploadedDocument"
        :uploadedDocumentContent="getUploadedDocumentContent"
        :uploadAction="uploadFile"
        @onDocumentUploaded="uploadedDocument = $event"
      />
    </div>
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import {
  UploadGuidelines,
  FileUploadInput,
  SelectFieldInput,
} from "@packages/uikit";
import { useComplianceUtil } from "@packages/hooks";
import { ComplianceWrapper } from "@/modules/compliance/components";
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";

type IBusinessType = {
  doc_type: string;
};

const router = useRouter();

const { uploadFile } = useGlobalStore();
const stopClickHandler = ref<boolean>(false);

const complianceStore = useComplianceStore();
const { getComplianceBusiness } = storeToRefs(complianceStore);

const complianceUtil = new useComplianceUtil(complianceStore);

const businessPayload = ref<IBusinessType>({
  doc_type: getComplianceBusiness.value?.doc_type || "",
});

const computeBusinessAddress = computed(() => {
  if (getComplianceBusiness.value?.first_address?.length)
    return getComplianceBusiness.value.first_address;

  return "----";
});

const businessAddress = ref<string>(computeBusinessAddress.value || "");
const uploadedDocument = ref<string>(
  getComplianceBusiness.value?.doc_url || ""
);

const getUploadedDocumentContent = computed(() => {
  return {
    name: getComplianceBusiness.value?.doc_type?.split("_").join(" "),
    link: getComplianceBusiness.value?.doc_url,
  };
});

const documentTypes = ref<{ value: string; name: string }[]>([
  {
    value: "bank_statement",
    name: "Bank statement",
  },
  {
    value: "utility_bills",
    name: "Utility bills",
  },
  {
    value: "tenancy_agreement",
    name: "Signed lease / tenancy agreement",
  },
]);

const isActionReady = computed(() => {
  return businessPayload.value.doc_type && uploadedDocument.value
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  return {
    doc_type: businessPayload.value.doc_type,
    doc_url: uploadedDocument.value,
  };
});

const handleBusinessConfirmUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload.value,
    redirectRoute: "ComplianceRegistrationDocuments",
    stopClickHandler,
    succesMsg: "Business address document submitted",
    errorMsg: "Business update failed",
    payloadType: "business",
  });
};

watch(
  getComplianceBusiness,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        doc_type: newValue.doc_type || "",
      };

      businessAddress.value = newValue.first_address;
      uploadedDocument.value = newValue.doc_url;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
