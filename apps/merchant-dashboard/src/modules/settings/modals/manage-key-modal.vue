<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Manage Publishable Key</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="publishable-key-area">
        <div class="publishable-key-input">
          <p class="text-sm text-grey-600 px-6 mt-4">
            Update allowed domains and IPs, or revoke the current publishable
            key.
          </p>

          <div class="whitelist-block bg-grey-05 rounded-2xl ">
            <TextFieldInput
              labelId="manageDomains"
              labelTitle="Allowed domains"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="Enter allowed domains, separated by commas"
              :inputValue="keyPayload.domains"
              @inputChanged="keyPayload.domains = $event"
            />

            <TextFieldInput
              labelId="manageIps"
              labelTitle="Allowed IPs"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="Enter allowed IP addresses, separated by commas"
              :inputValue="keyPayload.ips"
              @inputChanged="keyPayload.ips = $event"
            />

            <div class="flex sm:flex-col gap-4 mt-8 mr-3">
              <button
                class="w-1/2 btn btn-primary"
                ref="whitelistKeyBtnRef"
                :disabled="!isActionReady || isLoading"
                @click="handleWhitelistPublishableKey"
              >
                Update whitelist
              </button>

              <button
                class=" w-1/2 btn btn-alert"
                :disabled="!keyData?.key || isLoading"
                @click="toggleRevokeModal"
              >
                Revoke key
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
      @reloadPublishableKeys="reloadPublishableKeys"
    />
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { IInputType } from "@packages/models";
import { useSettingsStore } from "@/modules/settings/store";
import { useEvents} from "@packages/hooks";
import { TextFieldInput, ModalDialog as UiModalDialog } from "@packages/uikit";
import RevokeKeyModal from "./revoke-key-modal.vue";

const ModalDialog = UiModalDialog as any;

type IPublishableKeyPayload = {
  domains?: string;
  ips?: string;
};

const emits = defineEmits(["closeTriggered", "reloadPublishableKeys"]);

const { fetchPublishableKey, whitelistPublishableKey } = useSettingsStore();
const { processAPIRequest } = useEvents();

const keyPayload = ref<IPublishableKeyPayload>({ domains: "", ips: "" });
const keyData = ref<any>(null);
const message = ref<string>("");
const showRevokeModal = ref<boolean>(false);
const whitelistKeyBtnRef = ref<HTMLButtonElement | null>(null);
const isLoading = ref<boolean>(false);

const isActionReady = computed(() => {
  const domains = keyPayload.value.domains?.trim() || "";
  const ips = keyPayload.value.ips?.trim() || "";
  return Boolean(domains) || Boolean(ips);
});

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

const handleWhitelistPublishableKey = async () => {
  const response = await processAPIRequest({
    action: whitelistPublishableKey,
    btnRef: whitelistKeyBtnRef,
    btnText: "Update Publishable Key Whitelist",
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
  message.value = response?.message || "Whitelist updated successfully";
  await fetchPublishableKeyData();
  emits("reloadPublishableKeys");
};

const toggleRevokeModal = () => {
  showRevokeModal.value = !showRevokeModal.value;
};

const reloadPublishableKeys = () => {
  fetchPublishableKeyData();
  emits("reloadPublishableKeys");
};

onMounted(fetchPublishableKeyData);
</script>

<style lang="scss" scoped>
.publishable-key-area {
  .publishable-key-input {
    .whitelist-block {
      @apply rounded-2xl p-6;
    }

    .text-grey-600 {
      @apply leading-7;
    }

 
  }
}
</style>
