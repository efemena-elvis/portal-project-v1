<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceBusinessVerification' })"
    @onContinueClick="handleRegistrationConfirmUpdate"
  >
    <TextFieldInput
      labelId="businessIncorporationNumber"
      labelTitle="Business Incorporation Number"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="business_incorporation_number"
      inputPlaceholder="Provide your business incorporation number"
      :isRequired="true"
      @inputChanged="business_incorporation_number = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Business incorporation number is a required field',
      }"
    />

    <div class="mt-12">
      <UploadGuidelines
        title="Please upload a document that:"
        :guidelines="['Is government issued and original']"
      />
    </div>

    <!-- DOCUMENT FIELD UPLOAD -->
    <div class="-mt-5 mb-14">
      <div class="form-block">
        <label class="form-label-basic"
          >Certificate of business incorporation (Optional)</label
        >
        <FileUploadInput
          showSkip
          skipRoute="ComplianceRegistrationTax"
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
  name: "Certificate of incorporation",
  link: getComplianceRegistration.value?.doc_url || "",
});

const business_incorporation_number = ref<string>(
  getComplianceRegistration.value?.number || ""
);

const getUploadedDocumentContent = computed(() => {
  return uploadedDocumentContent.value;
});

const isActionReady = computed(() => {
  return business_incorporation_number.value || uploadedDocument.value
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  return {
    number: business_incorporation_number.value,
    doc_url: uploadedDocument.value,
  };
});

const handleRegistrationConfirmUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "ComplianceRegistrationTax",
    stopClickHandler,
    succesMsg: "Registration document submitted",
    errorMsg: "Registration update failed",
    payloadType: "registration",
  });
};

watch(
  getComplianceRegistration,
  (newValue) => {
    if (newValue) {
      business_incorporation_number.value = newValue.number || "";
      uploadedDocument.value = newValue.doc_url || "";

      uploadedDocumentContent.value = {
        name: "Certificate of incorporation",
        link: newValue.doc_url || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
