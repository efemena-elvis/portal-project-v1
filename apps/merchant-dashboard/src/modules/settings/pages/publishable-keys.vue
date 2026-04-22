<template>
  <PageContentWrapper :showTitle="false">
    <template #pageOptions>
      <div class="-mt-12">
        <button
          class="btn btn-sm btn-primary w-48 !h-[60px]"
          @click="createNewKey"
        >
          Create Publishable Key
        </button>
      </div>
    </template>

    <template #pageContent>
      <div v-if="isLoading" class="flex justify-center py-8">
        <ComplianceSkeleton />
      </div>
      <div v-else-if="publishableKeys.length === 0" class="text-center py-8">
        <h3 class="text-lg font-medium text-grey-900">
          No publishable key yet
        </h3>
        <p class="text-grey-600 mt-2">
          You have not generated a publishable key yet. Use the Manage
          publishable key button to create one.
        </p>
      </div>

      <div
        v-else
        class="grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 gap-6"
      >
        <div
          v-for="(key, index) in publishableKeys"
          :key="index"
          class="bg-white border border-grey-200 rounded-lg p-6 shadow-sm relative"
        >
          <div class="absolute right-2 top-1">
            <div class="relative">
              <button
                @click.stop="toggleDropdown(key.id)"
                class="text-grey-400 hover:text-grey-600 p-1"
              >
                <div class="icon icon-ellipsis-h"></div>
              </button>

              <div
                v-if="activeKeyId === key.id"
                class="absolute right-0 mt-2 w-48 bg-white border border-grey-200 rounded-md shadow-lg z-10"
              >
                <button
                  v-for="option in dropdownOptions"
                  :key="option.label"
                  @click="
                    () => {
                      option.handler(key);
                      closeDropdown();
                    }
                  "
                  class="block w-full text-left px-4 py-2 text-sm text-grey-700 hover:bg-grey-100"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
          <div class="mb-4">
            <p class="text-sm text-grey-600 ">Key Name</p>
            <h2 class="text-lg font-medium text-grey-900">{{ key.name }}</h2>
          </div>
          <div class="mb-4">
            <div class="text-sm text-grey-600 mb-1">Date Created</div>
            <div class="text-sm font-medium">
              {{ getDateCreated(key.created_at) }}
            </div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-grey-600 mb-1">Key</div>
            <CopyLinkCell
              :link="key.key"
              :isText="true"
              class="text-sm font-mono bg-grey-50 p-2 rounded truncate"
            />
          </div>
          <div class="mb-4">
            <div class="text-sm text-grey-600 mb-1">Currency</div>
            <div class="text-sm font-medium">{{ key.currency || "N/A" }}</div>
          </div>
        </div>
      </div>
      <EmbeddedPaySnippet v-if="publishableKeys.length > 0" />
    </template>
  </PageContentWrapper>

  <teleport to="body" v-if="showManagePublishableKeyModal">
    <ManagePublishableKeyModal
      :isRegenerate="isRegenerateMode"
      :isUpdate="isUpdateMode"
      @closeTriggered="toggleManagePublishableKeyModal"
      @reloadPublishableKeys="fetchAllPublishableKeys"
      :keyData="keyData"
    />
  </teleport>

  <teleport to="body" v-if="showWhitelistModal">
    <WhitelistModal
      @closeTriggered="toggleWhitelistModal"
      @reloadPublishableKeys="fetchAllPublishableKeys"
    />
  </teleport>

  <teleport to="body" v-if="showRevokeModal">
    <RevokeKeyModal
      @closeTriggered="toggleRevokeModal"
      @reloadPublishableKeys="fetchAllPublishableKeys"
      :keyData="keyData"
    />
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ComplianceSkeleton, PageContentWrapper } from "@packages/uikit";
import { useSettingsStore } from "@/modules/settings/store";
import { useEvents, useDate } from "@packages/hooks";
import ManagePublishableKeyModal from "../modals/manage-publishable-key-modal.vue";
import WhitelistModal from "../modals/whitelist-modal.vue";
import RevokeKeyModal from "../modals/revoke-key-modal.vue";
import CopyLinkCell from "@/modules/payments/components/copy-link-cell.vue";
import { EmbeddedPaySnippet } from "@/modules/payments/components";

const { fetchPublishableKeys } = useSettingsStore();
const { processAPIRequest } = useEvents();

const publishableKeys = ref<any[]>([]);
const isLoading = ref(true);

const showManagePublishableKeyModal = ref(false);
const showWhitelistModal = ref(false);
const showRevokeModal = ref(false);

const isRegenerateMode = ref(false);
const isUpdateMode = ref(false);
const keyData = ref<any>(null);

const activeKeyId = ref<string | null>(null);

const getDateCreated = (date: string) => {
  if (!date) return "-";
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  const time = useDate.formatTime(date);
  return `${w2}, ${d3} ${m3}, ${y1} at ${time}`;
};

const buildPublishableKeys = (data: any) => {
  publishableKeys.value = Array.isArray(data) ? data : [];
};

const openManageModal = () => {
  showManagePublishableKeyModal.value = true;
};

const createNewKey = () => {
  isRegenerateMode.value = false;
  isUpdateMode.value = false;
  keyData.value = null;
  openManageModal();
};

const updateKey = (key: any) => {
  isUpdateMode.value = true;
  isRegenerateMode.value = false;
  keyData.value = key;

  openManageModal();
};

const regenerateKey = (key: any) => {
  isRegenerateMode.value = true;
  isUpdateMode.value = false;

  keyData.value = key;

  openManageModal();
};

const revokeKey = (key: any) => {
  keyData.value = key;
  showRevokeModal.value = true;
};

const whitelistAddresses = (key: any) => {
  keyData.value = key;
  showWhitelistModal.value = true;
};

const dropdownOptions = [
  { label: "Regenerate Key", handler: regenerateKey },
  { label: "Update Key", handler: updateKey },
  { label: "Revoke Key", handler: revokeKey },
  { label: "Whitelist Addresses", handler: whitelistAddresses },
];

const toggleDropdown = (keyId: string) => {
  activeKeyId.value = activeKeyId.value === keyId ? null : keyId;
};

const closeDropdown = () => {
  activeKeyId.value = null;
};

const fetchAllPublishableKeys = async () => {
  isLoading.value = true;

  const response: any = await processAPIRequest({
    action: fetchPublishableKeys,
    showAlert: false,
  });

  if (response?.code === 200) {
    buildPublishableKeys(response.data?.data);
  } else {
    publishableKeys.value = [];
  }

  isLoading.value = false;
};

const toggleManagePublishableKeyModal = () => {
  showManagePublishableKeyModal.value = false;
  isRegenerateMode.value = false;
  isUpdateMode.value = false;
};

const toggleWhitelistModal = () => {
  showWhitelistModal.value = false;
};

const toggleRevokeModal = () => {
  showRevokeModal.value = false;
};

onMounted(fetchAllPublishableKeys);
</script>

<style scoped></style>
