<template>
  <div class="change-password-page">
    <div class="card">
      <h2 class="card-title">Change password</h2>
      <p class="card-description">Update your account password</p>

      <form @submit.prevent="handleChangePassword">
        <TextFieldInput
          labelId="currentPassword"
          labelTitle="Current password"
          :labelCompact="false"
          :inputType="IInputType.Password"
          inputPlaceholder="Enter your current password"
          :isRequired="true"
          @inputChanged="payload.current_password = $event"
          @inputValidated="currentValidity = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Current password is required',
          }"
        />

        <TextFieldInput
          labelId="newPassword"
          labelTitle="New password"
          :labelCompact="false"
          :inputType="IInputType.Password"
          inputPlaceholder="Enter your new password"
          :isRequired="true"
          @inputChanged="payload.new_password = $event"
          @inputValidated="passwordValidity = $event"
          :errorHandler="{
            validator: 'validatePasswordStrength',
            message: 'Password is not strong enough',
          }"
        />

        <TextFieldInput
          labelId="confirmPassword"
          labelTitle="Confirm new password"
          :labelCompact="false"
          :inputType="IInputType.Password"
          inputPlaceholder="Re-enter your new password"
          :isRequired="true"
          @inputChanged="payload.new_password_confirmation = $event"
          @inputValidated="confirmValidity = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Please confirm your password',
          }"
        />

        <button
          class="btn btn-primary w-full mt-8"
          ref="btnRef"
          :disabled="isActionReady"
        >
          Change password
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { TextFieldInput } from "@packages/uikit";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";

const router = useRouter();

type IChangePasswordPayload = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

const payload = ref<IChangePasswordPayload>({
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
});

const currentValidity = ref(false);
const passwordValidity = ref(false);
const confirmValidity = ref(false);
const btnRef = ref(null);

const { changeUserPassword } = useAuthStore();
const { processAPIRequest } = useEvents();

const isActionReady = computed(() => {
  return !(
    payload.value.current_password &&
    payload.value.new_password &&
    payload.value.new_password_confirmation &&
    currentValidity.value &&
    passwordValidity.value &&
    confirmValidity.value
  );
});

const getPayload = computed(() => ({
  current_password: payload.value.current_password,
  new_password: payload.value.new_password,
}));

const handleChangePassword = async () => {
  const response = await processAPIRequest({
    action: changeUserPassword,
    payload: getPayload.value,
    btnRef,
    btnText: "Change password",
    alertHandler: {
      200: {
        message: "Password changed successfully",
        description: "Your password has been updated",
        type: "success",
      },
      400: {
        message: "Password change failed",
        description: "Current password is incorrect or new password is invalid",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    setTimeout(() => router.push({ name: "VesicashOverview" }), 2000);
  }
};
</script>

<style lang="scss" scoped>
.change-password-page {
  @apply flex justify-center pt-8;

  .card {
    @apply w-full max-w-lg bg-white rounded-lg p-8 shadow-sm;

    .card-title {
      @apply text-2xl font-semibold text-grey-800 mb-1;
    }

    .card-description {
      @apply text-sm text-grey-600 mb-8;
    }
  }
}
</style>
