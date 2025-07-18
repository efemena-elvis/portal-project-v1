<template>
  <div
    class="select-wrapper"
    :class="hasInteracted ? (inputIsValid ? 'valid-data' : 'invalid-data') : ''"
  >
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { BulkUploadTableType, IMerchantBaseType } from "@packages/models";

const props = defineProps<{
  header: BulkUploadTableType;
  body: IMerchantBaseType;
  updateMerchantAction: (payload: any) => void;
}>();

const inputValue = ref<string>("");
const hasInteracted = ref<boolean>(false);
const categoryItem = ref<string>(props.header.path.split(".")[0]);
const dataItem = ref<string>(props.header.path.split(".")[1]);

const inputIsValid = computed(() => {
  if (!hasInteracted.value) return true;

  return props.header.validator
    ? props.header.validator(inputValue.value) === ""
    : true;
});

const updateFieldInput = () => {
  hasInteracted.value = true;

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
.select-wrapper {
  @apply pr-3;

  select {
    @apply pl-3 pr-0.5 w-full h-[72px] bg-transparent text-grey-900 placeholder:text-grey-500 focus:outline-none disabled:mx-4 disabled:text-grey-500;
  }
}

.invalid-data {
  @apply bg-red-50/80;
}

.valid-data {
  @apply bg-green-50/80;
}
</style>
