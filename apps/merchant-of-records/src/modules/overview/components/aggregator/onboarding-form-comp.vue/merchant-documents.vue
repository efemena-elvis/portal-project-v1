<template>
  <form class="mt-8" ref="merchantDocumentsRef" @submit.prevent>
    <div>
      <h2 class="mb-4 text-sm font-semibold text-grey-900">
        Upload Business Certificate
      </h2>
      <FileUploadInput
        id="business_certificate_url"
        :hasDocumentUploaded="!!merchantPayload.business_certificate_url"
        :uploadAction="uploadFile"
        @onDocumentUploaded="merchantPayload.business_certificate_url = $event"
      />
    </div>
    <div class="mt-4">
      <h2 class="mb-4 text-sm font-semibold text-grey-900">Upload Form 3</h2>
      <FileUploadInput
        id="form3_url"
        :hasDocumentUploaded="!!merchantPayload.form3_url"
        :uploadAction="uploadFile"
        @onDocumentUploaded="merchantPayload.form3_url = $event"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import FileUploadInput from "@packages/uikit/src/components/form-comps/file-upload-input.vue";
import { defineProps, defineEmits, computed, watch } from "vue";
import { useGlobalStore } from "@/modules/global/store";

const { uploadFile } = useGlobalStore();

const props = defineProps({
  merchantPayload: { type: Object, required: true },
  payloadValidity: { type: Object, required: true },
  isPrimaryActionDisabled: { type: Boolean, required: true },
});

const emit = defineEmits(["update:isPrimaryActionDisabled"]);

const isActionReady = computed(() => {
  const payload = props.merchantPayload;
  const validity = props.payloadValidity;

  return (
    payload.business_certificate_url &&
    payload.form3_url &&
    validity.business_certificate_url &&
    validity.form3_url
  );
});

watch(isActionReady, (newVal) => {
  emit("update:isPrimaryActionDisabled", newVal);
});

emit("update:isPrimaryActionDisabled", isActionReady.value);
</script>

<style scoped></style>
