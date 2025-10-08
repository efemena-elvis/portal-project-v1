<!-- CardPaymentForm.vue -->
<template>
  <div class="flex flex-col gap-1.5">
    <TextFieldInput
      labelId="cardNumber"
      labelTitle="Card Number"
      :labelCompact="true"
      :inputType="IInputType.Number"
      :inputValue="cardDetails.cardNumber"
      inputPlaceholder="0000 0000 0000 0000"
      isRequired
      isDisabled
      @inputChanged="cardDetails.cardNumber = $event"
      :errorHandler="{
        validator: 'validateRequired',
      }"
    />

    <div class="row-split">
      <TextFieldInput
        labelId="cardExpiry"
        labelTitle="Card Expiry"
        :labelCompact="true"
        :inputType="IInputType.Number"
        :inputValue="cardDetails.expiryDate"
        inputPlaceholder="MM / YY"
        isRequired
        isDisabled
        :hasBottomPadding="false"
        @inputChanged="cardDetails.expiryDate = $event"
        :errorHandler="{
          validator: 'validateRequired',
        }"
      />

      <TextFieldInput
        labelId="cardCVV"
        labelTitle="CVV"
        :labelCompact="true"
        :inputType="IInputType.Number"
        :inputValue="cardDetails.cvv"
        inputPlaceholder="123"
        isRequired
        isDisabled
        :hasBottomPadding="false"
        @inputChanged="cardDetails.cvv = $event"
        :errorHandler="{
          validator: 'validateRequired',
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { TextFieldInput } from "@packages/uikit";
import { IInputType } from "@packages/models";

const cardDetails = ref({
  cardNumber: "",
  expiryDate: "",
  cvv: "",
});
</script>

<style lang="scss" scoped>
.form-group {
  @apply w-full;
}
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.form-input {
  @apply w-full px-3 py-2.5;
  @apply border border-gray-300 rounded-lg shadow-sm;
  @apply focus:ring-2 focus:ring-green-300 focus:border-green-400;
  @apply transition-colors duration-200;
}
.row-split {
  @apply flex items-center gap-4;
}
</style>
