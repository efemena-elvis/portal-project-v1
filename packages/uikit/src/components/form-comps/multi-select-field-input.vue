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
        labelCompact && labelCompact === true
          ? 'form-label'
          : 'form-label-basic',
      ]"
      >{{ labelTitle }}</label
    >

    <div class="form-block-input">
      <div class="select-input-top">
        <div
          class="select-input form-control"
          :id="labelId"
          :class="inputBaseColor"
          ref="togglerRef"
          @click="toggleDropdown(!showDropdown)"
        >
          <!-- INPUT CONTENT AREA -->
          <div class="input-content">
            <div class="selection-list" v-if="selectedItemList.length">
              <div
                class="select-item"
                v-for="(item, index) in selectedItemList"
                :key="index"
              >
                {{ item }}
              </div>
            </div>

            <div class="placeholder-text" v-else>{{ inputPlaceholder }}</div>
          </div>

          <div
            class="icon icon-caret-down"
            :class="showDropdown && 'rotate-180'"
          ></div>
        </div>
      </div>

      <div
        class="app-dropdown select-input-dropdown"
        ref="dialogRef"
        v-if="showDropdown"
        role="dialog"
        aria-modal="true"
      >
        <div class="dropdown-wrapper">
          <label
            class="dropdown-item"
            :for="item.value + index"
            v-for="(item, index) in selectData"
            :key="index"
          >
            <input
              type="checkbox"
              :id="item.value + index"
              class="sm-size"
              :value="item.value"
              :checked="selectedItemList.includes(item.value)"
              @change="handleSelectChange"
            />
            <div class="dropdown-text">{{ item.name }}</div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IMultiInputField } from "@packages/models";
import { useClickOutside } from "@packages/hooks";

const emit = defineEmits(["onSelectionChange"]);

const props = withDefaults(defineProps<IMultiInputField>(), {
  labelId: "",
  labelTitle: "",
  labelCompact: true,
  inputValueList: () => [],
  inputPlaceholder: "",
  inputBaseColor: "bg-neutral-10",
  hasBottomPadding: true,
  selectData: () => [{ value: "", name: "" }],
});

const selectedItemList = ref<string[]>(props.inputValueList);

const handleSelectChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  console.log("VALUE", target.value);

  if (selectedItemList.value.includes(target.value)) {
    // FIND THE INDEX AND REMOVE THE ITEM
    const index = selectedItemList.value.indexOf(target.value);
    selectedItemList.value.splice(index, 1);
    emit("onSelectionChange", selectedItemList.value);
  } else {
    // ADD THE ITEM
    selectedItemList.value.push(target.value);
    emit("onSelectionChange", selectedItemList.value);
  }
};

// SETUP DROPDOWN FUNCTIONALITY
const showDropdown = ref<boolean>(false);
const dialogRef = ref<HTMLElement | null>(null);
const togglerRef = ref<HTMLElement | null>(null);

const toggleDropdown = (state: boolean) => (showDropdown.value = state);

useClickOutside(dialogRef, togglerRef, toggleDropdown);
</script>

<style lang="scss" scoped>
.form-text-block {
  .form-block-input {
    @apply relative;

    .select-input-top {
      @apply relative;

      .select-input {
        @apply relative flex justify-between items-center gap-x-4;

        .placeholder-text {
          @apply text-grey-500/90 text-sm select-none;
        }

        .selection-list {
          @apply flex flex-wrap justify-start items-center gap-x-2;

          .select-item {
            @apply py-0.5 px-[10px] text-[13.25px] text-grey-700/90 border border-grey-400/60 rounded-2xl capitalize;
          }
        }

        .icon {
          @apply relative text-xl text-grey-800/90 transition duration-300 ease-in-out;
        }
      }
    }

    .select-input-dropdown {
      @apply mt-1 w-full py-0 border-0 bg-transparent rounded-none shadow-none;
      z-index: 99;

      .dropdown-wrapper {
        @apply mb-12 after:hidden py-[5px] rounded-md shadow-sm border border-grey-200/75 bg-neutral-10;

        .dropdown-item {
          @apply flex justify-start items-center gap-x-[14px] py-3 px-4 border-b border-b-grey-200/80 last-of-type:border-0 cursor-pointer transition duration-300 ease-in-out hover:bg-grey-10;

          .dropdown-text {
            @apply text-[13px] text-grey-800/90;
          }
        }
      }
    }
  }
}
</style>
