<template>
  <div class="mt-4">
    <TextFieldInput
      :labelCompact="false"
      labelId="business_name"
      labelTitle="Business Name"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.business_name"
      @inputChanged="merchantPayload.business_name = $event"
      @inputValidated="props.payloadValidity.business_name = $event"
      inputPlaceholder="Enter a business name"
      isRequired
      :errorHandler="{
        validator: 'validateEmail',
        message: 'Business name is a required field.',
      }"
    />
    <TextFieldInput
      :labelCompact="false"
      labelId="business_email"
      labelTitle="Business Email"
      :inputType="IInputType.Email"
      :inputValue="merchantPayload.business_email"
      @inputChanged="merchantPayload.business_email = $event"
      @inputValidated="props.payloadValidity.business_email = $event"
      inputPlaceholder="e.g.johndoe@businessname.com"
      isRequired
      :errorHandler="{
        validator: 'validateEmail',
        message: 'Email is a required field.',
      }"
    />
    <PhoneFieldInput
      labelId="phoneNumber"
      labelTitle="Phone Number"
      inputPlaceholder="Provide a business phone number."
      :inputType="IInputType.Number"
      :isRequired="true"
      :activeCountryCode="phoneCountryCode"
      :inputValue="phoneNumberInput"
      @inputChanged="phoneNumberInput = $event"
      @countryCodeChanged="phoneCountryCode = $event"
      @inputValidated="props.payloadValidity.phone_number = $event"
      :errorHandler="{
        validator: 'validatePhone',
        message: 'Phone number is a required field.',
      }"
    />
    <TextFieldInput
      :labelCompact="false"
      labelId="website_link"
      labelTitle="Website Link"
      :inputType="IInputType.Url"
      :inputValue="merchantPayload.website_link"
      @inputChanged="merchantPayload.website_link = $event"
      @inputValidated="props.payloadValidity.website_link = $event"
      inputPlaceholder="e.g. https://businessname.com"
      isRequired
      :errorHandler="{
        validator: 'validateURL',
        message: 'Website link is a required field.',
      }"
    />
    <TextFieldInput
      :labelCompact="false"
      labelId="business_address"
      labelTitle="Business Address"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.business_address"
      @inputChanged="merchantPayload.business_address = $event"
      @inputValidated="props.payloadValidity.business_address = $event"
      inputPlaceholder="Enter a business address."
      isRequired
      :errorHandler="{
        validator: 'validateEmail',
        message: 'Business Address is a required field.',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import PhoneFieldInput from "@packages/uikit/src/components/form-comps/phone-field-input.vue";
import { defineProps, ref } from "vue";
import { IInputType } from "@packages/models";

const phoneCountryCode = ref("234");
const phoneNumberInput = ref("");

const props = defineProps({
  merchantPayload: { type: Object, required: true },
  payloadValidity: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
