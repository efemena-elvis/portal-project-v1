<template>
  <div class="mt-4">

  <div class="mt-4">
      <h2 class="mb-4 text-sm font-semibold text-grey-900">
     Upload Business Cretificate
      </h2>
      <FileUploadInput
        id="business_certificate"
        :hasDocumentUploaded="!!merchantPayload.business_certificate"
        :uploadAction="uploadFile"
        @onDocumentUploaded="merchantPayload.business_certificate = $event"
      />
      </div>
  <div class="mt-4">
      <h2 class="mb-4 text-sm font-semibold text-grey-900">
       Upload Form 3
      </h2>
      <FileUploadInput
        id="merchants"
        :hasDocumentUploaded="!!merchantPayload.form_3"
        :uploadAction="uploadFile"
        @onDocumentUploaded="merchantPayload.form_3 = $event"
      />
      </div>
  </div>
</template>

<script setup lang="ts">
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import PhoneFieldInput from "@packages/uikit/src/components/form-comps/phone-field-input.vue";
import FileUploadInput from "@packages/uikit/src/components/form-comps/file-upload-input.vue";
import { defineProps, ref } from "vue";
import { IInputType } from "@packages/models";
import { useGlobalStore } from "@/modules/global/store";

const { uploadFile } = useGlobalStore();

const props = defineProps({
  merchantPayload: { type: Object, required: true },
  payloadValidity: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
