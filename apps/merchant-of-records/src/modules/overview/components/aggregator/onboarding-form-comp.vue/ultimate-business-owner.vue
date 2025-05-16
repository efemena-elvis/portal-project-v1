<template>
  <div class="flex flex-col gap-4 mt-8">
    <div
      v-for="(owner, index) in merchantPayload.ultimate_business_owner"
      :key="index"
 
    >
      <TextFieldInput
        :labelCompact="false"
        :labelId="`ultimate_business_owner_name_${index}`"
        :labelTitle="`Ultimate Business Owner's Name ${index + 1}`"
        :inputType="IInputType.Text"
        :inputValue="owner.name"
        @inputChanged="owner.name = $event"
        @inputValidated="(val) => payloadValidity.ultimate_business_owner[index].name = val"
        inputPlaceholder="Enter name"
        isRequired
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Name is a required field.',
        }"
      />

      <TextFieldInput
        :labelCompact="false"
        :labelId="`ultimate_business_owner_address_${index}`"
        :labelTitle="`Ultimate Business Owner's Address ${index + 1}`"
        :inputType="IInputType.Text"
        :inputValue="owner.address"
        @inputChanged="owner.address = $event"
        @inputValidated="(val) => payloadValidity.ultimate_business_owner[index].address = val"
        inputPlaceholder="Enter the address"
        isRequired
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Address is a required field.',
        }"
      />

      <button
        class="mt-2 text-sm text-red-500"
        v-if="merchantPayload.ultimate_business_owner.length > 1"
        @click="removeOwner(index)"
      >
        Remove
      </button>
    </div>

    <button
      class="cursor-pointer p-2 flex items-center gap-2 rounded-md border border-grey-200 w-[100px] mt-4 justify-center"
      @click="addOwner"
    >
      <div class="icon-add"></div>
      <span>Add another</span>
    </button>
  </div>
</template>



<script lang="ts" setup>
import { computed, defineProps, watch } from "vue";
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import { IInputType } from "@packages/models";

interface Owner {
  name: string;
  address: string;
}

interface MerchantPayload {
  ultimate_business_owner: Owner[];
}

interface PayloadValidity {
  ultimate_business_owner: {
    name: boolean;
    address: boolean;
  }[];
}

const props = defineProps<{
  merchantPayload: MerchantPayload;
  payloadValidity: PayloadValidity;
}>();

const emit = defineEmits(["update:isPrimaryActionDisabled"]);

const addOwner = () => {
  props.merchantPayload.ultimate_business_owner.push({ name: "", address: "" });
  props.payloadValidity.ultimate_business_owner.push({ name: false, address: false });
};

const removeOwner = (index: number) => {
  props.merchantPayload.ultimate_business_owner.splice(index, 1);
  props.payloadValidity.ultimate_business_owner.splice(index, 1);
};

const isActionReady = computed(() => {
  return props.merchantPayload.ultimate_business_owner.every((owner, index) => {
    return (
      owner.name &&
      owner.address &&
      props.payloadValidity.ultimate_business_owner[index]?.name &&
      props.payloadValidity.ultimate_business_owner[index]?.address
    );
  });
});

watch(isActionReady, (newVal) => {
  emit("update:isPrimaryActionDisabled", !newVal);
}, { immediate: true });
</script>



<style scoped></style>
