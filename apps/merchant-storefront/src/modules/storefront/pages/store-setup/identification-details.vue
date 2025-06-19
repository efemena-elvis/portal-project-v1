<template>
  <StorefrontSetupWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'SetupPaymentDetails' })"
    @onContinueClick="handleIdentificationDetailsUpdate"
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
        @onDocumentUploaded="uploadedDocument = $event"
      />
    </div>
  </StorefrontSetupWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { IInputType } from "@packages/models";
import {
  UploadGuidelines,
  FileUploadInput,
  SelectFieldInput,
} from "@packages/uikit";
import StorefrontSetupWrapper from "@/modules/storefront/components/storefront-setup-wrapper.vue";
import { useGlobalStore } from "@/modules/global/store";

type IBusinessType = {
  type: string;
  value: string;
  url: string;
};

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const { uploadFile } = useGlobalStore();

const businessPayload = ref<IBusinessType>({
  type: "",
  value: "",
  url: "",
});

const uploadedDocument = ref<string>("");

const getUploadedDocumentContent = computed(() => {
  return {
    name: "",
    link: "",
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

const selectedDocumentName = ref<string>("");

const handleSelectChange = (value: string): void => {
  const selected = documentList.value.find((doc) => doc.value === value);

  businessPayload.value.type = selected ? selected.value : "";
  selectedDocumentName.value = selected ? selected.name : "";
};

const isActionReady = computed(() => {
  return businessPayload.value.type && businessPayload.value.url ? false : true;
});

const handleIdentificationDetailsUpdate = () => {
  router.push({ name: "StoreOverview" });
};
</script>

<style scoped lang="scss">
.form-wrapper {
  @apply flex flex-col justify-start items-start gap-y-3;

  .form-input-block {
    @apply relative w-full;
  }

  .form-input {
    @apply w-full text-grey-600 text-[13.5px] placeholder:text-[13.5px] py-[12.75px] px-4 border-grey-300 hover:border-green-400/80 focus:border-green-400;
  }

  .form-input-block {
    @apply relative w-full flex justify-start items-center;

    .form-placeholder {
      @apply text-grey-500/65 mr-[1px];
    }

    .icon-caret-down {
      @apply absolute top-1/2 right-4 transform -translate-y-1/2 text-grey-700 text-sm z-10;
    }
  }
}
</style>
