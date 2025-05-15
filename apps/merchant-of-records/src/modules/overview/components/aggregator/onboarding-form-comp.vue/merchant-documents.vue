<template>
  <form class="mt-8" ref="merchantDocumentsRef" @submit.prevent>
    <div>
      <h2 class="mb-4 text-sm font-semibold text-grey-900">
        Upload Business Certificate
      </h2>
      <FileUploadInput
        id="business_certificate"
        :hasDocumentUploaded="!!merchantPayload.business_certificate"
        :uploadAction="uploadFile"
        @onDocumentUploaded="merchantPayload.business_certificate = $event"
      />
    </div>
    <div class="mt-4">
      <h2 class="mb-4 text-sm font-semibold text-grey-900">Upload Form 3</h2>
      <FileUploadInput
        id="form_3"
        :hasDocumentUploaded="!!merchantPayload.form_3"
        :uploadAction="uploadFile"
        @onDocumentUploaded="merchantPayload.form_3 = $event"
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
    payload.business_certificate &&
    payload.form_3 &&
    validity.business_certificate &&
    validity.form_3
  );
});

watch(isActionReady, (newVal) => {
  emit("update:isPrimaryActionDisabled", newVal);
});

emit("update:isPrimaryActionDisabled", isActionReady.value);
</script>

<style scoped></style>
