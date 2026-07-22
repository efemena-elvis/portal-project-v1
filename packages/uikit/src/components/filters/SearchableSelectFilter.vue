<template>
  <div class="relative text-sm font-semibold text-teal-800">
    <div
      ref="triggerRef"
      @click="toggleDropdown()"
      class="flex items-center justify-between w-[250px] h-12 px-4 border rounded-lg cursor-pointer bg-white select-none"
      :class="dropdownOpen ? 'border-teal-800' : 'border-grey-200'"
    >
      <span class="truncate text-teal-800">
        {{ selectedLabel || placeholder }}
      </span>
      <div class="flex items-center gap-1">
        <div
          v-if="modelValue"
          @click.stop="handleClear"
          class="text-[14px] text-grey-400 hover:text-red-500 cursor-pointer icon icon-times"
        ></div>
        <div
          class="text-[16px] text-teal-800 transition-transform duration-200 icon icon-caret-down"
          :class="dropdownOpen && 'rotate-180'"
        ></div>
      </div>
    </div>
    <div
      ref="dropdownRef"
      v-if="dropdownOpen"
      class="absolute left-0 mt-1 w-[250px] bg-white border border-grey-200 rounded-lg shadow-lg z-50"
    >
      <div class="p-2 border-b border-grey-100">
        <div class="">
          <input
            v-model="searchQuery"
            type="search"
            class="w-full rounded-md border border-grey-200 bg-white h-10 px-3 text-sm text-grey-900 outline-none transition focus:outline-none"
            :placeholder="'Search ' + placeholder.toLowerCase() + '...'"
            @click.stop
          />
        </div>
      </div>
      <div class="max-h-[250px] overflow-y-auto scrollbar-hidden">
        <div
          v-for="opt in filteredOptions"
          :key="opt.value"
          @click="selectOption(opt.value)"
          class="px-3 py-2.5 text-sm cursor-pointer transition hover:bg-teal-50 text-teal-800"
        >
          {{ opt.name }}
        </div>
        <div
          v-if="!filteredOptions.length"
          class="px-3 py-2.5 text-sm text-grey-400 text-center"
        >
          No {{ placeholder.toLowerCase() }} found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useClickOutside } from "@packages/hooks";

interface Option {
  value: string;
  name: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: string;
    options?: Option[];
    placeholder?: string;
  }>(),
  {
    options: () => [],
    placeholder: "Select",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const dropdownOpen = ref(false);
const searchQuery = ref("");
const dropdownRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  if (!props.modelValue) return "";
  const found = props.options.find((o) => o.value === props.modelValue);
  return found?.name ?? "";
});

const filteredOptions = computed(() => {
  const q = searchQuery.value.toLocaleLowerCase().trim();
  if (!q) return props.options;
  return props.options.filter(
    (opt) =>
      opt.name.toLocaleLowerCase().includes(q) ||
      opt.value.toLocaleLowerCase().includes(q),
  );
});

const toggleDropdown = (state?: boolean) => {
  dropdownOpen.value = state ?? !dropdownOpen.value;
  if (dropdownOpen.value) {
    nextTick(() => {
      const input = dropdownRef.value?.querySelector<HTMLInputElement>(
        'input[type="search"]',
      );
      input?.focus();
    });
  }
  if (!dropdownOpen.value) {
    searchQuery.value = "";
  }
};

const selectOption = (value: string) => {
  emit("update:modelValue", value);
  dropdownOpen.value = false;
  searchQuery.value = "";
};

const handleClear = () => {
  emit("update:modelValue", "");
  dropdownOpen.value = false;
  searchQuery.value = "";
};

useClickOutside(dropdownRef, triggerRef, toggleDropdown);
</script>

<style scoped>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
