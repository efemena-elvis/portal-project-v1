<template>
  <ModalDialog @closeModal="$emit('closeTriggered')" place_center>
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Set up new compliance</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body">
        <TextFieldInput
          labelId="compliance-name"
          labelTitle="Compliance name"
          :inputType="IInputType.Text"
          inputPlaceholder="e.g. Merchant compliance"
          :inputValue="complianceName"
          @inputChanged="complianceName = $event"
        />

        <TextFieldInput
          :isTextArea="true"
          labelId="compliance-description"
          labelTitle="Description"
          :inputType="IInputType.Text"
          inputPlaceholder="Brief description of this compliance"
          :inputValue="complianceDescription"
          @inputChanged="complianceDescription = $event"
        />

        <SelectFieldInput
          labelId="compliance-country"
          labelTitle="Target country"
          inputPlaceholder="Select a country"
          :selectData="countryOptions"
          :inputValue="targetCountry"
          @onSelectionChange="targetCountry = $event"
        />
      </div>
    </template>

    <template #modal-cover-footer>
      <div class="modal-cover-footer">
        <button
          class="btn btn-primary w-full"
          ref="createBtnRef"
          :disabled="isActionReady"
          @click="handleCreate"
        >
          Start setup
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ModalDialog, TextFieldInput, SelectFieldInput } from "@packages/uikit";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";

const { processAPIRequest } = useEvents();

const createBtnRef = ref<HTMLButtonElement | null>(null);
const complianceName = ref("");
const complianceDescription = ref("");
const targetCountry = ref("");

const countryOptions = [
  { value: "Tanzania", name: "Tanzania" },
  { value: "Ghana", name: "Ghana" },
  { value: "Nigeria", name: "Nigeria" },
  { value: "South Africa", name: "South Africa" },
  { value: "Zambia", name: "Zambia" },
];

const isActionReady = computed(
  () => !complianceName.value || !targetCountry.value,
);

const emit = defineEmits(["closeTriggered"]);

const handleCreate = async () => {
  await processAPIRequest({
    action: () =>
      Promise.resolve({
        code: 200,
        message: "Compliance created successfully",
      }),
    payload: {
      name: complianceName.value,
      description: complianceDescription.value,
      country: targetCountry.value,
    },
    btnRef: createBtnRef,
    btnText: "Create Compliance",
    alertHandler: {
      200: { type: "success", message: "Compliance created successfully" },
      400: { type: "error", message: "Failed to create compliance" },
    },
  });

  emit("closeTriggered");
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
  @apply grid gap-4;
}

.modal-cover-footer {
  @apply mt-6;
}
</style>
