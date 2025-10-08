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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { PhoneFieldInput } from "@packages/uikit";

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

const mobile_country_code = ref(props.dialingCode || "260");
const mobile_money_phone_number = ref(props.initphoneNumber || "");

// ✅ Watch phone number changes and emit
watch(mobile_money_phone_number, (newVal) => {
  emit("update:phoneNumber", newVal);
});
</script>
