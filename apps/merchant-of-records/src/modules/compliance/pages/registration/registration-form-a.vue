<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceRegistrationTax' })"
    @onContinueClick="handleRegistrationConfirmUpdate"
  >
    <UploadGuidelines
      title="Please upload a document that:"
      :guidelines="[
        'Is government issued',
        'Is full-sized, original and unedited',
      ]"
    />

    <!-- DOCUMENT FIELD UPLOAD -->
    <div class="mb-14">
      <div class="form-block">
        <label class="form-label-basic">Form A or Memart</label>
        <FileUploadInput
          showSkip
          skipRoute="ComplianceRepresentativeProfile"
          :hasDocumentUploaded="!!uploadedDocument"
          :uploadedDocumentContent="getUploadedDocumentContent"
          :uploadAction="uploadFile"
          @onDocumentUploaded="uploadedDocument = $event"
        />
      </div>
    </div>
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useComplianceUtil } from "@packages/hooks";
import { UploadGuidelines, FileUploadInput } from "@packages/uikit";
import { ComplianceWrapper } from "@/modules/compliance/components";
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";

const router = useRouter();

const { uploadFile } = useGlobalStore();
const complianceStore = useComplianceStore();

const complianceUtil = new useComplianceUtil(complianceStore);
const { getComplianceRegistration } = storeToRefs(complianceStore);

const stopClickHandler = ref<boolean>(false);
const uploadedDocument = ref<string>("");

const uploadedDocumentContent = ref<{ name: string; link: string }>({
  name: "Form A/Memart",
  link: getComplianceRegistration.value?.form_a_doc_url || "",
});

const getUploadedDocumentContent = computed(() => {
  return uploadedDocumentContent.value;
});

const isActionReady = computed(() => {
  return uploadedDocument.value ? false : true;
});

const getBusinessPayload = computed(() => {
  return {
    form_a_doc_url: uploadedDocument.value,
  };
});

const handleRegistrationConfirmUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload.value,
    redirectRoute: "ComplianceRepresentativeProfile",
    stopClickHandler,
    successMsg: "Registration document submitted",
    errorMsg: "Registration update failed",
    payloadType: "registration",
  });
};

watch(
  getComplianceRegistration,
  (newValue) => {
    if (newValue) {
      uploadedDocument.value = newValue.form_a_doc_url || "";

      uploadedDocumentContent.value = {
        name: "Form A/Memart",
        link: newValue.form_a_doc_url || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
