<template>
  <StorefrontSetupWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'StoroOverview' })"
    @onContinueClick="handleStoreDetailsUpdate"
  >
    <TextFieldInput
      labelId="storeName"
      labelTitle="Storefront Name"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="storefrontPayload.name"
      inputPlaceholder="Provide a unique name for your store"
      :isRequired="true"
      :isDisabled="true"
      @inputChanged="storefrontPayload.name = $event"
      @inputValidated="storeNameValidity = $event"
      :errorHandler="{
        validator: 'validateAlphanumeric',
        message: 'Store name should only contain letters or numbers',
      }"
    />

    <TextFieldInput
      labelId="storeTagline"
      labelTitle="Tagline / Description"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="storefrontPayload.description"
      :isTextArea="true"
      inputPlaceholder="Provide a tagline or description for your store"
      :isRequired="true"
      @inputChanged="storefrontPayload.description = $event"
      :errorHandler="{
        validator: 'validateAlphanumeric',
        message: 'Store description should only contain letters or numbers',
      }"
    />

    <div class="form-block">
      <label class="form-label-basic">Storefront Logo</label>

      <FileUploadInput
        :showSkip="false"
        :hasDocumentUploaded="!!uploadedLogo"
        :uploadedDocumentContent="getUploadedLogoContent"
        fileUploadText="Click here to upload your logo"
        :uploadAction="uploadFile"
        @onDocumentUploaded="uploadedLogo = $event"
      />
    </div>
  </StorefrontSetupWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@packages/models";
import { TextFieldInput, FileUploadInput } from "@packages/uikit";
import { useGlobalStore } from "@/modules/global/store";
import StorefrontSetupWrapper from "@/modules/storefront/components/storefront-setup-wrapper.vue";

type IStorefrontType = {
  name: string;
  description: string;
};

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const { uploadFile } = useGlobalStore();

const storefrontPayload = ref<IStorefrontType>({
  name: "",
  description: "",
});

const storeNameValidity = ref<boolean>(false);

const uploadedLogo = ref<string>("");

const getUploadedLogoContent = computed(() => {
  return {
    name: uploadedLogo.value ? "Store Logo" : "",
    link: uploadedLogo.value,
  };
});

const isActionReady = computed(() => {
  return storefrontPayload.value.name &&
    storeNameValidity.value &&
    storefrontPayload.value.description &&
    uploadedLogo.value
    ? false
    : true;
});

const handleStoreDetailsUpdate = () => {
  router.push({ name: "SetupContactDetails" });
};
</script>
