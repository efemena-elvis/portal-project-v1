<template>
  <div class="mt-4">
    <TextFieldInput
      :labelCompact="false"
      labelId="ultimate_business_owner_name"
      labelTitle="Ultimate Business Owner's Name"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.dultimate_business_owner_name"
      @inputChanged="merchantPayload.ultimate_business_owner_name = $event"
      @inputValidated="props.payloadValidity.ultimate_business_owner_name = $event"
      inputPlaceholder="Enter Name"
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Name is a required field.',
      }"
    />

    <TextFieldInput
      :labelCompact="false"
      labelId="ultimate_business_owner_address"
      labelTitle="Ultimate Business Owner's Address"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.ultimate_business_owner_address"
      @inputChanged="merchantPayload.ultimate_business_owner__address = $event"
      @inputValidated="props.payloadValidity.ultimate_business_owner_address = $event"
      inputPlaceholder="Enter the director's address."
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Address is a required field.',
      }"
    />
  </div>
<div v-if="showMoreFields">
     <TextFieldInput
      :labelCompact="false"
      labelId="ultimate_business_owner_name_2"
      labelTitle="Ultimate Business Owner's Name (2)"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.dultimate_business_owner_name_2"
      @inputChanged="merchantPayload.ultimate_business_owner_name_2 = $event"
      @inputValidated="props.payloadValidity.ultimate_business_owner_name_2 = $event"
      inputPlaceholder="Enter Name"
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Name is a required field.',
      }"
    />

    <TextFieldInput
      :labelCompact="false"
      labelId="ultimate_business_owner_address (2)"
      labelTitle="Ultimate Business Owner's Address (2)"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.ultimate_business_owner_address_2"
      @inputChanged="merchantPayload.ultimate_business_owner__address_2 = $event"
      @inputValidated="props.payloadValidity.ultimate_business_owner_address_2 = $event"
      inputPlaceholder="Enter the director's address."
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Address is a required field.',
      }"
    />
  </div>
 <button class="cursor-pointer p-2 text-center gap-2 rounded-md border border-grey-200 w-[100px] mt-4" @click="showMoreFields = !showMoreFields" v-if="showMoreFields">

  <span>Cancel</span>
  </button>
  <button class="cursor-pointer p-2 flex items-center gap-2 rounded-md border border-grey-200 w-[100px] mt-4" @click="showMoreFields = !showMoreFields" v-if="!showMoreFields">
  <div class="icon-add"></div>
  <span>Add another</span>
  </button>
   
</template>

<script setup lang="ts">
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import PhoneFieldInput from "@packages/uikit/src/components/form-comps/phone-field-input.vue";
import FileUploadInput from "@packages/uikit/src/components/form-comps/file-upload-input.vue";
import { defineProps, ref } from "vue";
import { IInputType } from "@packages/models";
import { useGlobalStore } from "@/modules/global/store";

const { uploadFile } = useGlobalStore();

const showMoreFields = ref(false)

const props = defineProps({
  merchantPayload: { type: Object, required: true },
  payloadValidity: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
