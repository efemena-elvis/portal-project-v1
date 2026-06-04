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

    <div :class="['form-block-input', getInputTypeView()]">
      <template v-if="!isTextArea">
        <!-- PREFIX ITEM FOR SEARCH FIELD TYPE -->
        <div v-if="inputType === 'search'" class="prefix-item">
          <SearchIcon class="prefix-icon" fillColor="#818988" />
        </div>

        <div :class="[suffixText ? 'input-wrapper form-control' : '']">
          <input
            :type="getInputType"
            :id="labelId"
            ref="inputRef"
            v-model="formValue"
            :class="[
              !suffixText && 'form-control',
              !isInputValid && 'form-control-error',
              placeTextCenter && 'text-center',
            ]"
            :placeholder="inputPlaceholder"
            :defaultValue="inputValue"
            :required="isRequired"
            :disabled="isDisabled"
            :inputmode="
              getInputType === IInputType.Number ? 'numeric' : undefined
            "
            :pattern="getInputType === IInputType.Number ? '[0-9]*' : undefined"
            @input="handleFormInput"
            @paste="handleFormInput"
            @change="handleFormInput"
            @keydown.enter="handleFormInput"
            :name="labelId"
          />

          <!-- INPUT SUFFIX -->
          <div class="input-suffix" v-if="suffixText">{{ suffixText }}</div>
        </div>

        <!-- SUFFIX ITEM FOR PASSWORD FIELD TYPE -->
        <div
          v-if="getInputType === IInputType.Password && showPasswordDisplay"
          class="suffix-item"
          @click="toggleHidden"
        >
          <div class="suffix-item-text" :class="inputBaseColor">
            {{ isHidden ? "SHOW" : "HIDE" }}
          </div>
        </div>

        <!-- SUFFIX ITEM FOR INPUT TEXT COPY -->

        <div
          v-if="getInputType === IInputType.Text && showTextCopy"
          class="suffix-item"
          @click="triggerCopyText"
        >
          <div class="suffix-item-text" :class="inputBaseColor">
            {{ copied ? "COPIED" : "COPY" }}
          </div>
        </div>

        <div
          v-else-if="getInputType === IInputType.Text && showPasswordDisplay"
          class="suffix-item"
          @click="toggleHidden"
        >
          <div class="suffix-item-text" :class="inputBaseColor">
            {{ isHidden ? "SHOW" : "HIDE" }}
          </div>
        </div>

        <!-- SUFFIX ITEM FOR DATE FIELD TYPE -->
        <div
          v-if="inputType === 'date'"
          class="suffix-date-item"
          @click="handleIconClick"
        >
          <div
            class="suffix-icon icon-calendar text-[22px] text-grey-600/95"
          ></div>
        </div>
      </template>

      <!-- inputBaseColor, -->
      <textarea
        v-else
        :id="labelId"
        :class="['form-control', formErrorMsg ? 'form-control-error' : '']"
        v-model="formValue"
        :placeholder="inputPlaceholder"
        :required="isRequired"
        :disabled="isDisabled"
        @input="handleFormInput"
        @paste="handleFormInput"
        @change="handleFormInput"
        @keydown.enter="handleFormInput"
        :name="labelId"
      ></textarea>
    </div>

    <!-- VALIDATOR MESSAGE -->
    <div class="validator-message" v-if="formErrorMsg">{{ formErrorMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useValidators, useEvents } from "@packages/hooks";
import { SearchIcon } from "@packages/uikit";
import { ITextInputField, IInputType, IInputValidator } from "@packages/models";

const emits = defineEmits(["verifyClicked", "inputChanged", "inputValidated"]);

const props = withDefaults(defineProps<ITextInputField>(), {
  labelId: "",
  labelTitle: "",
  labelCompact: false,
  inputType: IInputType.Text,
  inputValue: "",
  inputPlaceholder: "",
  inputBaseColor: "bg-neutral-10",
  suffixText: "",
  isTextArea: false,
  isRequired: false,
  isDisabled: false,
  showPasswordDisplay: true,
  showTextCopy: false,
  copiedText: "Copied successfully",
  placeTextCenter: false,
  hasBottomPadding: true,
  name: "nfm____",
});

// Set a default value for errorHandler if it's not provided
const errorHandler = props.errorHandler || {
  validator: "",
  range: 0,
  message: "",
};

const {
  validateRequired,
  validateEmail,
  validateNumberEntry,
  validateOnlyNumbers,
  validatePasswordStrength,
  validateFullName,
  validateSingleName,
  validateAlphanumeric,
  validateDateRange,
  validateURL,
} = useValidators();

const { pushToastAlert } = useEvents();

const getInputType = computed(() => {
  if (props.inputType !== IInputType.Password) return props.inputType;
  return isHidden.value ? IInputType.Password : IInputType.Text;
});

const formValue = ref<string | number>(props.inputValue);
const formErrorMsg = ref<string>("");

const isInputValid = computed(() => {
  const isValid = !formErrorMsg.value.length;
  emits("inputValidated", isValid);
  return isValid;
});

const inputRef = ref<HTMLInputElement | null>(null);
const isHidden = ref<boolean>(true);
const copied = ref<boolean>(false);

const handleIconClick = () => {
  if (inputRef.value) {
    inputRef.value.showPicker
      ? inputRef.value.showPicker()
      : inputRef.value.click();
  }
};

const getInputTypeView = () => {
  const typeView = {
    text: null,
    number: null,
    url: null,
    email: "has-suffix",
    search: "has-prefix",
    password: "has-suffix",
    date: "has-date-suffix",
    textarea: "is-text-area",
  };

  return props.isTextArea
    ? typeView.textarea
    : props.showTextCopy || props.inputType === IInputType.Password
      ? typeView[IInputType.Password]
      : typeView[props.inputType];
};

const handleFormInput = () => {
  if (getInputType.value === IInputType.Number) {
    formValue.value = String(formValue.value).replace(/\D+/g, "");
  }

  errorHandler.validator && validateInputFields(errorHandler);
  emits(
    "inputChanged",
    typeof formValue.value === "string"
      ? formValue.value.trim()
      : formValue.value,
  );
};

const validateInputFields = (errorHandler: IInputValidator) => {
  const { validator, range, message } = errorHandler;

  switch (validator) {
    case "validateRequired":
      formErrorMsg.value = validateRequired(formValue.value, message);
      break;

    case "validateEmail":
      formErrorMsg.value = validateEmail(formValue.value as string, message);
      break;

    case "validateNumberEntry":
      formErrorMsg.value = validateNumberEntry(
        formValue.value as string,
        message,
      );
      break;

    case "validateOnlyNumbers":
      formErrorMsg.value = validateOnlyNumbers(
        formValue.value as string,
        message,
      );
      break;

    case "validatePasswordStrength":
      formErrorMsg.value = validatePasswordStrength(formValue.value as string);
      break;

    case "validateFullName":
      formErrorMsg.value = validateFullName(formValue.value as string);
      break;

    case "validateSingleName":
      formErrorMsg.value = validateSingleName(
        formValue.value as string,
        message,
      );
      break;

    case "validateAlphanumeric":
      formErrorMsg.value = validateAlphanumeric(
        formValue.value as string,
        message,
      );
      break;

    case "validateDateRange":
      formErrorMsg.value = validateDateRange(
        formValue.value as string,
        range as number,
        message,
      );
      break;

    case "validateURL":
      formErrorMsg.value = validateURL(formValue.value as string, message);
      break;

    default:
      formErrorMsg.value = "";
      break;
  }
};

const toggleHidden = () => {
  isHidden.value = !isHidden.value;
};

const triggerCopyText = async () => {
  await navigator.clipboard.writeText(formValue.value as string);

  pushToastAlert({
    message: props.copiedText,
    type: "success",
  });

  copied.value = true;

  setTimeout(() => {
    copied.value = false;

    if (props.inputType === IInputType.Password) toggleHidden();
  }, 2000);
};

watch(
  () => props.inputValue,
  (val) => {
    formValue.value = val;
  },
);
</script>

<style lang="scss" scoped>
.form-text-block {
  .form-block-input {
    @apply relative;

    .input-wrapper {
      @apply relative overflow-hidden;

      input {
        @apply w-3/5 border-none;
      }

      .input-suffix {
        @apply absolute w-auto h-full top-1/2 -translate-y-1/2 right-0 z-10 bg-teal-50 px-8 text-center text-sm text-grey-900 font-medium flex flex-col justify-center items-center;
      }
    }

    .prefix-item,
    .suffix-item,
    .suffix-date-item,
    textarea {
      @apply hidden;
    }

    &.has-prefix {
      .prefix-item {
        @apply absolute block top-1/2 -translate-y-1/2 left-4 sm:left-4 z-20;

        .prefix-icon {
          @apply relative top-[1px] w-[18px] h-[18px];
        }
      }

      .form-control {
        @apply pl-[45px];
      }
    }

    &.has-suffix {
      .suffix-item {
        @apply absolute block top-1/2 -translate-y-1/2 right-4 z-20;

        .suffix-icon {
          @apply w-[22px] h-[22px] text-grey-700 cursor-pointer transition duration-300 ease-in-out hover:text-green-600;
        }

        &-text {
          @apply relative top-[2px] text-green-500 text-xs font-semibold cursor-pointer pl-3.5 transition duration-300 ease-in-out hover:text-yellow-500;
        }

        &-verified {
          @apply relative flex justify-center items-center size-6 rounded-full bg-green-400;
        }
      }
    }

    &.has-date-suffix {
      .suffix-date-item {
        @apply absolute block top-1/2 -translate-y-1/2 right-5 z-20;

        .suffix-date-icon {
          @apply w-[22px] h-[22px] text-grey-600 bg-white;
        }
      }
    }

    &.is-text-area {
      input {
        @apply hidden;
      }

      textarea {
        @apply block;
      }
    }
  }

  .validator-message {
    @apply pl-0.5 mt-0.5 text-red-500 font-medium text-[13px];
  }
}
</style>
