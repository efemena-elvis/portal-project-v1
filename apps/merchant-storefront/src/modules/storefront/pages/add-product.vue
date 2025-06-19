<template>
  <StorefrontEntryWrapper
    showActionRow
    :pageData="[pageHeaderData]"
    :isPrimaryActionDisabled="isActionReady"
    primaryActionText="Add Product"
    @onBackClick="router.push('/products')"
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
    <SelectFieldInput
      labelId="productCategory"
      labelTitle="Category"
      :labelCompact="false"
      inputPlaceholder="Select product category"
      :inputValue="productPayload.category"
      :selectData="[]"
      isRequired
      @onSelectionChange="productPayload.category = $event"
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
            alt="display-img"
            class="w-1/2 h-auto mx-auto"
          />
        </div>
      </div>
    </div>
  </StorefrontEntryWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
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

type IStorefrontType = {
  name: string;
  description: string;
  category: string;
  stock: number;
  amount: number;
};

const route = useRoute();
const router = useRouter();

const { uploadFile } = useGlobalStore();
const { processAPIRequest } = useEvents();

const pageHeaderData = ref({
  name: "Add a Product",
  route: "AddStoreProduct",
  title: "Add a New Product",
  description:
    "Add product details to make it available in your store catalog, including pricing, stock, and category.",
});

const uploadedProductImage = ref<string>("");

const getUploadedProductImageContent = computed(() => {
  return {
    name: uploadedProductImage.value ? "Store Logo" : "",
    link: uploadedProductImage.value,
  };
});

const productPayload = ref<IStorefrontType>({
  name: "",
  description: "",
  category: "",
  stock: 0,
  amount: 0,
});

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
    store_id: route.params.storeId,
  };
});
</script>

<style lang="scss" scoped></style>
