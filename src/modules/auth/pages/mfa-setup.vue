<template>
  <AuthWrapper
    title_text="Set up two-factor authentication"
    :meta_text="`Scan the QR code below with your authenticator app (e.g. Google Authenticator, Authy).`"
    hasBottomPadding
  >
    <div class="mfa-content">
      <div v-if="qrCodeUrl" class="qr-section">
        <img :src="qrCodeUrl" alt="QR Code" class="qr-code" />
      </div>
      <div v-else class="loading-text">Loading QR code...</div>

      <div v-if="secret" class="secret-section">
        <p class="secret-label">Or enter this key manually:</p>
        <code class="secret-key">{{ secret }}</code>
      </div>

      <button
        class="btn btn-primary w-full mt-6"
        ref="continueBtnRef"
        @click="handleContinue"
      >
        I've scanned the code — Continue
      </button>
    </div>
  </AuthWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents } from "@packages/hooks";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import { useAuthStore } from "@/modules/auth/store";

const route = useRoute();
const router = useRouter();

const { setupMfa } = useAuthStore();
const { processAPIRequest } = useEvents();

const qrCodeUrl = ref("");
const secret = ref("");
const continueBtnRef = ref(null);

const userEmail = (route.query.email as string) || "";

const fetchQrCode = async () => {
  const response = await processAPIRequest({
    action: setupMfa,
    showAlert: false,
  });

  if (response && response.code === 200 && response.data) {
    qrCodeUrl.value = response.data.qr_code_url || "";
    secret.value = response.data.secret || "";
  }
};

const handleContinue = () => {
  router.push(
    `/verify-account?email=${encodeURIComponent(userEmail)}&mode=mfa`,
  );
};

onMounted(() => {
  fetchQrCode();
});
</script>

<style lang="scss" scoped>
.mfa-content {
  @apply flex flex-col items-center;

  .qr-section {
    @apply mb-4;
  }

  .qr-code {
    @apply w-64 h-64;
  }

  .loading-text {
    @apply text-grey-500 mb-4;
  }

  .secret-section {
    @apply text-center mb-4;

    .secret-label {
      @apply text-sm text-grey-600 mb-1;
    }

    .secret-key {
      @apply text-sm font-mono bg-gray-100 px-3 py-1 rounded;
    }
  }
}
</style>
