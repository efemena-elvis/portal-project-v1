<template>
  <AuthCenterWrapper
    title_text="Reset your password"
    meta_text="Your new password must be different from your previously used password."
    icon_display_type="icon-security-safe"
  >
    <form @submit.prevent="handleUserPasswordReset" class="w-4/5">
      <!-- PASSWORD -->
      <TextFieldInput
        labelId="password"
        labelTitle="New password"
        :labelCompact="false"
        :inputType="IInputType.Password"
        :inputValue="payload.password"
        inputPlaceholder="Please enter a new password"
        :isRequired="true"
        @inputChanged="payload.password = $event"
        @inputValidated="payloadValidity.password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
        }"
      />

      <!-- CONFIRM PASSWORD -->
      <TextFieldInput
        labelId="confirmPassword"
        labelTitle="Confirm password"
        :labelCompact="false"
        :inputType="IInputType.Password"
        :inputValue="payload.confirm_password"
        inputPlaceholder="Please confirm new password"
        :isRequired="true"
        @inputChanged="payload.confirm_password = $event"
        @inputValidated="payloadValidity.confirm_password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
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
          <router-link to="/login">Login</router-link>
        </div>
      </div>
    </form>
  </AuthCenterWrapper>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { TextFieldInput } from "@packages/uikit";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import AuthCenterWrapper from "@/modules/auth/components/auth-center-wrapper.vue";
import { useAuthStore } from "@/modules/auth/store";

type IPayloadInputType = {
  password: string;
  confirm_password: string;
};

type IPayloadValidity = {
  password: boolean;
  confirm_password: boolean;
};

const payload = ref<IPayloadInputType>({
  password: "",
  confirm_password: "",
});

const payloadValidity = ref<IPayloadValidity>({
  password: false,
  confirm_password: false,
});

const route = useRoute();
const btnRef = ref(null);

const { resetUserPassword } = useAuthStore();
const { pushToastAlert, processAPIRequest } = useEvents();

const isActionReady = computed(() => {
  return payload.value.password &&
    payload.value.confirm_password &&
    payloadValidity.value.password &&
    payloadValidity.value.confirm_password
    ? false
    : true;
});

const getRouteToken = computed(() => route.params.token);

const getPayload = computed(() => {
  const { password } = payload.value;
  return { password, token: getRouteToken.value };
});

const handleUserPasswordReset = async () => {
  if (payload.value.password !== payload.value.confirm_password) {
    pushToastAlert({ message: "Passwords do not match", type: "warning" });
    return;
  }

  const response = await processAPIRequest({
    action: resetUserPassword,
    payload: getPayload.value,
    btnRef: btnRef,
    btnText: "Reset password",
    alertHandler: {
      200: {
        message: "Password reset was successful",
        type: "success",
      },
      400: {
        message: "Password reset failed",
        description: "Unable to reset password at this time",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    setTimeout(() => (location.href = "/confirm-password-reset"), 1200);
  }
};
</script>
