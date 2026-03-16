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
    <template #pageOptions v-if="!isLoading">
      <div class="flex gap-4 absolute left-0 top-12 sm:w-full sm:mt-8">
        <div
          class="relative w-48 text-sm font-semibold text-teal-800 border rounded-md cursor-pointer sm:w-1/2 bg-grey-50/80 "
        >
          <select
            v-model="selectedStatus"
            class="w-full p-4 bg-transparent appearance-none focus:outline-none"
          >
            <option value="">Status</option>
            <option
              v-for="(status, index) in statusOptions"
              :value="status.value.toLowerCase()"
              :key="index"
            >
              {{ status.key }}
            </option>
          </select>
          <div
            class="absolute text-[16px] text-teal-800 -translate-y-1/2 pointer-events-none icon icon-caret-down right-4 top-1/2"
          ></div>
        </div>
        <DatePicker
          filterSize="lg"
          :activePeriod="activePeriod"
          @onFilterSelected="processFilterSelection"
        />
      </div>
    </template>
    <template #pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :hasCustomBtn="true"
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
import CreatePaymentLinkModal from "../modals/create-payment-link-modal.vue";
import CopyLinkCell from "../components/copy-link-cell.vue";
import DeletePaymentLinkModal from "../modals/delete-payment-link-modal.vue";
import { useString, useAppVariant, useEvents, useDate } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
import PreviewPaymentLinkModal from "../modals/preview-payment-link-modal.vue";
import { DatePicker } from "@packages/uikit";
import ManageLinkModal from "../modals/manage-link-modal.vue";

const { getStatus } = useString();
const { processAPIRequest } = useEvents();
const paymentStore = usePaymentStore();
const { fetchPaymentLinks } = usePaymentStore();

const tableBody = ref<any[]>([]);
const isLoading = ref(true);
const page = ref(1);
const tablePaging = ref<any>({});
const deletePaymentLinkData = ref<any>({});
const paymentLinkDetails = ref<any>({});
const appVariant = ref(useAppVariant());
const selectedStatus = ref("");
const activePeriod = ref<[Date, Date] | null>(null);

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

const statusOptions = [
  { key: "Active", value: "active" },
  { key: "Inactive", value: "inactive" },
];

const filters = computed(
  () =>
    `?page=${page.value}&status=${selectedStatus.value}&from=${activePeriod.value ? activePeriod.value[0].toISOString().split("T")[0] : ""}&to=${activePeriod.value ? activePeriod.value[1].toISOString().split("T")[0] : ""}`,
);

const processFilterSelection = (
  selectedRange: [Date | string, Date | string],
) => {
  if (selectedRange && selectedRange.length === 2) {
    const normalizedRange: [Date, Date] = [
      new Date(selectedRange[0]),
      new Date(selectedRange[1]),
    ];
    activePeriod.value = normalizedRange;
  } else {
    activePeriod.value = null;
  }
};

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

const fetchAllPaymentLinks = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page.value;

  const response = await processAPIRequest({
    action: fetchPaymentLinks,
    payload: { filters, page: page.value },
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

watch(activePeriod, () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchAllPaymentLinks(newFilters);
});

onMounted(fetchAllPaymentLinks);
</script>

<style scoped></style>
