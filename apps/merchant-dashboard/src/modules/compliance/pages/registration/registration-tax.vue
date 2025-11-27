<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceRegistrationDocuments' })"
    @onContinueClick="handleRegistrationConfirmUpdate"
  >
    <TextFieldInput
      labelId="businessIncorporationNumber"
      labelTitle="Tax identification Number"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="tax_identification_number"
      inputPlaceholder="Provide your tax identification number"
      :isRequired="true"
      @inputChanged="tax_identification_number = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Tax identification number is a required field',
      }"
    />

    <div class="mt-12">
      <UploadGuidelines
        title="Please upload a document that:"
        :guidelines="['Is government issued and original']"
      />
    </div>

    <!-- DOCUMENT FIELD UPLOAD -->
    <div class="mb-14">
      <div class="form-block">
        <label class="form-label-basic"
          >Business tax identification (Optional)</label
        >
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
import {
  UploadGuidelines,
  FileUploadInput,
  TextFieldInput,
} from "@packages/uikit";
import { ComplianceWrapper } from "@/modules/compliance/components";
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";
import { IInputType } from "@packages/models";

const router = useRouter();

const { uploadFile } = useGlobalStore();
const complianceStore = useComplianceStore();

const complianceUtil = new useComplianceUtil(complianceStore);
const { getComplianceRegistration } = storeToRefs(complianceStore);

const stopClickHandler = ref<boolean>(false);
const uploadedDocument = ref<string>("");

const uploadedDocumentContent = ref<{ name: string; link: string }>({
  name: "Business tax registeration",
  link: getComplianceRegistration.value?.tax_doc_url || "",
});

const tax_identification_number = ref<string>(
  getComplianceRegistration.value?.tax_number || ""
);

const getUploadedDocumentContent = computed(() => {
  return uploadedDocumentContent.value;
});

const isActionReady = computed(() => {
  return tax_identification_number.value || uploadedDocument.value
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  return {
    tax_number: tax_identification_number.value,
    tax_doc_url: uploadedDocument.value,
  };
});

const handleRegistrationConfirmUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload.value,
    redirectRoute: "ComplianceRepresentativeProfile",
    stopClickHandler,
    successMsg: "Registration tax document submitted",
    errorMsg: "Registration update failed",
    payloadType: "registration",
  });
};

watch(
  getComplianceRegistration,
  (newValue) => {
    if (newValue) {
      tax_identification_number.value = newValue.tax_number || "";
      uploadedDocument.value = newValue.tax_doc_url || "";

      uploadedDocumentContent.value = {
        name: "Business tax registeration",
        link: newValue.tax_doc_url || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
