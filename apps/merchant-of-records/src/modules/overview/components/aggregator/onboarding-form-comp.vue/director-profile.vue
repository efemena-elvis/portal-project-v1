<template>
  <div class="mt-4">
    <TextFieldInput
      :labelCompact="false"
      labelId="director_name"
      labelTitle="Director's Name"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.director_name"
      @inputChanged="merchantPayload.director_name = $event"
      @inputValidated="props.payloadValidity.director_name = $event"
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
      @inputValidated="props.payloadValidity.director_address = $event"
      inputPlaceholder="Enter the director's address."
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Director Address is a required field.',
      }"
    />
  </div>
  <div>
      <h2 class="mb-4 text-sm font-semibold text-grey-900">
        Director's Identity verification
      </h2>
      <FileUploadInput
        id="merchants"
        :hasDocumentUploaded="!!merchantPayload.merchants"
        :uploadAction="uploadFile"
        @onDocumentUploaded="merchantPayload.merchants = $event"
      />
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
