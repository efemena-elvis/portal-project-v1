<template>
  <ModalDialog
    place_center
    :modal_style="{
      shape: 'rounded-2xl',
      size: 'modal-md',
      background: 'bg-white',
    }"
    @closeModal="$emit('closeTriggered')"
  >
    <template #modal-cover-header>
      <div class="team-modal-header">
        <h2>{{ modalTitle }}</h2>
        <p>{{ modalDescription }}</p>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="team-modal-body grid gap-2 sm:grid-cols-2">
        <TextFieldInput
          labelTitle="Email address"
          labelId="team-member-email"
          :inputType="IInputType.Email"
          inputPlaceholder="Enter email address"
          :inputValue="form.email"
          @inputChanged="form.email = $event"
          :isRequired="true"
        />

        <SelectFieldInput
          labelTitle="Role"
          labelId="team-member-role"
          inputPlaceholder="Select role"
          :inputValue="form.role"
          :selectData="roleOptions"
          @onSelectionChange="form.role = $event"
          :isRequired="true"
        />
        <MultiSelectFieldInput
          :labelCompact="false"
          labelTitle="Country"
          labelId="team-member-country"
          inputPlaceholder="Select countries"
          :inputValueList="form.countries"
          :selectData="countryOptions"
          @onSelectionChange="form.countries = $event"
        />
      </div>
    </template>

    <template #modal-cover-footer>
      <div class="p-6">
        <button
          class="btn btn-sm btn-primary w-full"
          type="button"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          {{ submitButtonText }}
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from "vue";
import {
  ModalDialog,
  SelectFieldInput,
  MultiSelectFieldInput,
  TextFieldInput,
} from "@packages/uikit";
import { IInputType } from "@packages/models";

const props = withDefaults(
  defineProps<{
    member?: { email: string; role: string; countries: string[] } | null;
  }>(),
  { member: null },
);

const emit = defineEmits<{
  closeTriggered: [];
  memberAdded: [payload: { email: string; role: string; countries: string[] }];
  memberUpdated: [
    payload: { email: string; role: string; countries: string[] },
  ];
}>();

const form = reactive({
  email: "",
  role: "",
  countries: [] as string[],
});

const countryOptions = [
  { name: "Tanzania", value: "Tanzania" },
  { name: "Nigeria", value: "Nigeria" },
  { name: "Ghana", value: "Ghana" },
  { name: "Zambia", value: "Zambia" },
];

const roleOptions = [
  { name: "Admin", value: "admin" },
  { name: "Operations", value: "operations" },
];

const isFormValid = computed(
  () => !!form.email && !!form.countries.length && !!form.role,
);

const modalTitle = computed(() =>
  props.member ? "Edit team member" : "Add new team member",
);

const modalDescription = computed(() =>
  props.member
    ? "Update the team member's role and information."
    : "Invite a team member and assign the role they need to access this portal.",
);

const submitButtonText = computed(() =>
  props.member ? "Update member" : "Invite member",
);

const handleSubmit = () => {
  if (!isFormValid.value) return;

  if (props.member) {
    emit("memberUpdated", {
      email: form.email,
      role: form.role,
      countries: form.countries,
    });
  } else {
    emit("memberAdded", {
      email: form.email,
      role: form.role,
      countries: form.countries,
    });
  }
};

watch(
  () => props.member,
  (member) => {
    if (member) {
      form.email = member.email;
      form.role = member.role.toLowerCase();
      form.countries = Array.isArray(member.countries)
        ? [...member.countries]
        : [];
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.team-modal-header {
  @apply px-8 pt-8 sm:px-5 sm:pt-6;

  h2 {
    @apply text-[28px] font-bold text-grey-900 sm:text-2xl;
  }

  p {
    @apply mt-3 text-[15px] font-medium text-grey-600;
  }
}

.team-modal-body {
  @apply px-8 pt-8 sm:px-5 sm:pt-6;
}

.team-modal-footer {
  @apply flex justify-end gap-8 px-8 pb-8 pt-7 sm:flex-col sm:px-5 sm:pb-6;
}
</style>
