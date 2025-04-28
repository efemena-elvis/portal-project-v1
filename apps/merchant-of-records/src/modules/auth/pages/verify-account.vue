<template>
  <AuthCenterWrapper
    title_text="Verify business email"
    :meta_text="`A confirmation code has been sent to <br>
      <span class='text-green-500 font-medium'>${userEmailAddress}</span>`"
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
          Verify email
        </button>

        <div class="helper-row justify-center mt-7">
          <div class="text">
            Didn't receive the email?
            <router-link
              to=""
              @click.prevent="resendOTP"
              :class="{
                'pointer-events-none text-gray-400': resendCountdown > 0,
              }"
            >
              {{ resendText }}
            </router-link>
          </div>
        </div>
      </div>
    </form>
  </AuthCenterWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents, useProfile } from "@packages/hooks";
import AuthCenterWrapper from "@/modules/auth/components/auth-center-wrapper.vue";
import { useAuthStore } from "@/modules/auth/store";

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const { sendVerifyEmailOTP, verifyEmailOTP } = authStore;
const { processAPIRequest } = useEvents();

const userEmailAddress = ref<string | null>(null);
const verifyBtnRef = ref(null);

const otpFields = ref(Array(4).fill(""));
const otpRefs = ref<(HTMLInputElement | null)[]>([]);

const resendCountdown = ref(0);
let countdownInterval: number | null = null;

const getOTPToken = computed(() => otpFields.value.join(""));

const isVerifyReady = computed(() => {
  return userEmailAddress.value && getOTPToken.value.length === 4
    ? false
    : true;
});

const getVerifyPayload = computed(() => {
  return { email: userEmailAddress.value, token: getOTPToken.value };
});

// Initialize the refs array
const setOtpRef = (el: any, index: number) => {
  otpRefs.value[index] = el;
};

const resendText = computed(() => {
  return resendCountdown.value > 0
    ? `Resend in ${resendCountdown.value}s`
    : "Click to resend";
});

const getUserEmailAddress = () => {
  if (!Array.isArray(route.query.email)) {
    const decodedEmail = decodeURIComponent(route.query.email as string);
    userEmailAddress.value = decodedEmail || "No email address";
  }
};

const moveFieldFocus = (index: number) => {
  const val = otpFields.value[index];

  // Always truncate to a single digit
  if (val.length > 1) {
    otpFields.value[index] = val.charAt(0);
  }

  // Move focus if not the last input
  if (val && index < otpFields.value.length - 1) {
    nextTick(() => {
      otpRefs.value[index + 1]?.focus();
    });
  }

  // If last input is filled, blur all inputs
  if (index === otpFields.value.length - 1 && val) {
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

// Handle OTP paste
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

  // Blur last field after paste
  const lastFilledIndex = otpValues.length - 1;

  if (lastFilledIndex === otpFields.value.length - 1) {
    nextTick(() => otpRefs.value[lastFilledIndex]?.blur());
  } else if (lastFilledIndex < otpFields.value.length - 1) {
    nextTick(() => otpRefs.value[lastFilledIndex + 1]?.focus());
  }
};

// HANDLE OTP RESEND
const resendOTP = () => {
  if (resendCountdown.value > 0) return;

  // Start countdown
  resendCountdown.value = 30;

  // Clear any existing interval
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  // Start new countdown
  countdownInterval = window.setInterval(() => {
    resendCountdown.value -= 1;

    if (resendCountdown.value <= 0 && countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }, 1000);

  // Here you would call your API to resend the OTP
  console.log("Resending OTP...");
  // Example: await sendOTP();
};

const handleUserEmailVerification = async () => {
  const response = await processAPIRequest({
    action: verifyEmailOTP,
    payload: getVerifyPayload.value,
    btnRef: verifyBtnRef,
    btnText: "Verify email address",
    alertHandler: {
      200: {
        message: "Email address is verified",
        type: "success",
      },

      400: {
        message: "Email verification failed",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    // Check if user is authenticated
    setTimeout(() => {
      router.push(
        profileUtil.isUserAuthenticated() ? "/confirm-verify-account" : "/login"
      );
    }, 2000);
  }
};

// SEND OUT EMAIL VERIFICATION
const sendOutEmailToken = async () => {
  await processAPIRequest({
    action: sendVerifyEmailOTP,
    payload: { email: userEmailAddress.value },
    showAlert: false,
  });
};

// Focus the first input when component mounts
onMounted(async () => {
  otpRefs.value[0]?.focus();
  await sendOutEmailToken();
});

// Clean up interval when component unmounts
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

getUserEmailAddress();
</script>

<style lang="scss" scoped>
.account-content-area {
  @apply w-auto flex flex-col justify-start items-center mx-auto;

  .input-row {
    @apply mx-auto flex justify-center items-start gap-x-3 mdLg:gap-x-2 mb-11;

    .form-control {
      @apply h-20 mdLg:h-16 sm:h-14 w-20 mdLg:w-16 sm:w-14 text-center text-[40px] mdLg:text-[32px] sm:text-[26px] font-semibold sm:font-medium text-green-500 py-4 focus:shadow-sm focus:shadow-green-100/80;
    }
  }
}
</style>
