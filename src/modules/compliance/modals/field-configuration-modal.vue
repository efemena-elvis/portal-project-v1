<template>
  <ModalDialog @closeModal="$emit('closeTriggered')" place_center>
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">{{ fieldTypeTitle }} field</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body">
        <div class="field-group">
          <label for="label-text" class="field-label">Label text</label>
          <TextFieldInput
            labelId="label-text"
            :inputType="IInputType.Text"
            inputPlaceholder="e.g. Legal business name"
            :inputValue="labelText"
            @inputChanged="labelText = $event"
          />
        </div>

        <div class="field-group">
          <label for="placeholder-text" class="field-label"
            >Place holder text</label
          >
          <TextFieldInput
            labelId="placeholder-text"
            :inputType="IInputType.Text"
            inputPlaceholder="e.g. Enter legal business name"
            :inputValue="placeholderText"
            @inputChanged="placeholderText = $event"
          />
        </div>

        <div class="field-group required-group">
          <label class="required-label">
            <input
              type="checkbox"
              v-model="isRequired"
              class="required-checkbox"
            />
            <span class="required-text">Required</span>
          </label>
          <div class="required-hint">
            Indicate whether this input field is required.
          </div>
        </div>
      </div>
    </template>

    <template #modal-cover-footer>
      <div class="modal-cover-footer">
        <button
          class="btn btn-primary w-full"
          :disabled="!labelText.trim()"
          @click="handleCreateField"
        >
          Create Field
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ModalDialog, TextFieldInput } from "@packages/uikit";
import {
  IInputType,
  IFieldType,
  IComplianceFieldConfig,
} from "@packages/models";

const props = defineProps<{
  fieldType: IFieldType;
  initialConfig?: IComplianceFieldConfig;
}>();

const emit = defineEmits(["closeTriggered", "fieldCreated"]);

const labelText = ref(props.initialConfig?.labelTitle || "");
const placeholderText = ref(props.initialConfig?.inputPlaceholder || "");
const isRequired = ref(props.initialConfig?.isRequired || false);

const generateId = () => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const fieldTypeTitle = computed(() => {
  const typeMap: Record<IFieldType, string> = {
    [IFieldType.Text]: "Text",
    [IFieldType.Email]: "Email",
    [IFieldType.Password]: "Password",
    [IFieldType.Date]: "Date",
    [IFieldType.Number]: "Number",
    [IFieldType.Phone]: "Phone",
    [IFieldType.FileUpload]: "File upload",
    [IFieldType.Select]: "Select",
    [IFieldType.MultiSelect]: "Multi-select",
    [IFieldType.TextArea]: "Text area",
  };
  return typeMap[props.fieldType] || props.fieldType;
});

const handleCreateField = () => {
  if (!labelText.value.trim()) return;

  const fieldConfig: IComplianceFieldConfig = {
    id: props.initialConfig?.id || generateId(),
    labelId:
      props.initialConfig?.labelId ||
      labelText.value.toLowerCase().replace(/\s+/g, "-"),
    labelTitle: labelText.value,
    fieldType: props.fieldType,
    inputType: mapFieldTypeToInputType(props.fieldType),
    inputPlaceholder: placeholderText.value,
    isRequired: isRequired.value,
    selectOptions: props.initialConfig?.selectOptions || [],
    position: props.initialConfig?.position || 0,
  };

  emit("fieldCreated", fieldConfig);
  emit("closeTriggered");
};

const mapFieldTypeToInputType = (fieldType: IFieldType): IInputType => {
  const typeMap: Record<IFieldType, IInputType> = {
    [IFieldType.Text]: IInputType.Text,
    [IFieldType.Email]: IInputType.Email,
    [IFieldType.Password]: IInputType.Password,
    [IFieldType.Date]: IInputType.Date,
    [IFieldType.Number]: IInputType.Number,
    [IFieldType.Phone]: IInputType.Text,
    [IFieldType.FileUpload]: IInputType.Text,
    [IFieldType.Select]: IInputType.Text,
    [IFieldType.MultiSelect]: IInputType.Text,
    [IFieldType.TextArea]: IInputType.Text,
  };
  return typeMap[fieldType] || IInputType.Text;
};
</script>

<style lang="scss" scoped>
.modal-cover-header {
  @apply mb-6;
}

.modal-cover-title {
  @apply text-lg font-semibold text-teal-900;
}

.modal-cover-body {
  @apply grid gap-6;
}

.field-group {
  @apply flex flex-col gap-2;
}

.field-label {
  @apply text-sm font-medium text-grey-700;
}

.required-group {
  @apply gap-3;
}

.required-label {
  @apply flex items-center gap-2 cursor-pointer;
}

.required-checkbox {
  @apply w-5 h-5 cursor-pointer;
  accent-color: #0f766e;
}

.required-text {
  @apply text-sm font-medium text-grey-800;
}

.required-hint {
  @apply text-xs text-grey-500;
}

.modal-cover-footer {
  @apply mt-6;
}
</style>
