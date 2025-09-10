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
      :inputValue="selectedDocumentName[currentIndex]"
      :selectData="documentList"
      isRequired
      @onSelectionChange="handleSelectChange"
    />

    <div class="mb-14">
      <FileUploadInput
        showSkip
        skipRoute="ComplianceSummary"
        :hasDocumentUploaded="!!uploadedDocument[currentIndex]"
        :uploadedDocumentContent="getUploadedDocumentContent"
        :uploadAction="uploadFile"
        @onDocumentUploaded="uploadedDocument[currentIndex] = $event"
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
import { get } from "http";

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

// track which representative is being edited
const currentIndex = ref<number>(0);

const businessPayload = ref<IBusinessType[]>(
  getComplianceRepresentative.value?.map((rep) => ({
    type: rep.doc?.type || "",
    value: rep.doc?.value || "",
    url: rep.doc?.url || "",
  })) || []
);

const uploadedDocument = ref<string[]>(
  getComplianceRepresentative.value?.map((rep) => rep.doc?.url || "") || []
);

const selectedDocumentName = ref<string[]>(
  getComplianceRepresentative.value?.map(
    (rep) => rep.doc?.type?.split("_").join(" ") || ""
  ) || []
);

const getUploadedDocumentContent = computed(() => {
  const rep = getComplianceRepresentative.value?.[currentIndex.value];
  return {
    name: rep?.doc?.type?.split("_").join(" "),
    link: rep?.doc?.url,
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

const handleSelectChange = (value: string): void => {
  const selected = documentList.value.find((doc) => doc.value === value);
  businessPayload.value[currentIndex.value].type = selected
    ? selected.value
    : "";
  selectedDocumentName.value[currentIndex.value] = selected
    ? selected.name
    : "";
};

const isActionReady = computed(() => {
  return businessPayload.value.some((rep) => !rep.type || !rep.url);
});

const getBusinessPayload = computed(() => {
  return businessPayload.value.map(({ type, value, url }) => ({
    doc: { type, value, url },
  }));
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
      businessPayload.value = newValue.map((rep) => ({
        type: rep.doc?.type || "",
        value: rep.doc?.value || "",
        url: rep.doc?.url || "",
      }));
      uploadedDocument.value = newValue.map((rep) => rep.doc?.url || "");
      selectedDocumentName.value = newValue.map(
        (rep) => rep.doc?.type?.split("_").join(" ") || ""
      );
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
