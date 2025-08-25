<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceRepresentativeProfile' })"
    @onContinueClick="handleRepresentativeIdentityUpdate"
  >
    <UploadGuidelines
      title="Please upload a document that:"
      :guidelines="[
        'Is government issued',
        'Is full-sized, original and unedited',
      ]"
    />

    <SelectFieldInput
      labelId="selectDocumentID"
      labelTitle="Select Identification Document"
      inputPlaceholder="Select identification document"
      inputBaseColor="bg-grey-10"
      :inputValue="businessPayload.type"
      :selectData="documentList"
      isRequired
      @onSelectionChange="handleSelectChange"
    />

    <!-- DOCUMENT FIELD UPLOAD -->
    <div class="mb-14">
      <FileUploadInput
        showSkip
        skipRoute="ComplianceBankAccount"
        :hasDocumentUploaded="!!uploadedDocument"
        :uploadedDocumentContent="getUploadedDocumentContent"
        :uploadAction="uploadFile"
        @onDocumentUploaded="
          {
            uploadedDocument = $event;
            businessPayload.url = $event;
          }
        "
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
  type: string;
  value: string;
  url: string;
};

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const { uploadFile } = useGlobalStore();

const complianceStore = useComplianceStore();
const { getComplianceRepresentative } = storeToRefs(complianceStore);

const complianceUtil = new useComplianceUtil(complianceStore);

const businessPayload = ref<IBusinessType>({
  type: getComplianceRepresentative.value?.[0]?.doc.type || "",
  value: getComplianceRepresentative.value?.[0]?.doc.value || "",
  url: getComplianceRepresentative.value?.[0]?.doc.url || "",
});

const uploadedDocument = ref<string>(
  getComplianceRepresentative.value?.[0]?.doc.url || ""
);

const getUploadedDocumentContent = computed(() => {
  return {
    name: getComplianceRepresentative.value?.[0].doc.type?.split("_").join(" "),
    link: getComplianceRepresentative.value?.[0].doc.url,
  };
});

const documentList = ref<{ value: string; name: string }[]>([
  { value: "drivers_license", name: "Driver's License" },
  {
    value: "national_identification_number",
    name: "National Identification Number",
  },
  { value: "voters_card", name: "Voter's Card" },
  { value: "passport", name: "International Passport" },
]);

const selectedDocumentName = ref<string>(
  getComplianceRepresentative.value?.[0].doc.type?.split("_").join(" ") || ""
);

const handleSelectChange = (value: string): void => {
  const selected = documentList.value.find((doc) => doc.value === value);

  businessPayload.value.type = selected ? selected.value : "";
  selectedDocumentName.value = selected ? selected.name : "";
};

const isActionReady = computed(() => {
  return businessPayload.value.type && businessPayload.value.url ? false : true;
});

const getBusinessPayload = computed(() => {
  const { type, value, url } = businessPayload.value;
  return { doc: { type, value, url } };
});

const handleRepresentativeIdentityUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "ComplianceBankAccount",
    stopClickHandler,
    succesMsg: "Representative identity submitted",
    errorMsg: "Representative update failed",
    payloadType: "representatives",
  });
};

watch(
  getComplianceRepresentative,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      businessPayload.value = {
        type: newValue[0]?.doc.type || "",
        value: newValue[0]?.doc.value || "",
        url: newValue[0]?.doc.url || "",
      };

      uploadedDocument.value = newValue[0]?.doc.url || "";
      selectedDocumentName.value =
        newValue[0]?.doc.type?.split("_").join(" ") || "";
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
