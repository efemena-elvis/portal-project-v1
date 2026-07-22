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

    <div class="form-block-input has-prefix">
      <div class="prefix-item">
        <div class="relative">
          <div
            class="item-selection"
            ref="togglerRef"
            @click="showMoreOptions ? toggleDropdown(!showDropdown) : null"
          >
            <div class="flex justify-start items-center gap-x-1">
              <img
                :src="countryFlag"
                class="size-5 min-h-5 min-w-5 sm:hidden"
              />
              <div class="selected-text">+{{ countryCode }}</div>

              <div
                v-if="showMoreOptions"
                class="toggler-icon icon-caret-down"
                :class="showDropdown && 'rotate-180'"
              ></div>

              <div v-else class="separator-icon"></div>
            </div>
          </div>

          <!-- COUNTRY SELECT DROPDOWN -->
          <div
            class="app-dropdown country-select-dropdown"
            ref="dialogRef"
            v-if="showDropdown"
            role="dialog"
            aria-modal="true"
          >
            <div class="dropdown-wrapper">
              <div class="selection-area">
                <!-- SEARCH TOP AREA -->
                <div class="search-top">
                  <div class="icon icon-search-normal"></div>

                  <input
                    type="search"
                    v-model="searchCountry"
                    @input="searchCountryList"
                    class="form-control search-input"
                    placeholder="Search country..."
                  />
                </div>

                <!-- OPTION LIST -->
                <div class="option-list">
                  <div
                    class="option-list-item"
                    @click="updateCountryCode(country)"
                    v-for="(country, index) in countryList"
                    :key="index"
                  >
                    <div class="flex justify-start items-center gap-1.5">
                      <img :src="country.flag" class="size-5 min-h-5 min-w-5" />
                      <div class="primary-text">{{ country.country }}</div>
                    </div>

                    <div class="secondary-text">
                      +{{ country.dialing_code }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input
        type="number"
        :id="labelId"
        v-model="formValue"
        :class="[
          'form-control',
          inputBaseColor,
          countryCodeClass,
          !isInputValid && 'form-control-error',
        ]"
        :placeholder="inputPlaceholder"
        :defaultValue="inputValue"
        :required="isRequired"
        :disabled="isDisabled"
        @input="handleFormInput"
        @paste="handleFormInput"
        @change="handleFormInput"
        @keydown.enter="handleFormInput"
      />
    </div>

    <!-- VALIDATOR MESSAGE -->
    <div class="validator-message" v-if="formErrorMsg">{{ formErrorMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRef } from "vue";
import { IPhoneInputField, IInputValidator } from "@packages/models";
import { useValidators, useClickOutside } from "@packages/hooks";
import { countryCurrencies } from "@packages/constants";

const emits = defineEmits([
  "inputChanged",
  "countryCodeChanged",
  "inputValidated",
]);

const props = withDefaults(defineProps<IPhoneInputField>(), {
  labelId: "",
  labelTitle: "",
  labelCompact: false,
  inputValue: "",
  inputPlaceholder: "",
  inputBaseColor: "bg-neutral-10",
  isRequired: false,
  isDisabled: false,
  hasBottomPadding: true,
  showMoreOptions: true,
  activeCountryCode: "",
});

// Set a default value for errorHandler if it's not provided
const errorHandler = props.errorHandler || { validator: "", message: "" };

const { validateRequired, validatePhone } = useValidators();

const activeCountryCode = toRef(props, "activeCountryCode");

const formValue = ref<string | number>(props.inputValue);
const formErrorMsg = ref<string>("");

const countryListRepo = ref([...countryCurrencies]);
const countryList = ref([...countryCurrencies]);

const countryCode = ref<string>(props.activeCountryCode || "260");
const countryName = ref<string>("");
const countryFlag = ref<string>("");

const searchCountry = ref<string>("");

// SETUP DROPDOWN FUNCTIONALITY
const showDropdown = ref<boolean>(false);
const dialogRef = ref<HTMLElement | null>(null);
const togglerRef = ref<HTMLElement | null>(null);

const toggleDropdown = (state: boolean) => (showDropdown.value = state);

useClickOutside(dialogRef, togglerRef, toggleDropdown);

const isInputValid = computed(() => {
  const isValid = !formErrorMsg.value.length;
  emits("inputValidated", isValid);
  return isValid;
});

const countryCodeClass = computed(() => {
  if (countryCode.value.length === 1) return "!pl-[84px]";
  else if (countryCode.value.length === 2) return "!pl-[94px]";
  else if (countryCode.value.length === 3) return "!pl-[104px]";
  else return "!pl-[116px]";
});

// UPDATE CHANGE IN COUNTRY CODE
const updateCountryCode = (selectedCountry: any) => {
  countryCode.value = selectedCountry.dialing_code;
  countryName.value = selectedCountry.country;

  countryList.value = countryListRepo.value;
  searchCountry.value = "";

  emits("countryCodeChanged", countryCode.value);
  toggleDropdown(false);
};

// SEARCH COUNTRY DATASET
const searchCountryList = () => {
  if (searchCountry.value.length) {
    countryList.value = countryListRepo.value.filter((country) =>
      country.country.toLowerCase().includes(searchCountry.value.toLowerCase()),
    );
  } else countryList.value = countryListRepo.value;
};

const handleFormInput = () => {
  errorHandler.validator && validateInputFields(errorHandler);
  emits("inputChanged", formValue.value);
};

const validateInputFields = (errorHandler: IInputValidator) => {
  const { validator, message } = errorHandler;

  switch (validator) {
    case "validateRequired":
      formErrorMsg.value = validateRequired(formValue.value, message);
      break;

    case "validatePhone":
      formErrorMsg.value = validatePhone(
        formValue.value,
        countryCode.value,
        message,
      );
      break;

    default:
      formErrorMsg.value = "";
      break;
  }
};

watch(
  activeCountryCode,
  (activeCode) => {
    const countryData = countryListRepo.value.find(
      (countryData) => countryData.dialing_code === activeCode,
    );

    countryFlag.value =
      countryData?.flag || "https://flagsapi.com/NG/flat/64.png";
    countryName.value = countryData?.country || "";
    countryCode.value = countryData?.dialing_code || "234";
  },
  { immediate: true },
);

watch(
  [countryCode, countryName],
  ([newCode, newName]) => {
    const currentSelection = countryListRepo.value.find((countryData) => {
      const { dialing_code, country } = countryData;

      return dialing_code === newCode
        ? dialing_code === newCode && country === newName
        : dialing_code === newCode;
    });

    const getActiveCountryFlag = countryListRepo.value.find(
      (countryData) => countryData.dialing_code === newCode,
    );

    countryFlag.value =
      getActiveCountryFlag?.flag || "https://flagsapi.com/NG/flat/64.png";
    countryName.value = currentSelection?.country || "";
    countryCode.value = currentSelection?.dialing_code || "260";
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.form-text-block {
  .form-block-input {
    @apply relative;

    .prefix-item {
      @apply hidden;
    }

    &.has-prefix {
      .prefix-item {
        @apply absolute block top-1/2 pt-[3px] -translate-y-1/2 left-5 sm:left-4 z-20;

        .item-selection {
          @apply relative flex justify-start items-center gap-x-1 cursor-pointer;

          .selected-text {
            @apply text-sm text-grey-600;
          }

          .toggler-icon {
            @apply text-grey-700 relative text-[15.5px] transition duration-300 ease-in-out;
          }

          .separator-icon {
            @apply h-[18px] w-[1px] bg-grey-400/90 ml-2;
          }
        }
      }
    }

    .country-select-dropdown {
      @apply absolute -left-[20px] w-[260px] mt-[18px] z-10;

      .dropdown-wrapper {
        @apply relative after:left-[10.75%];

        .selection-area {
          @apply pt-3 pb-1;

          .search-top {
            @apply relative px-4 z-40;

            .icon {
              @apply text-grey-700/80 absolute block top-1/2 -translate-y-1/2 left-7 z-20 text-[15.5px];
            }

            .search-input {
              @apply px-3 py-[10.5px] pl-9;
            }
          }

          .option-list {
            @apply mt-1 min-h-10 h-auto max-h-40 overflow-auto;

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
              @apply flex justify-between items-start gap-x-4 py-2.5 px-4 border-b border-b-grey-200/70 last-of-type:border-0 cursor-pointer transition duration-300 ease-in-out hover:bg-grey-10;

              .primary-text {
                @apply text-grey-700 text-sm;
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

  .validator-message {
    @apply pl-0.5 mt-0.5 text-red-500 font-medium text-[13px];
  }
}
</style>
