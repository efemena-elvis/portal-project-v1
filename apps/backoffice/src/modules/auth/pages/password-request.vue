<template>
  <AuthWrapper
    title_text="Forgot your password"
    meta_text="No worries, we'll send you reset instructions."
  >
    <form @submit.prevent="handleUserPasswordRequest">
      <!-- EMAIL ADDRESS -->
      <TextFieldInput
        labelId="businessEmail"
        labelTitle="Email address"
        :labelCompact="false"
        :inputType="IInputType.Email"
        inputPlaceholder="hello@companyname.com"
        :isRequired="true"
        @inputChanged="payload.email = $event"
        @inputValidated="emailValidity = $event"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      />

      <button
        class="btn btn-primary w-full mt-8 mb-2"
        ref="btnRef"
        :disabled="isActionReady"
      >
        Request password reset
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

type IPayloadInputType = {
  email: string;
};

const payload = ref<IPayloadInputType>({
  email: "",
});

const emailValidity = ref<boolean>(false);
const btnRef = ref(null);

const { requestUserPassword } = useAuthStore();
const { processAPIRequest } = useEvents();

const isActionReady = computed(() => {
  return !(payload.value.email && emailValidity.value);
});

const getPayload = computed(() => {
  return { email: payload.value.email };
});

const handleUserPasswordRequest = async () => {
  const response = await processAPIRequest({
    action: requestUserPassword,
    payload: getPayload.value,
    btnRef,
    btnText: "Request password reset",
    alertHandler: {
      200: {
        message: "Password request mail sent",
        description: "Access your mail to reset your password",
        type: "success",
      },
      400: {
        message: "User email is not recognized",
        description: "Unable to request password reset",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    setTimeout(() => location.replace("/reset-password"), 2000);
  }
};
</script>
