<template>
  <div class="mt-8">
    <TextFieldInput
      :labelCompact="false"
      labelId="directors_name"
      labelTitle="Director's Name"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.directors_name"
      @inputChanged="merchantPayload.directors_name = $event"
      @inputValidated="payloadValidity.directors_name = $event"
      inputPlaceholder="Enter the director's name"
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Director name is a required field.',
      }"
    />

    <TextFieldInput
      :labelCompact="false"
      labelId="directors_address"
      labelTitle="Director's Address"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.directors_address"
      @inputChanged="merchantPayload.directors_address = $event"
      @inputValidated="payloadValidity.directors_address = $event"
      inputPlaceholder="Enter the director's address."
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Director address is a required field.',
      }"
    />
  </div>

  <div>
    <h2 class="mb-4 text-sm font-semibold text-grey-900">
      Director's Identity Verification
    </h2>
    <FileUploadInput
      id="directors_verification"
      :hasDocumentUploaded="!!merchantPayload.directors_id_document_url"
      :uploadAction="uploadFile"
      @onDocumentUploaded="handleDocumentUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, watch } from "vue";
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import FileUploadInput from "@packages/uikit/src/components/form-comps/file-upload-input.vue";
import { IInputType } from "@packages/models";
import { useGlobalStore } from "@/modules/global/store";

const { uploadFile } = useGlobalStore();

const props = defineProps({
  merchantPayload: { type: Object, required: true },
  payloadValidity: { type: Object, required: true },
  isPrimaryActionDisabled: { type: Boolean, required: true },
});

const emit = defineEmits(["update:isPrimaryActionDisabled"]);

const handleDocumentUpload = (file: string) => {
  props.merchantPayload.directors_id_document_url = file;
  props.payloadValidity.directors_id_document_url = true;
};

const isActionReady = computed(() => {
  const payload = props.merchantPayload;
  const validity = props.payloadValidity;

  return (
    payload.directors_name &&
    payload.directors_address &&
    payload.directors_id_document_url &&
    validity.directors_name &&
    validity.directors_address &&
    validity.directors_id_document_url
  );
});

watch(isActionReady, (ready) => {
  emit("update:isPrimaryActionDisabled", !ready);
});

emit("update:isPrimaryActionDisabled", !isActionReady.value);
</script>
