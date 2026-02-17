<template>
  <PageContentWrapper
    :pagingData="tablePaging"
    pageDescription="All Products"
    :pageKeys="{ green: 'Active', red: 'Out of Stock' }"
    @updatePage="(currentPage) => (page = currentPage)"
  >
    <template #pageContent>
      <div class="pb-10 strorefront-product-page">
        <!-- TOP AREA -->
        <div class="top-area">
          <div class="top-area--left">
            <div class="form-input-block">
              <div class="icon icon-search-normal"></div>
              <input
                type="search"
                class="form-control form-input"
                placeholder="Search products..."
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="top-area--right button-actions">
            <button
              class="btn btn-sm btn-primary"
              @click="triggerManageProduct"
            >
              Add a Product
            </button>
          </div>
        </div>

        <TableContainer
          :tableHeader="tableHeader"
          :tableBody="filteredTableBody"
          :isLoading="isLoading"
          :emptyData="{
            title: 'No product yet!',
            description:
              'You haven\'t created any product on this storefront yet. This is where you\'ll be able to manage all created products',
          }"
        >
          <TableContainerBody
            v-for="(payload, index) in filteredTableBody"
            :key="index"
            :tableHeader="tableHeader"
            :tableData="payload"
            :pagingData="tablePaging"
          />
        </TableContainer>
      </div>
    </template>
  </PageContentWrapper>

  <teleport to="body" v-if="showManageProductModal">
    <ManageProductModal
      :productData="productDataItem"
      :productCategories="productCategories"
      @closeTriggered="toggleManageProductModal"
      @reloadStoreProducts="fetchAllStoreProducts"
    />
  </teleport>

  <teleport to="body" v-if="showDeleteProductModal">
    <DeleteProductModal
      :productData="productDataItem"
      @closeTriggered="toggleDeleteProductModal"
      @reloadStoreProducts="fetchAllStoreProducts"
    />
  </teleport>
</template>

<script lang="ts" setup>
import { h, ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useString, useEvents, useDate, useAppVariant } from "@packages/hooks";
import { TableHeaderType } from "@packages/models";
import { useStorefrontStore } from "@/modules/storefront/store";
import {
  TableContainer,
  TableContainerBody,
  TableActionBtn,
  TableDoubleColumn,
  PageContentWrapper,
} from "@packages/uikit";
import ManageProductModal from "@/modules/storefront/modals/manage-product-modal.vue";
import DeleteProductModal from "@/modules/storefront/modals/delete-product-modal.vue";
import { storefrontNiches } from "@packages/constants";

const { getBoldTableText, getStatus, formatNumber } = useString();
const { processAPIRequest, pushToastAlert } = useEvents();
const route = useRoute();

const { getStoreProducts, fetchStoreById } = useStorefrontStore();

const appVariant = ref<string>(useAppVariant());
const isLoading = ref<boolean>(true);

const searchQuery = ref<string>("");

const tableHeader = ref<TableHeaderType[]>([
  { title: "S/N", slug: "counter" },
  { title: "Product Details", slug: "product" },
  { title: "Amount Per Unit", slug: "amount" },
  { title: "Stock", slug: "quantity" },
  { title: "Status", slug: "status" },
  { title: "Date Added", slug: "date_created" },
  { title: "", slug: "action" },
]);

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});
const page = ref(1);

const currency = computed(() => {
  return appVariant.value === "alexpay" ? "GHS" : "ZMW";
});

const productDataItem = ref<any>({});
const productCategories = ref<any>([]);
const storeDetails = ref<any>({});

const showManageProductModal = ref(false);
const showDeleteProductModal = ref(false);

const toggleManageProductModal = () => {
  productDataItem.value = {};
  showManageProductModal.value = !showManageProductModal.value;
};

const toggleDeleteProductModal = () => {
  showDeleteProductModal.value = !showDeleteProductModal.value;
};

const triggerManageProduct = () => {
  const {
    description,
    logo,
    email,
    phone_number,
    address,
    facebook,
    instagram,
    twitter,
    tikTok,
  } = storeDetails.value;

  if (!description && !logo && !email && !phone_number && !address) {
    pushToastAlert({
      message: "Complete your store profile!",
      type: "warning",
    });
    return;
  }

  const hasLength = (val: any) => val && val.length > 0;
  const socialCount = [facebook, instagram, twitter, tikTok].filter(
    hasLength,
  ).length;

  if (socialCount < 2) {
    pushToastAlert({
      message: "Provide at least 2 socials to complete your store profile!",
      type: "warning",
    });
    return;
  }

  toggleManageProductModal();
};

const getDateAdded = (date: string) => {
  const { m4, d3, y1 } = useDate.formatDate(date).getAll();
  return `${d3} ${m4}, ${y1}`;
};

const filteredTableBody = computed(() => {
  const query = searchQuery.value.toLowerCase();

  const list = !query
    ? tableBody
    : tableBody.filter((item: any) => {
        const name =
          item?.product?.props?.entry?.primaryText?.toLowerCase() || "";
        const category =
          item?.product?.props?.entry?.secondaryText?.toLowerCase() || "";

        return name.includes(query) || category.includes(query);
      });

  return list.map((item: any, index: number) => ({
    ...item,
    counter: `${index + 1}`,
  }));
});

const fetchAllStoreProducts = async () => {
  isLoading.value = true;
  tablePaging.value.current_page = page;

  const response = await processAPIRequest({
    action: getStoreProducts,
    payload: { storefrontSlug: route.query.storeSlug, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.length = 0;

    tableBody.push(
      ...response.data?.map((data: any, index: number) => ({
        counter: `${index + 1}`,
        product: h(TableDoubleColumn, {
          entry: {
            primaryText: data.name,
            secondaryText: data.category,
            displayImage: data.image,
          },
        }),
        amount: getBoldTableText(
          `${currency.value}${formatNumber(data.amount)}`,
        ),
        quantity: data.stock,
        status: `${getStatus(
          data.stock > 0 ? "success" : "failed",
          data.stock > 0 ? "Available" : "Out of Stock",
        )}`,
        date_created: getDateAdded(data.created_at),
        action: h(TableActionBtn, {
          showPrimaryBtn: true,
          primaryBtnText: "Edit",
          showSecondaryBtn: true,
          showSecondaryText: true,
          onManageClick: () => handleEditProduct(data),
          onDeleteClick: () => handleDeleteProduct(data),
        }),
      })),
    );
  }
  tablePaging.value = response.pagination[0];
};

const handleDeleteProduct = (productData: any) => {
  productDataItem.value = productData;
  toggleDeleteProductModal();
};

const handleEditProduct = (productData: any) => {
  productDataItem.value = productData;
  showManageProductModal.value = true;
};

const fetchStorefrontById = async () => {
  const response = await processAPIRequest({
    action: fetchStoreById,
    payload: { storeId: route.params.storeId },
    showAlert: false,
  });

  if (response.code === 200) {
    storeDetails.value = response.data;

    const niche = storefrontNiches.find(
      (niche) => niche.slug === response.data.tag,
    );
    productCategories.value = niche?.categories || [];
  }
};

watch(page, () => {
  fetchAllStoreProducts();
  fetchStorefrontById();
});

onMounted(() => {
  fetchAllStoreProducts();
  fetchStorefrontById();
});
</script>

<style lang="scss" scoped>
.strorefront-product-page {
  .top-area {
    @apply flex sm:flex-wrap justify-between items-center gap-3 mb-11;

    &--left {
      @apply flex flex-col justify-center items-start gap-y-0.5 w-1/2 sm:w-full;
    }

    &--right {
      @apply flex justify-end items-center gap-x-3;
    }
  }

  .form-input-block {
    @apply relative w-full;

    .form-input {
      @apply w-full text-grey-600 text-[13.5px] placeholder:text-[13.5px] py-[12.5px] pl-10 pr-4 border-grey-300 hover:border-green-400/80 focus:border-green-400;
    }

    .icon {
      @apply z-10 text-[15px] absolute top-1/2 left-4 transform -translate-y-1/2 text-grey-600;
    }
  }

  .button-actions {
    @apply w-full;

    .btn {
      @apply w-max h-[46px] py-3 px-7 text-grey-800/80 border text-[13px];
    }

    .btn-primary {
      @apply text-neutral-10;
    }
  }
}
</style>
