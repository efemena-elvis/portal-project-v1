<template>
  <PageContentWrapper
    pageDescription="Payment Links"
    :showCustomActionBtn="true"
    customActionBtnText="Create payment link"
    @customActionBtnClicked="toggleCreatePaymentLinkModal"
    :pageKeys="{ green: 'Active', red: 'Inactive' }"
     @updatePage="(currentPage) => (page = currentPage)"
    :pagingData="tablePaging"
  >
    <template #pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No payment link yet',
          description:
            'You haven\'t created any payment link yet. This is where you\'ll be able to see all your created payment links.',
        }"
      >
        <TableContainerBody
          v-for="(payload, index) in tableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>

  <!-- Modals -->
  <teleport to="body" v-if="showCreatePaymentLinkModal">
    <CreatePaymentLinkModal
      @closeTriggered="toggleCreatePaymentLinkModal"
      @reloadPaymentLinks="fetchAllPaymentLinks"
      :showPreviewPaymentLinkModal="paymentStore.showPreviewModal"
      @togglePreview="togglePreviewPaymentLinkModal"
    />
  </teleport>

  <teleport to="body" v-if="paymentStore.showPreviewModal">
    <PreviewPaymentLinkModal
      @closeTriggered="togglePreviewPaymentLinkModal"
      @reloadPaymentLinks="fetchAllPaymentLinks"
    />
  </teleport>

  <teleport to="body" v-if="showManageLinksModal">
    <ManageLinkModal
      :paymentLinkDetails="paymentLinkDetails"
      @closeTriggered="toggleManageLinksModal"
      @reloadPaymentLinks="fetchAllPaymentLinks"
    />
  </teleport>

  <teleport to="body" v-if="showDeletePaymentLinkModal">
    <DeletePaymentLinkModal
      :paymentLinkData="deletePaymentLinkData"
      @closeTriggered="toggleDeletePaymentLinkModal"
      @reloadPaymentLinks="fetchAllPaymentLinks"
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
import { ref, onMounted, h, computed, watch } from "vue";
import { useRouter } from "vue-router";
import CreatePaymentLinkModal from "../modals/create-payment-link-modal.vue";
import CopyLinkCell from "../components/copy-link-cell.vue";
import DeletePaymentLinkModal from "../modals/delete-payment-link-modal.vue";
import { useString, useAppVariant, useEvents, useDate } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
import PreviewPaymentLinkModal from "../modals/preview-payment-link-modal.vue";
import ManageLinkModal from "../modals/manage-link-modal.vue";

const { getStatus } = useString();
const { processAPIRequest } = useEvents();
const paymentStore = usePaymentStore();
const { fetchPaymentLinks } = usePaymentStore();
const router = useRouter();

const tableBody = ref<any[]>([]);
const isLoading = ref(true);
const page = ref(1);
const tablePaging = ref<any>({});
const deletePaymentLinkData = ref<any>({});
const paymentLinkDetails = ref<any>({});
const appVariant = ref(useAppVariant());

const tableHeader = ref<TableHeaderType[]>([
  { title: "S/N", slug: "counter" },
  { title: "Date Created", slug: "date_created" },
  { title: "Link", slug: "link" },
  { title: "Status", slug: "status" },
  { title: "", slug: "action" },
]);

const showCreatePaymentLinkModal = ref(false);
const showDeletePaymentLinkModal = ref(false);
const showManageLinksModal = ref(false);

const toggleCreatePaymentLinkModal = () => {
  showCreatePaymentLinkModal.value = !showCreatePaymentLinkModal.value;
};

const togglePreviewPaymentLinkModal = () => {
  paymentStore.closePaymentLinkPreview();
};

const toggleManageLinksModal = () => {
  showManageLinksModal.value = !showManageLinksModal.value;
};

const toggleDeletePaymentLinkModal = () => {
  showDeletePaymentLinkModal.value = !showDeletePaymentLinkModal.value;
};

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const getDomain = computed(() =>
  appVariant.value === "alexpay"
    ? "https://merchants.alexpay.com"
    : "https://merchant.redstonepgs.com",
);

const fetchAllPaymentLinks = async () => {
  isLoading.value = true;
  tablePaging.value.current_page = page.value;

  const response = await processAPIRequest({
    action: fetchPaymentLinks,
    payload: { page: page.value },
    showAlert: false,
  });

  if (response.code === 200) {
    tableBody.value = response.data.links.map((data: any, index: number) => ({
      counter: index + 1,
      date_created: h(TableDoubleColumn, {
        entry: {
          primaryText: getDateCreated(data.created_at),
          secondaryText: useDate.formatTime(data.created_at),
        },
      }),
      link: h(CopyLinkCell, {
        link: `${getDomain.value}/payment-links/${data.reference}`,
      }),
      status: getStatus(
        data.status === "active" ? "success" : "failed",
        data.status === "active" ? "Active" : "Inactive",
      ),
      action: h(TableActionBtn, {
        showPrimaryBtn: true,
        showSecondaryBtn: true,
        primaryBtnText: "Manage Link",
        onManageClick: () => handleManagePaymentLink(data),
        onDeleteClick: () => handleDeletePaymentLink(data),
      }),
    }));
    isLoading.value = false;
    tablePaging.value = response.data.pagination || {};
  }
};

const handleDeletePaymentLink = (data: any) => {
  deletePaymentLinkData.value = data;
  toggleDeletePaymentLinkModal();
};

const handleManagePaymentLink = (data: any) => {
  paymentLinkDetails.value = data;
  toggleManageLinksModal();
};

watch(page, () => {
  fetchAllPaymentLinks();
});

onMounted(() => fetchAllPaymentLinks());
</script>

<style scoped></style>
