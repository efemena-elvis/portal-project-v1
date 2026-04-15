<template>
  <div class="publishable-key-area">
    <ComplianceSkeleton v-if="isLoading" />

    <div class="publishable-key-input" v-else>
      <div class="title-text">Manage Publishable Key</div>

      <p class="mt-3 text-sm text-grey-600">
        Domains and IPs are optional. Use this separate action to update the
        domain or IP address whitelist.
      </p>

      <div class="whitelist-block bg-grey-05 rounded-2xl mt-4">
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

        <div class="flex sm:flex-col items-center gap-6 my-6">
          <button
            class="sm:w-full w-1/2 btn btn-primary"
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

          <button
            class="sm:w-full w-1/2 btn btn-secondary disabled:text-neutral-50"
            ref="whitelistKeyBtnRef"
            :disabled="!isActionReady || isLoading"
            @click="handleWhitelistPublishableKey"
          >
            Whitelist
          </button>
        </div>

        <div v-if="keyData?.old_key" class="flex flex-col gap-1">
          <TextFieldInput
            labelId="oldPublishableKey"
            labelTitle="Old Publishable Key"
            :labelCompact="false"
            :inputType="IInputType.Text"
            :inputValue="keyData?.old_key"
            inputBaseColor="bg-grey-10"
            :showTextCopy="true"
            copiedText="Publishable key copied successfully"
            :isRequired="false"
            :isDisabled="true"
          />
          <div class=" text-gray-500 text-[13px] relative -top-4 "
            >Expires on:
            {{ getExpirationDate(keyData?.old_key_expires_at) }}</div>
        </div>

        <TextFieldInput
          labelId="currentPublishableKey"
          labelTitle="Current Publishable Key"
          :labelCompact="false"
          :inputType="IInputType.Text"
          :inputValue="keyData?.key"
          inputPlaceholder="No publishable key available"
          inputBaseColor="bg-grey-10"
          :showTextCopy="true"
          copiedText="Publishable key copied successfully"
          :isRequired="false"
          :isDisabled="true"
        />

        <p class="my-4 text-grey-500 text-[13px]">{{ message }}</p>

        <div class="flex justify-end gap-6 mt-6">
          <button
            class="btn btn-sm btn-alert"
            @click="toggleRevokeModal"
            :disabled="!keyData?.key || isLoading"
          >
            Revoke Publishable Key
          </button>
        </div>
      </div>
    </div>

    <teleport to="body" v-if="showRevokeModal">
    <RevokeKeyModal
      @closeTriggered="toggleRevokeModal"
       @reloadPublishableKeys="fetchPublishableKeyData"
    />
  </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { IInputType } from "@packages/models";
import { useSettingsStore } from "@/modules/settings/store";
import { useEvents, useDate } from "@packages/hooks";
import {
  TextFieldInput,
  ComplianceSkeleton,
} from "@packages/uikit";
import RevokeKeyModal from "../modals/revoke-key-modal.vue";

type IPublishableKeyPayload = {
  domains?: string;
  ips?: string;
};

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
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  const time = useDate.formatTime(date)
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

const normalizeResponse = (response: any) => {
  return response.data?.data;
};

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
  const response = await processAPIRequest({
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

<style lang="scss" scoped>
.publishable-key-area {
  @apply flex items-start sm:flex-col w-[640px] sm:w-full;

  .publishable-key-input {
    @apply w-full;

    .title-text {
      @apply mb-2 text-2xl font-semibold text-grey-900;
    }
  }
}
</style>
