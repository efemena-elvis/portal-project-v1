<template>
  <div
    :class="['form-block form-text-block', hasBottomPadding ? 'mb-5' : 'mb-0']"
  >
    <!-- LABEL TEXT -->
    <label
      v-if="labelTitle"
      :for="labelId"
      :class="[
        inputBaseColor,
        labelCompact ? 'form-label' : 'form-label-basic',
      ]"
      >{{ labelTitle }}</label
    >

    <div class="form-block-input">
      <div
        class="form-input form-control"
        ref="togglerRef"
        @click="toggleDropdown(!showDropdown)"
      >
        <div class="item-selection" v-if="getSelectedData">
          <div class="img-wrapper">
            <img :src="getSelectedData.image" v-if="getSelectedData.image" />
          </div>

          <div class="selected-text">{{ getSelectedData.name }}</div>
        </div>

        <div class="text-grey-500/95 text-sm" v-else>
          {{ inputPlaceholder }}
        </div>

        <div
          class="icon icon-caret-down text-xl transition duration-300 ease-in-out relative top-[1px]"
          :class="showDropdown && 'rotate-180'"
        ></div>
      </div>

      <!-- SELECT DROPDOWN OPTIONS -->
      <div
        class="app-dropdown options-select-dropdown z-30"
        ref="dialogRef"
        v-if="showDropdown"
        role="dialog"
        aria-modal="true"
      >
        <div class="dropdown-wrapper bg-neutral-10">
          <div class="selection-area">
            <!-- OPTION LIST -->
            <div class="option-list" v-if="selectData.length">
              <div
                class="option-list-item"
                @click="handleFormInput(data.value)"
                v-for="(data, index) in selectData"
                :key="index"
              >
                <div class="flex justify-start items-center gap-2.5">
                  <div class="relative size-6 rounded-full overflow-hidden">
                    <img
                      v-if="data.image"
                      :src="data.image"
                      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-11"
                    />
                  </div>

                  <div class="primary-text">{{ data.name }}</div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="option-list text-grey-500/95 text-sm text-center"
            >
              No options data found
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ISelectInputField } from "@packages/models";
import { useClickOutside } from "@packages/hooks";

const emits = defineEmits(["onSelectionChange"]);

const props = withDefaults(defineProps<ISelectInputField>(), {
  labelId: "",
  labelTitle: "",
  labelCompact: false,
  inputValue: "",
  inputPlaceholder: "",
  inputBaseColor: "bg-neutral-10",
  isRequired: false,
  isDisabled: false,
  hasBottomPadding: true,
  selectData: () => [{ value: "", name: "", image: null }],
});

const selectedValue = ref<string>(props.inputValue);

const handleFormInput = (data: string) => {
  selectedValue.value = data;
  emits("onSelectionChange", data);

  toggleDropdown(false);
};

const getSelectedData = computed(() => {
  return props.selectData.find((data) => data.value === selectedValue.value);
});

// SETUP DROPDOWN FUNCTIONALITY
const showDropdown = ref<boolean>(false);
const dialogRef = ref<HTMLElement | null>(null);
const togglerRef = ref<HTMLElement | null>(null);

const toggleDropdown = (state: boolean) => (showDropdown.value = state);
useClickOutside(dialogRef, togglerRef, toggleDropdown);

watch(
  () => props.inputValue,
  (value) => (selectedValue.value = value),
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.form-text-block {
  .form-block-input {
    @apply relative;

    .form-input {
      @apply flex justify-between items-center gap-x-2 py-[14.5px];

      .item-selection {
        @apply relative flex justify-start items-center gap-x-2.5 cursor-pointer text-grey-600;

        .img-wrapper {
          @apply relative size-5 rounded-full overflow-hidden;

          img {
            @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-11;
          }
        }

        .selected-text {
          @apply relative top-[1px] text-sm text-grey-800;
        }
      }
    }

    .options-select-dropdown {
      @apply absolute left-0 w-full mt-1;

      .dropdown-wrapper {
        @apply relative after:hidden bg-neutral-10;

        .selection-area {
          @apply pt-1 pb-1 px-1.5;

          .search-top {
            @apply relative px-2.5 z-40;

            .icon {
              @apply text-grey-700/80 absolute block top-1/2 -translate-y-1/2 left-7 z-20 text-[15.5px];
            }

            .search-input {
              @apply px-3 py-[10.5px] pl-9;
            }
          }

          .option-list {
            @apply min-h-10 h-auto max-h-72 overflow-auto px-2;

            &::-webkit-scrollbar {
              @apply w-1;
            }

            &::-webkit-scrollbar-track {
              @apply rounded-md;
            }

            &::-webkit-scrollbar-thumb {
              @apply rounded-md bg-green-200;
            }

            &-item {
              @apply flex justify-between items-start gap-x-4 py-2.5 rounded-3xl px-2.5 last-of-type:border-0 cursor-pointer transition duration-300 ease-in-out hover:bg-green-50;

              .primary-text {
                @apply text-grey-700 text-[14px];
              }

              .secondary-text {
                @apply text-grey-600 text-[13.5px];
              }
            }
          }
        }
      }
    }
  }
}
</style>
