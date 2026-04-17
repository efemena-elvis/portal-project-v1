<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">
          {{
            keyData?.key
              ? "Regenerate Publishable Key"
              : "Generate Publishable Key"
          }}
        </div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="publishable-key-area">
        <div class="publishable-key-input">
          <p class="text-sm text-grey-600 px-6 mt-4">
            Domains and IPs are optional. Use the corresponding actions to
            generate a publishable key or update the domain or IP address
            whitelist.
          </p>

          <div class="whitelist-block rounded-2xl">
            <TextFieldInput
              labelId="textDomains"
              labelTitle="Domains"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="Enter allowed domains, separated by commas"
              :inputValue="keyPayload.domains"
              @inputChanged="keyPayload.domains = $event"
            />

            <TextFieldInput
              labelId="textIPs"
              labelTitle="IPs"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="Enter allowed IP addresses, separated by commas"
              :inputValue="keyPayload.ips"
              @inputChanged="keyPayload.ips = $event"
            />

            <div class="">
              <button
                class="btn btn-primary w-full mt-3"
                ref="generateKeyBtnRef"
                :disabled="!isActionReady || isLoading"
                @click="handleGeneratePublishableKey"
              >
                {{
                  keyData?.key
                    ? "Regenerate Publishable Key"
                    : "Generate Publishable Key"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #modal-cover-footer>
      <div class="modal-cover-footer"></div>
    </template>
  </ModalDialog>

  <teleport to="body" v-if="showRevokeModal">
    <RevokeKeyModal
      @closeTriggered="toggleRevokeModal"
      @reloadPublishableKeys="fetchPublishableKeyData"
    />
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { IInputType } from "@packages/models";
import { useSettingsStore } from "@/modules/settings/store";
import { useEvents, useDate } from "@packages/hooks";
import { TextFieldInput, ModalDialog as UiModalDialog } from "@packages/uikit";
import RevokeKeyModal from "./revoke-key-modal.vue";

const ModalDialog = UiModalDialog as any;

type IPublishableKeyPayload = {
  domains?: string;
  ips?: string;
};

const emits = defineEmits(["closeTriggered"]);

const {
  fetchPublishableKey,
  generatePublishableKey,
  regeneratePublishableKey,
  whitelistPublishableKey,
} = useSettingsStore();
const { processAPIRequest } = useEvents();

const keyPayload = ref<IPublishableKeyPayload>({ domains: "", ips: "" });
const keyData = ref<any>(null);
const message = ref<string>("");
const showRevokeModal = ref<boolean>(false);
const generateKeyBtnRef = ref<HTMLButtonElement | null>(null);
const whitelistKeyBtnRef = ref<HTMLButtonElement | null>(null);
const isLoading = ref<boolean>(false);

const isActionReady = computed(() => {
  const domains = keyPayload.value.domains?.trim() || "";
  const ips = keyPayload.value.ips?.trim() || "";
  return Boolean(keyData.value?.key) || Boolean(domains) || Boolean(ips);
});

const getExpirationDate = (date: string) => {
  if (!date) return "-";
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  const time = useDate.formatTime(date);
  return `${w2}, ${d3} ${m3}, ${y1} - ${time}`;
};

const getPublishableKeyPayload = () => {
  const payload: Record<string, any> = {};
  const domains = (keyPayload.value?.domains ?? "")
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean);
  const ips = (keyPayload.value?.ips ?? "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
  if (domains.length) payload.domains = domains;
  if (ips.length) payload.ips = ips;
  return payload;
};

const normalizeResponse = (response: any) => response.data?.data;

const handleGeneratePublishableKey = async () => {
  message.value = "";
  const isRegenerating = Boolean(keyData.value?.key);
  const response = await processAPIRequest({
    action: isRegenerating ? regeneratePublishableKey : generatePublishableKey,
    btnRef: generateKeyBtnRef,
    btnText: isRegenerating
      ? "Regenerate Publishable Key"
      : "Generate Publishable Key",
    payload: isRegenerating ? undefined : getPublishableKeyPayload(),
    alertHandler: {
      200: {
        message: isRegenerating
          ? "Publishable key replaced successfully"
          : "Publishable key generated successfully",
        type: "success",
      },
      400: {
        message: isRegenerating
          ? "Failed to replace publishable key"
          : "Failed to generate publishable key",
        type: "error",
      },
    },
  });

  if (!response) return;
  keyData.value = normalizeResponse(response);
  message.value = isRegenerating ? response?.message : "";
};

const handleWhitelistPublishableKey = async () => {
  const response = await processAPIRequest({
    action: whitelistPublishableKey,
    btnRef: whitelistKeyBtnRef,
    btnText: "Whitelist Publishable Key",
    payload: getPublishableKeyPayload(),
    alertHandler: {
      200: {
        message: "Publishable key whitelist updated successfully",
        type: "success",
      },
      400: {
        message: "Failed to update publishable key whitelist",
        type: "error",
      },
    },
  });

  if (!response) return;
};

const toggleRevokeModal = () => {
  showRevokeModal.value = !showRevokeModal.value;
};

const fetchPublishableKeyData = async () => {
  isLoading.value = true;
  const response: any = await processAPIRequest({
    action: fetchPublishableKey,
    showAlert: false,
  });
  isLoading.value = false;
  if (!response) return;

  const keyInfo = normalizeResponse(response);
  keyPayload.value = {
    domains: Array.isArray(keyInfo?.allowed_domains)
      ? keyInfo.allowed_domains.join(", ")
      : keyInfo?.allowed_domains || "",
    ips: Array.isArray(keyInfo?.allowed_ips)
      ? keyInfo.allowed_ips.join(", ")
      : keyInfo?.allowed_ips || "",
  };
  keyData.value = keyInfo;
};

onMounted(() => {
  fetchPublishableKeyData();
});
</script>

<style scoped lang="scss">
.publishable-key-area {
  .publishable-key-input {
    .whitelist-block {
      @apply rounded-2xl p-6;
    }

    .text-grey-600 {
      @apply leading-7;
    }

    .modal-cover-footer {
      @apply hidden;
    }

    .btn-alert {
      @apply bg-red-500 text-neutral-10 hover:bg-red-600;
    }
  }
}
</style>
