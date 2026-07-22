<template>
  <AuthWrapper
    title_text="Reset your password"
    meta_text="Enter the code sent to your email and your new password."
  >
    <form @submit.prevent="handlePasswordReset">
      <TextFieldInput
        labelId="resetCode"
        labelTitle="Reset code"
        :labelCompact="false"
        :inputType="IInputType.Number"
        inputPlaceholder="Enter the code from your email"
        :isRequired="true"
        @inputChanged="payload.code = $event"
        @inputValidated="codeValidity = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Reset code is required',
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
        class="btn btn-primary w-full mt-8 mb-2"
        ref="btnRef"
        :disabled="isActionReady"
      >
        Reset password
      </button>

      <div class="helper-row justify-center mt-5">
        <div class="text">
          Remember your password?
          <router-link :to="{ name: 'VesicashLogin' }">Login</router-link>
        </div>
      </div>
    </form>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { TextFieldInput } from "@packages/uikit";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import { useAuthStore } from "@/modules/auth/store";

type IResetPayload = {
  code: string;
  new_password: string;
  new_password_confirmation: string;
};

const payload = ref<IResetPayload>({
  code: "",
  new_password: "",
  new_password_confirmation: "",
});

const codeValidity = ref(false);
const passwordValidity = ref(false);
const confirmValidity = ref(false);
const btnRef = ref(null);

const { resetUserPassword } = useAuthStore();
const { processAPIRequest } = useEvents();

const isActionReady = computed(() => {
  return !(
    payload.value.code &&
    payload.value.new_password &&
    payload.value.new_password_confirmation &&
    codeValidity.value &&
    passwordValidity.value &&
    confirmValidity.value
  );
});

const getPayload = computed(() => ({
  code: payload.value.code,
  new_password: payload.value.new_password,
  new_password_confirmation: payload.value.new_password_confirmation,
}));

const handlePasswordReset = async () => {
  const response = await processAPIRequest({
    action: resetUserPassword,
    payload: getPayload.value,
    btnRef,
    btnText: "Reset password",
    alertHandler: {
      200: {
        message: "Password reset successful",
        description: "You can now log in with your new password",
        type: "success",
      },
      400: {
        message: "Password reset failed",
        description: "Invalid code or password does not meet requirements",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    setTimeout(() => (location.href = "/login"), 2000);
  }
};
</script>
