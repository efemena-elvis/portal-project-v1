<template>
  <AuthWrapper
    title_text="Log in to your account"
    meta_text="Welcome back! Please enter your details."
  >
    <form @submit.prevent="handleUserLogin">
      <!-- EMAIL ADDRESS -->
      <TextFieldInput
        labelId="businessEmail"
        labelTitle="Email address"
        :labelCompact="false"
        :inputType="IInputType.Email"
        :inputValue="loginPayload.email"
        inputPlaceholder="hello@companyname.com"
        isRequired
        @inputChanged="loginPayload.email = $event"
        @inputValidated="emailValidity = $event"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      />

      <!-- PASSWORD -->
      <TextFieldInput
        labelId="userPassword"
        labelTitle="Password"
        :labelCompact="false"
        :inputType="IInputType.Password"
        :inputValue="loginPayload.password"
        inputPlaceholder="Please enter your password"
        isRequired
        @inputChanged="loginPayload.password = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Password is a required field',
        }"
      />

      <div class="helper-row mt-5 mb-6">
        <div class="text">
          Forgot your password?
          <router-link :to="{ name: 'VesicashPasswordRequest' }">Reset it</router-link>
        </div>
      </div>

      <button
        class="btn btn-primary w-full my-5"
        ref="loginBtnRef"
        :disabled="isLoginReady"
      >
        Login to your dashboard
      </button>

      <div class="helper-row justify-center mt-7">
        <div class="text">
          Don't have an account yet?
          <router-link :to="{ name: 'VesicashCreateAccount' }">Register now</router-link>
        </div>
      </div>
    </form>
  </AuthWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { TextFieldInput } from "@packages/uikit";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import { useAuthStore } from "@/modules/auth/store";

type ILoginInputType = {
  email: string;
  password: string;
};

const loginPayload = ref<ILoginInputType>({
  email: "",
  password: "",
});

const emailValidity = ref<boolean>(false);
const loginBtnRef = ref(null);

const { loginUser } = useAuthStore();
const { processAPIRequest } = useEvents();

const isLoginReady = computed(() => {
  return loginPayload.value.email && loginPayload.value.password && emailValidity.value
    ? false
    : true;
});

const getLoginPayload = computed(() => {
  const { email, password } = loginPayload.value;
  return { email, password };
});

const handleUserLogin = async () => {
  const response = await processAPIRequest({
    action: loginUser,
    payload: getLoginPayload.value,
    btnRef: loginBtnRef,
    btnText: "Login to your dashboard",
    alertHandler: {
      200: {
        message: "Merchant login successful",
        description: "You are being redirected to your merchant dashboard",
        type: "success",
      },
      400: {
        message: "Merchant login failed",
        description: "Incorrect email address or password combination",
        type: "error",
      },
    },
  });

  if (response && response.code === 200) {
    // Check if user email is verified
    const { is_email_verified } = response.data;

    setTimeout(() => {
      location.replace(
        is_email_verified
          ? "/overview"
          : `/verify-account?email=${encodeURIComponent(getLoginPayload.value.email)}`
      );
    }, 1200);
  }
};
</script>

<style lang="scss" scoped></style>
