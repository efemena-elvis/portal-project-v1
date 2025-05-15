<template>
  <div class="mt-8">
    <TextFieldInput
      :labelCompact="false"
      labelId="ultimate_business_owner_name"
      labelTitle="Ultimate Business Owner's Name"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.ultimate_business_owner_name"
      @inputChanged="merchantPayload.ultimate_business_owner_name = $event"
      @inputValidated="
        props.payloadValidity.ultimate_business_owner_name = $event
      "
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
      @inputChanged="merchantPayload.ultimate_business_owner_address = $event"
      @inputValidated="
        props.payloadValidity.ultimate_business_owner_address = $event
      "
      inputPlaceholder="Enter the address."
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
      :inputValue="merchantPayload.ultimate_business_owner_name_2"
      @inputChanged="merchantPayload.ultimate_business_owner_name_2 = $event"
      @inputValidated="
        props.payloadValidity.ultimate_business_owner_name_2 = $event
      "
      inputPlaceholder="Enter Name"
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Name is a required field.',
      }"
    />

    <TextFieldInput
      :labelCompact="false"
      labelId="ultimate_business_owner_address_2"
      labelTitle="Ultimate Business Owner's Address (2)"
      :inputType="IInputType.Text"
      :inputValue="merchantPayload.ultimate_business_owner_address_2"
      @inputChanged="merchantPayload.ultimate_business_owner_address_2 = $event"
      @inputValidated="
        props.payloadValidity.ultimate_business_owner_address_2 = $event
      "
      inputPlaceholder="Enter the address."
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Address is a required field.',
      }"
    />
  </div>

  <button
    class="cursor-pointer p-2 text-center gap-2 rounded-md border border-grey-200 w-[100px] mt-4"
    @click="showMoreFields = !showMoreFields"
    v-if="showMoreFields"
  >
    <span>Cancel</span>
  </button>
  <button
    class="cursor-pointer p-2 flex items-center gap-2 rounded-md border border-grey-200 w-[100px] mt-4"
    @click="showMoreFields = !showMoreFields"
    v-if="!showMoreFields"
  >
    <div class="icon-add"></div>
    <span>Add another</span>
  </button>
</template>

<script setup lang="ts">
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import { computed, defineProps, ref, watch } from "vue";
import { IInputType } from "@packages/models";

const props = defineProps({
  merchantPayload: { type: Object, required: true },
  payloadValidity: { type: Object, required: true },
  isPrimaryActionReady: { type: Boolean, required: true },
});

const emit = defineEmits(["update:isPrimaryActionDisabled"]);

const showMoreFields = ref(false);

const isActionReady = computed(() => {
  const payload = props.merchantPayload;
  const validity = props.payloadValidity;

  if (showMoreFields.value) {
    return !(
      payload.ultimate_business_owner_name &&
      payload.ultimate_business_owner_name_2 &&
      payload.ultimate_business_owner_address &&
      payload.ultimate_business_owner_address_2 &&
      validity.ultimate_business_owner_name &&
      validity.ultimate_business_owner_name_2 &&
      validity.ultimate_business_owner_address &&
      validity.ultimate_business_owner_address_2
    );
  } else {
    return !(
      payload.ultimate_business_owner_name &&
      payload.ultimate_business_owner_address &&
      validity.ultimate_business_owner_name &&
      validity.ultimate_business_owner_address
    );
  }
});

watch(isActionReady, (newVal) => {
  emit("update:isPrimaryActionDisabled", newVal);
});

emit("update:isPrimaryActionDisabled", isActionReady.value);
</script>

<style scoped></style>
