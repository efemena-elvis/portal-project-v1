<template>
  <div class="mt-8">
    <TextFieldInput
      :labelCompact="false"
      labelId="director_name"
      labelTitle="Director's Name"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.director_name"
      @inputChanged="merchantPayload.director_name = $event"
      @inputValidated="payloadValidity.director_name = $event"
      inputPlaceholder="Enter the director's name"
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Director name is a required field.',
      }"
    />

    <TextFieldInput
      :labelCompact="false"
      labelId="director_address"
      labelTitle="Director's Address"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.director_address"
      @inputChanged="merchantPayload.director_address = $event"
      @inputValidated="payloadValidity.director_address = $event"
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
      :hasDocumentUploaded="!!merchantPayload.director_identity_verification"
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
  props.merchantPayload.director_identity_verification = file;
  props.payloadValidity.director_identity_verification = true;
};

const isActionReady = computed(() => {
  const payload = props.merchantPayload;
  const validity = props.payloadValidity;

  return (
    payload.director_name &&
    payload.director_address &&
    payload.director_identity_verification &&
    validity.director_name &&
    validity.director_address &&
    validity.director_identity_verification
  );
});

watch(isActionReady, (ready) => {
  emit("update:isPrimaryActionDisabled", !ready);
});

emit("update:isPrimaryActionDisabled", !isActionReady.value);
</script>
