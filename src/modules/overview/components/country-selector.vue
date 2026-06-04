<template>
  <SelectFieldInput
    :labelTitle="label"
    :inputPlaceholder="placeholder"
    :selectData="countriesOptions"
    :inputValue="modelValue"
    :hasBottomPadding="false"
    @onSelectionChange="handleCountryChange"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { SelectFieldInput } from "@packages/uikit";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Choose a country",
  },
});

const emit = defineEmits(["update:modelValue"]);

const countriesOptions = computed(() => [
  {
    value: "Ghana",
    name: "Ghana",
  },
  {
    value: "Nigeria",
    name: "Nigeria",
  },
  {
    value: "Zambia",
    name: "Zambia",
  },
  {
    value: "Tanzania",
    name: "Tanzania",
  },
]);

const handleCountryChange = (selectedCode: string) => {
  emit("update:modelValue", selectedCode);
};
</script>
