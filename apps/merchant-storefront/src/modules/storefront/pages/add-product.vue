<template>
  <StorefrontEntryWrapper
    showActionRow
    :pageData="[pageHeaderData]"
    :isPrimaryActionDisabled="isActionReady"
    primaryActionText="Add Product"
    @onBackClick="router.push('/products')"
    @onContinueClick="handleAddProduct"
  >
    <!-- PRODUCT NAME -->
    <TextFieldInput
      labelId="productName"
      labelTitle="Product name"
      :labelCompact="false"
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
      :labelCompact="false"
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
  
     <TextFieldInput
      labelId="productCategory"
      labelTitle="Category"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="productPayload.category"
      inputPlaceholder="Provide the product category"
      isRequired
      @inputChanged="productPayload.category = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Product category is required',
      }"
    />
    <!-- PRODUCT QUANTITY -->
    <TextFieldInput
      labelId="productQuantity"
      labelTitle="Stock quantity"
      :labelCompact="false"
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
      :labelCompact="false"
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
      <label for="productImage" class="form-label-basic">Product Image</label>

      <div class="product-image-upload">
        <FileUploadInput
          :showSkip="false"
          :hasDocumentUploaded="!!uploadedProductImage"
          :uploadedDocumentContent="getUploadedProductImageContent"
          :uploadAction="uploadFile"
          fileUploadText="Click here to upload your product image"
          @onDocumentUploaded="uploadedProductImage = $event"
        />

        <div
          class="transition duration-300 ease-in-out mx-auto mt-4 overflow-hidden rounded-md"
          v-if="uploadedProductImage"
        >
          <img
            :src="uploadedProductImage"
            alt="Product Image"
            class="w-1/2 h-auto mx-auto"
          />
        </div>
      </div>
    </div>
  </StorefrontEntryWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import {
  TextFieldInput,
  SelectFieldInput,
  FileUploadInput,
} from "@packages/uikit";
import StorefrontEntryWrapper from "@/modules/storefront/components/storefront-entry-wrapper.vue";
import { useGlobalStore } from "@/modules/global/store";
import { useStoreStore } from "../store";

type Store = { id: string; [key: string]: any };

const router = useRouter();
const route = useRoute();
const { uploadFile } = useGlobalStore();
const { processAPIRequest } = useEvents();

const { activeStore, addProduct } = useStoreStore() as { activeStore: Store | null; addProduct: any };

const uploadedProductImage = ref<string>("");

const pageHeaderData = ref({
  name: "Add a Product",
  route: "AddStoreProduct",
  title: "Add a New Product",
  description:
    "Add product details to make it available in your store catalog, including pricing, stock, and category.",
});

const productPayload = ref({
  name: "",
  description: "",
  category: "",
  stock: 0,
  amount: 0,
});

const getUploadedProductImageContent = computed(() => ({
  name: uploadedProductImage.value ? "Product Image" : "",
  link: uploadedProductImage.value,
}));

const isActionReady = computed(() => {
  const { name, description, category, stock, amount } = productPayload.value;
  return !(
    name &&
    description &&
    category &&
    stock > 0 &&
    amount > 0 &&
    uploadedProductImage.value
  );
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
    store_id: activeStore?.id ?? null,
  };
});

const handleAddProduct = async () => {
  if (!activeStore?.id) {
    alert("No active store selected.");
    return;
  }

  const response = await processAPIRequest({
    action: addProduct,
    payload: getProductPayload.value,
    btnText: "Add Product",
    alertHandler: {
      200: {
        message: "Product added successfully",
        description: "You can now view your product",
        type: "success",
      },
      400: {
        message: "Product addition failed",
        description: "Something went wrong",
        type: "error",
      },
    },
  });

  if (response?.code === 200) {
    setTimeout(() => {
      router.push("/products");
    }, 1200);
  }
};

</script>

<style scoped lang="scss"></style>
