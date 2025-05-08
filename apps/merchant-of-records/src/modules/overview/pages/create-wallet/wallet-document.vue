<template>
  <MarketWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'VesicashWalletEntry' })"
    @onContinueClick="handleWalletDocumentFlow"
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
        <label class="form-label-basic"
          >Certificate of business incorporation in
          {{ route.query.country }}</label
        >
        <FileUploadInput
          :hasDocumentUploaded="!!uploadedDocument"
          :uploadedDocumentContent="getUploadedDocumentContent"
          :uploadAction="uploadFile"
          @onDocumentUploaded="uploadedDocument = $event"
        />
      </div>
    </div>
  </MarketWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { UploadGuidelines, FileUploadInput } from "@packages/uikit";
import { MarketWrapper } from "@/modules/overview/components";
import { useGlobalStore } from "@/modules/global/store";
import { useOverviewStore } from "@/modules/overview/store";

const route = useRoute();
const router = useRouter();

const { uploadFile } = useGlobalStore();
const { createWallet } = useOverviewStore();

const stopClickHandler = ref<boolean>(false);
const uploadedDocument = ref<string>("");

const uploadedDocumentContent = ref<{ name: string; link: string }>({
  name: "Certificate of incorporation",
  link: "",
});

const getUploadedDocumentContent = computed(() => {
  return uploadedDocumentContent.value;
});

const isActionReady = computed(() => {
  return uploadedDocument.value ? false : true;
});

const getMarketPayload = computed(() => {
  return {
    currency: route.query.currency,
    countryId: route.query.country_id,
    doc_url: uploadedDocument.value,
  };
});

const handleWalletDocumentFlow = async () => {
  const response = await processAPIRequest({
    action: createWallet,
    payload: getMarketPayload.value,
    alertHandler: {
      201: {
        message: "Merchant Wallet request sent",
        type: "success",
      },

      400: {
        message: "Wallet request failed",
        type: "error",
      },

      500: {
        message: "Wallet request failed",
        type: "error",
      },
    },
  });

  if (response?.code === 201) {
    setTimeout(() => router.push({ name: "VesicashWalletStatus" }), 600);
    stopClickHandler.value = false;
  } else {
    stopClickHandler.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
