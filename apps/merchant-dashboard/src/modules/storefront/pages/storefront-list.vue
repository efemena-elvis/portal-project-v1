<template>
  <PageContentWrapper
    pageDescription="Merchant Storefront"
    :showCustomActionBtn="true"
    customActionBtnText="Create a storefront"
    @customActionBtnClicked="toggleCreateStorefrontModal"
  >
    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No storefront yet',
          description:
            'You haven\'t created any storefront yet. This is where you\'ll be able to see all your created storefronts.',
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
  <teleport to="body" v-if="showCreateStorefrontModal">
    <CreateStoreFrontModal
      @closeTriggered="toggleCreateStorefrontModal"
      @reloadStorefront="fetchAllStorefront"
    />
  </teleport>
  <teleport to="body" v-if="showDeleteStorefrontModal">
    <DeleteStoreFrontModal
      :storefrontData="deleteStorefrontData"
      @closeTriggered="toggleDeleteStorefrontModal"
      @reloadStorefront="fetchAllStorefront"
    />
  </teleport>
</template>

<script setup lang="ts">
import {
  PageContentWrapper,
  TableContainer,
  TableContainerBody,
  TableActionBtn,
} from "@packages/uikit";
import { TableHeaderType } from "@packages/models";
import { ref, onMounted, h, computed } from "vue";
import CreateStoreFrontModal from "../modals/create-storefront-modal.vue";
import DeleteStoreFrontModal from "../modals/delete-storefront-modal.vue";
import { useString } from "@packages/hooks";
import { useEvents } from "@packages/hooks";
import { useRouter } from "vue-router";
import { useStorefrontStore } from "@/modules/storefront/store";
import { useAppVariant } from "@packages/hooks";

const { getBoldTableText, getStatus, createPreviewLink, formatNumber } =
  useString();

const { processAPIRequest } = useEvents();
const { fetchStorefront } = useStorefrontStore();
const router = useRouter();

const tableBody = ref<any[]>([]);
const isLoading = ref<boolean>(true);
const deleteStorefrontData = ref<any>({});
const appVariant = ref<string>(useAppVariant());

const tableHeader = ref<TableHeaderType[]>([
  { title: "S/N", slug: "counter" },
  { title: "Name", slug: "name" },
  { title: "Orders", slug: "orders" },
  { title: "Revenue", slug: "revenue" },
  { title: "Link", slug: "link" },
  { title: "Status", slug: "status" },
  { title: "", slug: "action" },
]);

const showCreateStorefrontModal = ref(false);
const showDeleteStorefrontModal = ref(false);

const toggleCreateStorefrontModal = () => {
  showCreateStorefrontModal.value = !showCreateStorefrontModal.value;
};

const toggleDeleteStorefrontModal = () => {
  showDeleteStorefrontModal.value = !showDeleteStorefrontModal.value;
};

const currency = computed(() => {
  return appVariant.value === "alexpay" ? "GHS" : "ZMW";
});

const fetchAllStorefront = async () => {
  isLoading.value = true;
  const response = await processAPIRequest({
    action: fetchStorefront,
    payload: {},
    showAlert: false,
  });

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any, index: number) => {
      const domain = appVariant.value === "alexpay" ? `store.alexpay.com/${data.slug}` : `store.${appVariant.value}.com/${data.slug}`;

      return {
        counter: index + 1,
        name: getBoldTableText(data.name),
        orders: data?.total_orders ?? 0,
        revenue: getBoldTableText(
          `${currency.value}${formatNumber(data?.total_amount ?? 0)}`,
        ),
        link: createPreviewLink(`https://${domain}`, "Preview storefront"),
        status: `${getStatus("success", "Active")}`,
        action: h(TableActionBtn, {
          showPrimaryBtn: true,
          showSecondaryBtn: true,
          primaryBtnText: "Manage Store",
          onManageClick: () => {
            router.push(
              `storefront/overview/${data.id}?storeSlug=${data.slug}`,
            );
          },

          onDeleteClick: () => handleDeleteStorefront(data),
        }),
      };
    });
    isLoading.value = false;
  }
};

const handleDeleteStorefront = (storefrontData: any) => {
  deleteStorefrontData.value = storefrontData;
  toggleDeleteStorefrontModal();
};

onMounted(() => fetchAllStorefront());
</script>

<style scoped></style>
