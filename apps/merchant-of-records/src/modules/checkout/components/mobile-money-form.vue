<!-- MobileMoneyForm.vue -->
<template>
  <div class="mobile-money-form">
    <PhoneFieldInput
      :labelId="'mobile-money-phone-number'"
      :labelTitle="'Phone Number'"
      :labelCompact="true"
      :inputPlaceholder="'Enter your phone number'"
      :inputValue="mobile_money_phone_number"
      :showMoreOptions="false"
      isRequired
      :activeCountryCode="mobile_country_code"
      @countryCodeChanged="mobile_country_code = $event"
      @inputChanged="(val: string) => (mobile_money_phone_number = val)"
    />
    <TextFieldInput
      labelId="customerEmail"
      labelTitle="Email Address"
      :labelCompact="false"
      :inputType="IInputType.Email"
      :inputValue="email"
      inputPlaceholder="Enter your email address"
      isRequired
      @inputChanged="email = $event"
    />
    <div class="grid grid-cols-2 sm:grid-cols-1 gap-2">
      <TextFieldInput
        labelId="customerFirstName"
        labelTitle="First Name"
        :labelCompact="false"
        :inputType="IInputType.Text"
        :inputValue="firstName"
        inputPlaceholder="Enter your first name"
        isRequired
        @inputChanged="firstName = $event"
      />
      <TextFieldInput
        labelId="customerLastName"
        labelTitle="Last Name"
        :labelCompact="false"
        :inputType="IInputType.Text"
        :inputValue="lastName"
        inputPlaceholder="Enter your last name"
        isRequired
        @inputChanged="lastName = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { PhoneFieldInput } from "@packages/uikit";
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import { IInputType } from "@packages/models";

// ✅ define emit properly
const emit = defineEmits<{
  (e: "update:phoneNumber", value: string | number): void;
}>();

const props = withDefaults(
  defineProps<{
    dialingCode: string;
    initphoneNumber: string | number;
  }>(),
  {
    dialingCode: "260",
    initphoneNumber: "",
  }
);

const email = defineModel<string>("email");
const firstName = defineModel<string>("firstName");
const lastName = defineModel<string>("lastName");

const mobile_country_code = ref(props.dialingCode || "260");
const mobile_money_phone_number = ref(props.initphoneNumber || "");

// ✅ Watch phone number changes and emit
watch(mobile_money_phone_number, (newVal) => {
  emit("update:phoneNumber", newVal);
});
</script>
