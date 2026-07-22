<template>
  <AuthWrapper
    title_text="Log in to admin portal"
    meta_text="Welcome back! Please enter your details."
  >
    <form @submit.prevent="handleUserLogin">
      <div class="flex flex-col gap-2 ]">
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
        <div class="helper-row justify-end mt-1 mb-4">
          <router-link
            :to="{ name: 'VesicashPasswordRequest' }"
            class="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Forgot password?
          </router-link>
        </div>

        <button
          class="btn btn-primary w-full mt-2"
          ref="loginBtnRef"
          :disabled="isLoginReady"
        >
          Login
        </button>
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
  return !(
    loginPayload.value.email &&
    loginPayload.value.password &&
    emailValidity.value
  );
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
        message: "Admin login successful",
        description: "You are being redirected to the dashboard",
        type: "success",
      },
      400: {
        message: "Admin login failed",
        description: "Incorrect email address or password combination",
        type: "error",
      },
    },
  });

  if (response && response.code === 200) {

    const { user } = response.data;
    const two_factor_enabled = user?.two_factor_enabled;
    const two_factor_verified = user?.two_factor_verified;

   

    setTimeout(() => {
      location.replace(
        `/overview`
        // two_factor_enabled && two_factor_verified
        //   ? `/verify-account?email=${encodeURIComponent(getLoginPayload.value.email)}`
        //   : `/mfa/setup?email=${encodeURIComponent(getLoginPayload.value.email)}`,
      );
    }, 1200);
  }
};
</script>

<style lang="scss" scoped></style>
