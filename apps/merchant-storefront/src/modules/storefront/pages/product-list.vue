<template>
  <PageContentWrapper>
    <template v-slot:pageOptions>
      <router-link
        to="/products/create"
        class="btn btn-xs btn-primary hover:text-white !pl-4"
      >
        <div class="icon icon-add"></div>
        Add a Product
      </router-link>
    </template>

    <template v-slot:pageContent>
      <!-- CARD INFO ROW -->
      <div class="mt-4 mb-8">
        <MetricInfoCard
          :metric-items="[
            { titleText: 'Product Value',  valueText: `ZMW ${productsSummary?.total_product_value || 0}`},
            { titleText: 'Total Products',   valueText: productsSummary?.total_products || 0, },
            { titleText: 'Out of Stock',  valueText: productsSummary?.total_out_of_stock || 0, },
          ]"
        />
      </div>

      <div class="flex items-center justify-between mb-3 gap-x-4">
        <!-- STATUS FILTER CARD -->
        <StatusFilterCard
          :status-items="[
            { title: 'All Products', slug: 'all-products', active: false },
            { title: 'Out of Stock', slug: 'out-of-stock', active: false },
          ]"
        />

        <DateFilterCard />
      </div>

      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'Add a new product',
          description:
            'You haven\'t added any product on this store yet. Add a product to get started',
          actionText: 'Add a Product',
        }"
        @onActionClicked="
          () => router.push('/products/create?redirect=products')
        "
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

  <teleport to="body" v-if="showManageProductModal">
    <ManageProductModal @closeTriggered="toggleManageProductModal" />
  </teleport>

  <teleport to="body" v-if="showProductDeleteModal">
    <DeleteProductModal @closeTriggered="toggleProductDeleteModal" />
  </teleport>
</template>

<script setup lang="ts">
import { ref, h, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useStoreStore } from "../store";
import { useDate, useString, useEvents } from "@packages/hooks";

import DeleteProductModal from "@/modules/storefront/modals/delete-product-modal.vue";
import ManageProductModal from "@/modules/storefront/modals/manage-product-modal.vue";
import { getProductsSummary } from "../store/actions";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableActionBtn,
  TableDoubleColumn,
  MetricInfoCard,
  StatusFilterCard,
  DateFilterCard,
} from "@packages/uikit";

type Store = { id: string; [key: string]: any };
type ProductsSummary = { total_orders?: number; [key: string]: any };

const router = useRouter();

const { formatNumber, getStatus, getBoldTableText, notAvailable } = useString();

const { activeStore, getStoreProducts, getProductsSummary } =
  useStoreStore() as {
    activeStore: Store | null;
    getStoreProducts: any;
    getProductsSummary: any;
  };
const { processAPIRequest } = useEvents();

const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "#", slug: "counter" },
  { title: "Product Details", slug: "product" },
  { title: "Amount Per Unit", slug: "amount" },
  { title: "Stock", slug: "quantity" },
  { title: "Status", slug: "status" },
  { title: "Date Added", slug: "date_created" },
  { title: "Action", slug: "action" },
]);

const tableBody = reactive<any[]>([
  // {
  //   counter: "1",
  //   product: h(TableDoubleColumn, {
  //     entry: {
  //       primaryText: "White Sneakers",
  //       secondaryText: "Men Fashion",
  //       displayImage:
  //         "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/98/0189973/1.jpg?3194",
  //     },
  //   }),
  //   amount: getBoldTableText(`ZMW${formatNumber(420)}`),
  //   quantity: 24,
  //   status: `${getStatus(5 > 0 ? "success" : "danger", 5 > 0 ? "Available" : "Out of Stock")}`,
  //   date_created: "22nd July, 2024",
  //   action: h(TableActionBtn, {
  //     showPrimaryBtn: true,
  //     primaryBtnText: "Manage",
  //     showSecondaryBtn: true,
  //     showSecondaryText: true,
  //     onManageClick: () => {
  //       // handleEditProduct(data);
  //       toggleManageProductModal();
  //     },
  //     onDeleteClick: () => {
  //       // handleDeleteProduct(data);
  //       toggleProductDeleteModal();
  //     },
  //   }),
  // },
]);
const tablePaging = ref<any>({});

const showManageProductModal = ref<boolean>(false);
const showProductDeleteModal = ref<boolean>(false);
const productsSummary = ref<ProductsSummary>({});

const toggleManageProductModal = () => {
  showManageProductModal.value = !showManageProductModal.value;
};

const toggleProductDeleteModal = () => {
  showProductDeleteModal.value = !showProductDeleteModal.value;
};

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchProducts = async () => {
  const response = await processAPIRequest({
    action: getStoreProducts(activeStore?.slug || ""),
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        date_created: getDateAdded(data.created_at),
        full_name: `${data.firstname} ${data.lastname}`,
        customer_email: data.email,
        phone_number: data.phone_number
          ? "+" + data.phone_number
          : notAvailable("No phone number"),
        status: getStatus(
          data.blacklisted ? "danger" : "success",
          data.blacklisted ? "Blacklisted" : "Active"
        ),
      });
    });

    tablePaging.value = response.pagination[0];
  }
};
const fetchProductsSummary = async () => {
  const response = await processAPIRequest({
    action: getProductsSummary(activeStore?.id || ""),
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  productsSummary.value = response?.data;
};

const handleEditProduct = (data: any) => {
  // Logic to edit product
  console.log("Edit Product:", data);
};

const handleDeleteProduct = (data: any) => {
  // Logic to delete product
  console.log("Delete Product:", data);
};

onMounted(() => {
  fetchProducts();
  fetchProductsSummary();
});
</script>
