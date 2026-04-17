<template>
  <PageContentWrapper
    pageDescription="Publishable Keys"
    :showTitle="false"
    :pageKeys="{ green: 'Active', red: 'Inactive' }"
    :pagingData="tablePaging"
  >
    <template #pageOptions>
      <div class="-mt-12" >

        <button
          class="btn btn-sm btn-primary w-48 !h-[60px]"
          @click="toggleCreatePublishableKeyModal"
        >
          Create Publishable Key
        </button>
      </div>
    </template>

    <template #pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :hasCustomBtn="false"
        :emptyData="{
          title: 'No publishable key yet',
          description:
            'You have not generated a publishable key yet. Use the Manage publishable key button to create one.',
        }"
      >
        <TableContainerBody
          v-for="(row, index) in tableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="row"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>

  <teleport to="body" v-if="showCreatePublishableKeyModal">
    <CreatePublishableKeyModal
      @closeTriggered="toggleCreatePublishableKeyModal"
      @reloadPublishableKeys="fetchAllPublishableKeys"
    />
  </teleport>

  <teleport to="body" v-if="showManageKeyModal">
    <ManageKeyModal
      @closeTriggered="toggleManageKeyModal"
      @reloadPublishableKeys="fetchAllPublishableKeys"
    />
  </teleport>
</template>

<script setup lang="ts">
import {
  PageContentWrapper,
  TableContainer,
  TableContainerBody,
  TableActionBtn,
  TableDoubleColumn,
} from "@packages/uikit";
import { TableHeaderType } from "@packages/models";
import { ref, onMounted, h } from "vue";
import { useSettingsStore } from "@/modules/settings/store";
import { useEvents, useString, useDate } from "@packages/hooks";
import CreatePublishableKeyModal from "../modals/create-publishable-key-modal.vue";
import ManageKeyModal from "../modals/manage-key-modal.vue";
import CopyLinkCell from "@/modules/payments/components/copy-link-cell.vue";

const { fetchPublishableKey } = useSettingsStore();
const { processAPIRequest } = useEvents();
const { getStatus } = useString();

const tableBody = ref<any[]>([]);
const isLoading = ref(true);
const tablePaging = ref<any>({});
const showCreatePublishableKeyModal = ref(false);
const showManageKeyModal = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "S/N", slug: "counter" },
    { title: "Date Created", slug: "date_created" },
  { title: "Publishable Key", slug: "key" },
  { title: "Status", slug: "status" },
  { title: "Allowed Domains", slug: "domains" },
  { title: "Allowed IPs", slug: "ips" },
  { title: "", slug: "action" },
]);

const getStatusLabel = (keyType: string) => {
  return keyType === "current"
    ? getStatus("success", "Active")
    : getStatus("failed", "Expired");
};

const getDateCreated = (date: string) => {
  if (!date) return "-";
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  const time = useDate.formatTime(date);
  return `${w2}, ${d3} ${m3}, ${y1}`
};

const buildTableBody = (data: any) => {
  const rows: any[] = [];

  if (data?.key) {
    rows.push({
      counter: 1,
      key: h(CopyLinkCell, {
        link: data.key, 
      }),
      status: getStatusLabel("current"),
      domains: Array.isArray(data.allowed_domains)
        ? data.allowed_domains.join(", ")
        : data.allowed_domains || "-",
      ips: Array.isArray(data.allowed_ips)
        ? data.allowed_ips.join(", ")
        : data.allowed_ips || "-",
     date_created: h(TableDoubleColumn, {
        entry: {
          primaryText: getDateCreated(data.created_at),
          secondaryText: useDate.formatTime(data.created_at),
        },
      }),
      action: h(TableActionBtn, {
        showPrimaryBtn: true,
        primaryBtnText: "Manage key",
        onManageClick: toggleManageKeyModal,
      }),
    });
  }

  tableBody.value = rows;
};

const fetchAllPublishableKeys = async () => {
  isLoading.value = true;

  const response: any = await processAPIRequest({
    action: fetchPublishableKey,
    showAlert: false,
  });

  if (response && response.code === 200) {
    buildTableBody(response.data?.data);
    tablePaging.value = response.data?.pagination || {};
  } else {
    tableBody.value = [];
  }

  isLoading.value = false;
};

const toggleCreatePublishableKeyModal = () => {
  showCreatePublishableKeyModal.value = !showCreatePublishableKeyModal.value;
};

const toggleManageKeyModal = () => {
  showManageKeyModal.value = !showManageKeyModal.value;
};

onMounted(fetchAllPublishableKeys);
</script>

<style scoped></style>
