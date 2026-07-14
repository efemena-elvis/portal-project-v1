<template>
  <AuthWrapper
    title_text="Enter authentication code"
    meta_text="Enter the code from your authenticator app"
    icon_display_type="icon-mail"
  >
    <form @submit.prevent="handleUserEmailVerification">
      <div class="account-content-area">
        <div class="input-row">
          <input
            type="number"
            inputmode="numeric"
            class="form-control"
            v-for="(_, index) in otpFields"
            :key="index"
            v-model="otpFields[index]"
            :ref="(el) => setOtpRef(el, index)"
            :maxlength="1"
            :data-index="index"
            @input="moveFieldFocus(index)"
            @keydown.delete="handleBackspace(index)"
            @paste="handlePaste($event)"
            :class="{ '!border-green-500': otpFields[index] }"
          />
        </div>

        <button
          class="btn btn-primary w-full"
          ref="verifyBtnRef"
          :disabled="isVerifyReady"
        >
          Verify
        </button>
      </div>
    </form>
  </AuthWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useEvents } from "@packages/hooks";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import { useAuthStore } from "@/modules/auth/store";

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const { verifyMfaOtp, verifyLogin } = authStore;
const { processAPIRequest } = useEvents();

const verifyBtnRef = ref(null);

const otpFields = ref(Array(6).fill(""));
const otpRefs = ref<(HTMLInputElement | null)[]>([]);

const getOTPToken = computed(() => otpFields.value.join(""));

const isVerifyReady = computed(() => {
  return getOTPToken.value.length !== 6;
});

const setOtpRef = (el: any, index: number) => {
  otpRefs.value[index] = el;
};

const moveFieldFocus = (index: number) => {
  let val = otpFields.value[index];

  if (val.length > 1) {
    val = val.charAt(0);
    otpFields.value[index] = val;
  }

  if (val !== "" && index < otpFields.value.length - 1) {
    nextTick(() => {
      otpRefs.value[index + 1]?.focus();
    });
  }

  if (index === otpFields.value.length - 1 && val !== "") {
    nextTick(() => {
      otpRefs.value[index]?.blur();
    });
  }
};

const handleBackspace = (index: number) => {
  if (otpFields.value[index] === "" && index > 0) {
    nextTick(() => {
      otpRefs.value[index - 1]?.focus();
    });
  }
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData("text/plain").trim() || "";
  const otpValues = pastedData
    .replace(/\D/g, "")
    .slice(0, otpFields.value.length)
    .split("");

  otpValues.forEach((value, index) => {
    otpFields.value[index] = value;
  });

  const lastFilledIndex = otpValues.length - 1;

  if (lastFilledIndex === otpFields.value.length - 1) {
    nextTick(() => otpRefs.value[lastFilledIndex]?.blur());
  } else if (lastFilledIndex < otpFields.value.length - 1) {
    nextTick(() => otpRefs.value[lastFilledIndex + 1]?.focus());
  }
};

const handleUserEmailVerification = async () => {
  const isMfaMode = route.query.mode === "mfa";
  const email = (route.query.email as string) || "";

  const action = isMfaMode
    ? () => verifyMfaOtp({ code: getOTPToken.value })
    : () => verifyLogin({ email, mfa_code: getOTPToken.value });

  const response = await processAPIRequest({
    action,
    payload: isMfaMode
      ? { code: getOTPToken.value }
      : { email, mfa_code: getOTPToken.value },
    btnRef: verifyBtnRef,
    btnText: "Verify",
    alertHandler: {
      200: {
        message: "Two-factor authentication verified successfully",
        type: "success",
      },

      400: {
        message: "Verification failed",
        description: "Invalid OTP code",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    setTimeout(() => {
      router.push("/overview");
    }, 2000);
  }
};

onMounted(() => {
  otpRefs.value[0]?.focus();
});
</script>

<style lang="scss" scoped>
.account-content-area {
  @apply w-auto flex flex-col justify-start items-center mx-auto;

  .input-row {
    @apply flex justify-center items-start gap-x-3 mdLg:gap-x-2 mb-11;

    .form-control {
      @apply h-12 w-12  text-center text-[20px]  font-semibold sm:font-medium text-green-500 py-4 focus:shadow-sm focus:shadow-green-100/80;
    }
  }
}
</style>
