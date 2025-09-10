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
            {
              titleText: 'Product Value',
              valueText: `ZMW ${productsSummary?.total_product_value}`,
            },
            {
              titleText: 'Total Products',
              valueText: productsSummary?.total_products,
            },
            {
              titleText: 'Out of Stock',
              valueText: productsSummary?.total_out_of_stock,
            },
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
    <ManageProductModal
      @closeTriggered="toggleManageProductModal"
      :productData="currentProductData"
      @reloadStoreProducts="fetchProducts"
    />
  </teleport>

  <teleport to="body" v-if="showProductDeleteModal">
    <DeleteProductModal
      @closeTriggered="toggleProductDeleteModal"
      :handleProductDelete="() => handleProductDelete(currentProductData)"
      @reloadStoreProducts="fetchProducts"
      :productData="currentProductData"
    />
  </teleport>
</template>

<script setup lang="ts">
import { ref, h, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useStoreStore } from "../store";
import { useDate, useString, useEvents, useStorage } from "@packages/hooks";
import DeleteProductModal from "@/modules/storefront/modals/delete-product-modal.vue";
import ManageProductModal from "@/modules/storefront/modals/manage-product-modal.vue";

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
import { Console, table } from "console";
import { watch } from "vue";

type Store = { id: string; [key: string]: any };
type ProductsSummary = { total_orders?: number; [key: string]: any };

const router = useRouter();
const route = useRoute();

const { formatNumber, getStatus, getBoldTableText, notAvailable } = useString();

const { getStoreProducts, getProductsSummary, deleteProduct } =
  useStoreStore() as {
  
    getStoreProducts: any;
    getProductsSummary: any;
    deleteProduct: any;
  };
const { processAPIRequest } = useEvents();
const {getStorage} = useStorage();

const activeStore = ref<any>(getStorage({
  storage_name: "activeStore",
  storage_type: "object",
}));

const isLoading = ref(false);
const currentProductData = ref<any>(null);

const tableHeader = ref<TableHeaderType[]>([
  { title: "#", slug: "counter" },
  { title: "Product Details", slug: "product" },
  { title: "Amount Per Unit", slug: "amount" },
  { title: "Stock", slug: "quantity" },
  { title: "Status", slug: "status" },
  { title: "Date Added", slug: "date_created" },
  { title: "Action", slug: "action" },
]);

const tableBody = ref<any[]>([]);
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
    isLoading.value = true;
  const response = await processAPIRequest({
    action: getStoreProducts,
    payload: { slug: activeStore.value?.slug || "" },
    showAlert: false,
  });

if (response.code === 200) {
  let filteredData = response.data;

  if (route.query.filter === "out-of-stock") {
    filteredData = filteredData.filter((item: any) => item.stock <= 0);
  }

  tableBody.value = filteredData.map((data: any, index: number) => ({
    counter: index + 1,
    amount: getBoldTableText(`ZMW ${formatNumber(data.amount)}`),
    quantity: data.stock || 1,
    product: h(TableDoubleColumn, {
      entry: {
        primaryText: data.name,
        secondaryText: data.description,
        displayImage: data.image || "https://via.placeholder.com/150",
      },
    }),
    date_created: getDateAdded(data.created_at),
    status: getStatus(
      data.stock > 0 ? "in stock" : "out of stock",
      data.stock > 0 ? "In Stock" : "Out of Stock"
    ),
    action: h(TableActionBtn, {
      showPrimaryBtn: true,
      primaryBtnText: "Manage",
      showSecondaryBtn: true,
      showSecondaryText: true,
      onManageClick: () => {
        currentProductData.value = data;
        toggleManageProductModal();
      },
      onDeleteClick: () => {
        currentProductData.value = data;
        toggleProductDeleteModal();
      },
    }),
  }));
 isLoading.value = false;
  tablePaging.value = response?.pagination?.[0];
}

};
const fetchProductsSummary = async () => {
  const response = await processAPIRequest({
    action: getProductsSummary,
    payload: { store_id: activeStore.value?.id || "" },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    productsSummary.value = response?.data;
  }
};

const handleProductDelete = async (data: any) => {
  const response = await processAPIRequest({
    action: deleteProduct,
    payload: { id: data?.id },
    btnText: "Create Store",

    alertHandler: {
      200: {
        message: "Product deleted successfully",
        description: "You have successfully deleted this product",
        type: "success",
      },
      400: {
        message: "Product deletion failed",
        description: "Something went wrong",
        type: "error",
      },
    },
  });
  if (response.code === 200) {
    setTimeout(() => {
      location.replace("/overview");
    }, 1200);
  }
};

watch(
  () => activeStore.value?.id,
  (id) => {
    if (id) {
      fetchProducts();
      fetchProductsSummary();
    }
  },
  { immediate: true }
);

watch(
  () => route.query.filter,
  () => {
   
      fetchProducts();
      fetchProductsSummary();
    },
  
  { immediate: true }
);


</script>
