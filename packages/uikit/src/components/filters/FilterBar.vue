<template>
  <div
    :class="[
      'flex flex-wrap items-center mt-8 ',
      variant === 'panel' ? 'gap-5' : 'gap-4',
    ]"
  >
    <SearchFilter
      v-for="filter in searchFilters"
      :key="filter.key"
      :model-value="getValue(filter.key)"
      :placeholder="filter.placeholder"
      :size="filter.size ?? defaultSize"
      @update:model-value="emitChange(filter.key, $event)"
    />
    <SearchableSelectFilter
      v-for="filter in searchableSelectFilters"
      :key="filter.key"
      :model-value="getValue(filter.key)"
      :options="unref(filter.options)"
      :placeholder="filter.placeholder"
      @update:model-value="emitChange(filter.key, $event)"
    />

    <SelectFilter
      v-for="filter in selectFilters"
      :key="filter.key"
      :model-value="getValue(filter.key)"
      :options="filter.options"
      :placeholder="filter.placeholder"
      :width="filter.width"
      :size="filter.size ?? defaultSize"
      @update:model-value="emitChange(filter.key, $event)"
    />

    <DatePicker
      v-for="filter in dateFilters"
      :key="filter.key"
      filterSize="lg"
      :active-period="getValue(filter.key)"
      @on-filter-selected="emitChange(filter.key, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, unref, type Ref } from "vue";
import SearchFilter from "./SearchFilter.vue";
import SelectFilter from "./SelectFilter.vue";
import SearchableSelectFilter from "./SearchableSelectFilter.vue";
import DatePicker from "../global-comps/date-picker.vue";

interface Option {
  value: string;
  name: string;
}

interface BaseFilter {
  key: string;
  placeholder?: string;
  size?: "lg" | "sm";
}

interface SearchFilterConfig extends BaseFilter {
  type: "search";
}

interface SelectFilterConfig extends BaseFilter {
  type: "select";
  options?: (string | Option)[];
  width?: string;
}

interface DateFilterConfig extends BaseFilter {
  type: "date";
}

interface SearchableSelectFilterConfig extends BaseFilter {
  type: "searchable-select";
  options?: Option[] | Ref<Option[]>;
}

export type FilterConfig =
  | SearchFilterConfig
  | SelectFilterConfig
  | DateFilterConfig
  | SearchableSelectFilterConfig;

const props = withDefaults(
  defineProps<{
    filters?: FilterConfig[];
    values?: Record<string, any>;
    variant?: "page" | "panel";
  }>(),
  {
    filters: () => [],
    values: () => ({}),
    variant: "page",
  },
);

const emit = defineEmits<{
  (e: "change", payload: { key: string; value: any }): void;
}>();

const defaultSize = computed(() => (props.variant === "panel" ? "sm" : "lg"));

const searchFilters = computed(() =>
  props.filters.filter(
    (item): item is SearchFilterConfig => item.type === "search",
  ),
);
const selectFilters = computed(() =>
  props.filters.filter(
    (item): item is SelectFilterConfig => item.type === "select",
  ),
);
const dateFilters = computed(() =>
  props.filters.filter(
    (item): item is DateFilterConfig => item.type === "date",
  ),
);
const searchableSelectFilters = computed(() =>
  props.filters.filter(
    (item): item is SearchableSelectFilterConfig =>
      item.type === "searchable-select",
  ),
);

function getValue(key: string) {
  return props.values[key];
}

function emitChange(key: string, value: any) {
  emit("change", { key, value });
}
</script>
