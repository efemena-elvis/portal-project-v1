<template>
  <select
    v-model="inputValue"
    @change="updateFieldInput"
    :disabled="header.readonly"
  >
    <option value="" disabled selected>{{ header.placeholder }}</option>

    <option
      v-for="option in header.options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { BulkUploadTableType, IMerchantBaseType } from "@packages/models";

const props = defineProps<{
  header: BulkUploadTableType;
  body: IMerchantBaseType;
  updateMerchantAction: (payload: any) => void;
}>();

const inputValue = ref<string>("");
const categoryItem = ref<string>(props.header.path.split(".")[0]);
const dataItem = ref<string>(props.header.path.split(".")[1]);

const updateFieldInput = () => {
  console.log("VALUE ===>>>", inputValue);

  props.updateMerchantAction({
    id: props.body.id,
    path: props.header.path,
    value: inputValue.value,
  });
};

onMounted(() => {
  const category = props.body[
    categoryItem.value as keyof IMerchantBaseType
  ] as any;
  if (category && typeof category === "object") {
    inputValue.value = category[dataItem.value] ?? "";
  }
});
</script>

<style lang="scss" scoped>
select {
  @apply py-1 w-full h-12 bg-transparent text-grey-700 placeholder:text-grey-500 focus:outline-none disabled:mx-4 disabled:text-grey-500;
}
</style>
