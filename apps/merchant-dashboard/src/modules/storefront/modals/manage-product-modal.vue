<template>
  <ModalDialog :place_side="true" @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">
          {{ isProductEdit ? "Edit" : "Add" }} Product
        </div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-3">
        <!-- PRODUCT NAME -->
        <TextFieldInput
          labelId="productName"
          labelTitle="Product name"
          :inputType="IInputType.Text"
          :inputValue="productPayload.name"
          inputPlaceholder="Provide the product name"
          isRequired
          @inputChanged="productPayload.name = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Product name is required',
          }"
        />

        <!-- PRODUCT DESCRIPTION -->
        <TextFieldInput
          labelId="productDescription"
          labelTitle="Description"
          :inputType="IInputType.Text"
          :inputValue="productPayload.description"
          :isTextArea="true"
          inputPlaceholder="Provide the product description"
          isRequired
          @inputChanged="productPayload.description = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Product description is required',
          }"
        />

        <!-- PRODUCT CATEGORY -->
        <SelectFieldInput
          labelId="productCategory"
          labelTitle="Category"
          inputPlaceholder="Select product category"
          :inputValue="productPayload.category"
          :selectData="getProductCategories"
          isRequired
          @onSelectionChange="productPayload.category = $event"
        />

        <!-- PRODUCT QUANTITY -->
        <TextFieldInput
          labelId="productQuantity"
          labelTitle="Stock quantity"
          :inputType="IInputType.Number"
          :inputValue="productPayload.stock"
          inputPlaceholder="Provide the product quantity"
          isRequired
          @inputChanged="productPayload.stock = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Product quantity is required',
          }"
        />

        <!-- PRODUCT AMOUNT -->
        <TextFieldInput
          labelId="productAmount"
          labelTitle="Amount per unit"
          :inputType="IInputType.Number"
          :inputValue="productPayload.amount"
          inputPlaceholder="Provide the product amount"
          isRequired
          @inputChanged="productPayload.amount = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Product amount is required',
          }"
        />

        <!-- PRODUCT IMAGE -->
        <div class="product-image relative">
          <label for="productImage" class="form-label bg-white px-0.5"
            >Product Image</label
          >

          <div class="product-image-upload">
            <FileUploadInput
            :uploadAction="uploadFile"
              :showSkip="false"
              :hasDocumentUploaded="!!uploadedProductImage"
              :uploadedDocumentContent="getUploadedProductImageContent"
              fileUploadText="Click here to upload your product image"
              @onDocumentUploaded="uploadedProductImage = $event"
            />

            <div
              class="transition duration-300 ease-in-out mx-auto mt-4 overflow-hidden rounded-md"
              v-if="uploadedProductImage"
            >
              <img
                :src="uploadedProductImage"
                alt="display-img"
                class="w-1/2 h-auto mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer -mt-4">
        <button
          class="btn btn-primary w-full"
          ref="manageProductBtnRef"
          :disabled="isActionReady"
          @click="handleManageProduct"
        >
          {{ isProductEdit ? "Update" : "Add" }} Product
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed, PropType } from "vue";
import { useRoute } from "vue-router";
import { IInputType } from "@packages/models";
import {FileUploadInput, SelectFieldInput, TextFieldInput, ModalDialog } from "@packages/uikit";
import {useEvents} from "@packages/hooks";
import { useStorefrontStore } from "@/modules/storefront/store";
import { useGlobalStore } from "@/modules/global/store";

type IStorefrontType = {
  name: string;
  description: string;
  category: string;
  stock: number;
  amount: number;
};

const emits = defineEmits(["closeTriggered", "reloadStoreProducts"]);

const props = defineProps({
  productData: {
    type: Object,
    default: () => ({
      id: "",
      name: "",
      description: "",
      category: "",
      stock: 0,
      amount: 0,
      image: "",
      store_id: "",
    }),
  },

  productCategories: {
    type: Array as PropType<{ id: number; name: string; slug: string }[]>,
    default: () => [],
  },
});

const route = useRoute();
const {uploadFile} = useGlobalStore();
const { processAPIRequest } = useEvents();
const { createStoreProduct, updateStoreProduct } = useStorefrontStore();

const isProductEdit = computed(() => {
  return props.productData.id ? true : false;
});

const getProductCategories = computed(() => {
  return props.productCategories.map((niche) => {
    return { value: niche.name, name: niche.name };
  });
});

const uploadedProductImage = ref<string>(props.productData.image ?? "");

const getUploadedProductImageContent = computed(() => {
  return {
    name: uploadedProductImage.value ? "Store Logo" : "",
    link: uploadedProductImage.value,
  };
});

const productPayload = ref<IStorefrontType>({
  name: props.productData.name || "",
  description: props.productData.description || "",
  category: props.productData.category || "",
  stock: props.productData.stock || 0,
  amount: props.productData.amount || 0,
});

const manageProductBtnRef = ref(null);

const isActionReady = computed(() => {
  return productPayload.value.name.length &&
    productPayload.value.description.length &&
    productPayload.value.category.length &&
    productPayload.value.stock &&
    productPayload.value.amount &&
    uploadedProductImage.value
    ? false
    : true;
});

const getProductPayload = computed(() => {
  const { name, description, category, stock, amount } = productPayload.value;

  return {
    name,
    description,
    category,
    stock,
    amount,
    image: uploadedProductImage.value,
    [isProductEdit.value ? "id" : "store_id"]: isProductEdit.value
      ? props.productData.id
      : route.params.storeId,
  };
});

const handleManageProduct = async () => {
  const response = await processAPIRequest({
    action: isProductEdit.value ? updateStoreProduct : createStoreProduct,
    payload: getProductPayload.value,
    btnRef: manageProductBtnRef,
    btnText: isProductEdit.value ? "Update Product" : "Add Product",
    alertHandler: {
      200: {
        message: "Successful",
        description: `Product details have been ${isProductEdit.value ? "updated" : "added"} successfully`,
        type: "success",
      },

      400: {
        message: `Product ${isProductEdit.value ? "update" : "addition"} failed`,
        description: "Please provide a valid product details",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    emits("reloadStoreProducts");
    emits("closeTriggered");
  }
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @apply h-4/5 py-7;
}

.modal-cover-footer {
  @apply absolute bottom-0 left-0 right-0 py-6 sm:py-4 bg-white;

  .btn {
    @apply rounded-lg py-3 w-full bg-green-600 text-neutral-10 text-[14.5px] sm:text-sm hover:bg-green-700;
  }
}
</style>
