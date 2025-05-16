<template>
  <div class="mt-8">
    <TextFieldInput
      :labelCompact="false"
      labelId="business_name"
      labelTitle="Business Name"
      :inputType="IInputType.Text"
      :inputValue="props.merchantPayload.business_name"
      @inputChanged="props.merchantPayload.business_name = $event"
      @inputValidated="props.payloadValidity.business_name = $event"
      inputPlaceholder="Enter a business name"
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Business name is a required field.',
      }"
    />

    <TextFieldInput
      :labelCompact="false"
      labelId="email"
      labelTitle="Business Email"
      :inputType="IInputType.Email"
      :inputValue="props.merchantPayload.email"
      @inputChanged="props.merchantPayload.email = $event"
      @inputValidated="props.payloadValidity.email = $event"
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
      :inputType="IInputType.Text"
      inputPlaceholder="Provide a business phone number."
      :isRequired="true"
      :activeCountryCode="props.phoneCountryCode"
      :inputValue="props.phoneNumberInput"
      @inputChanged="emit('update:phoneNumberInput', String($event))"
      @countryCodeChanged="emit('update:phoneCountryCode', $event)"
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
      :inputValue="props.merchantPayload.website_link"
      @inputChanged="props.merchantPayload.website_link = $event"
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
      :inputValue="props.merchantPayload.business_address"
      @inputChanged="props.merchantPayload.business_address = $event"
      @inputValidated="props.payloadValidity.business_address = $event"
      inputPlaceholder="Enter a business address."
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Business Address is a required field.',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, watch } from "vue";
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import PhoneFieldInput from "@packages/uikit/src/components/form-comps/phone-field-input.vue";
import { IInputType } from "@packages/models";

const props = defineProps({
  merchantPayload: { type: Object, required: true },
  payloadValidity: { type: Object, required: true },
  phoneNumberInput: { type: String, required: true },
  phoneCountryCode: { type: String, required: true },
  isPrimaryActionDisabled: { type: Boolean, required: true },
});

const emit = defineEmits([
  "update:phoneNumberInput",
  "update:phoneCountryCode",
  "update:isPrimaryActionDisabled",
]);

const isActionReady = computed(() => {
  const payload = props.merchantPayload;
  const validity = props.payloadValidity;

  return !(
    payload.business_name &&
    payload.email &&
    payload.phone_number &&
    payload.website_link &&
    payload.business_address &&
    validity.business_name &&
    validity.email &&
    validity.phone_number &&
    validity.website_link &&
    validity.business_address
  );
});

watch(isActionReady, (newVal) => {
  emit("update:isPrimaryActionDisabled", newVal);
});
</script>

<style scoped></style>
