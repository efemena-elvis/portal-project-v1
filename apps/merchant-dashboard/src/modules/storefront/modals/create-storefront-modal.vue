<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Create Storefront</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="mt-3 modal-cover-body">
        <!-- STOREFRONT NAME -->
        <TextFieldInput
          labelId="storefrontName"
          labelTitle="Storefront name"
          :inputType="IInputType.Text"
          inputPlaceholder="Provide the storefront name"
          isRequired
          @inputChanged="storefrontPayload.name = $event"
          @inputValidated="storeNameValidity = $event"
          :errorHandler="{
            validator: 'validateAlphanumeric',
            message: 'Store name should only contain letters or numbers',
          }"
        />

        <!-- STOREFRONT CURRENCY -->
        <SelectFieldInput
          labelId="storefrontCurrency"
          labelTitle="Currency"
          inputPlaceholder="Select storefront currency"
          :inputValue="storefrontPayload.currency"
          :selectData="validCurrencies"
          isRequired
          @onSelectionChange="storefrontPayload.currency = $event"
        />

        <!-- STOREFRONT NICHES -->
        <SelectFieldInput
          labelId="storefrontCategory"
          labelTitle="Product category"
          inputPlaceholder="Select storefront category"
          :inputValue="storefrontPayload.tag"
          :selectData="storefrontNicheOptions"
          isRequired
          @onSelectionChange="storefrontPayload.tag = $event"
        />

        <!-- STOREFRONT DOMAIN BLOCK -->
        <div class="storefront-display-block">
          <div class="top-row">
            <div class="icon icon-shop"></div>
            <div class="ptimary-text">Storefront Domain URL</div>
          </div>

          <div class="bottom-row">
            <div class="base-domain-url">{{`https://store.${appVariant}.com/`}}</div>

            <div class="secondary-domain-url">
              {{ storefrontPayload.name.toLocaleLowerCase() }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="-mt-4 modal-cover-footer">
        <button
          class="w-full btn btn-primary"
          ref="createStorefrontBtnRef"
          :disabled="isActionReady"
          @click="handleCreateStorefront"
        >
          Create Storefront
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { IInputType } from "@packages/models";
import { ModalDialog, SelectFieldInput, TextFieldInput } from "@packages/uikit";
import { storefrontNiches } from "@packages/constants";
import { useEvents, useString, useProfile, useAppVariant } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { useStorefrontStore } from "@/modules/storefront/store";

type IStorefrontType = {
  name: string;
  currency: string;
  tag: string;
  business_id: string | undefined;
};

const emits = defineEmits(["closeTriggered", "reloadStorefront"]);

const authStore = useAuthStore();
const appVariant = ref<string>(useAppVariant());
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const { capitalizeFirstLetter } = useString();
const { processAPIRequest, pushToastAlert } = useEvents();
const { createStorefront } = useStorefrontStore();

const validCurrencies = computed(() => {
  return appVariant.value === "alexpay"
    ? [{ value: "GHS", name: "Ghanaian Cedi" }]
    : [{ value: "ZMW", name: "Zambian Kwacha" }];
});

const storefrontNicheOptions = computed(() => {
  return storefrontNiches.map((niche: any) => {
    return { value: niche.slug, name: niche.nicheTitle };
  });
});

const storefrontPayload = ref<IStorefrontType>({
  name: "",
  currency: appVariant.value === "alexpay" ? "GHS" : "ZMW",
  tag: "",
  business_id: getBusinessProfile.value?.businessId,
});

const storeNameValidity = ref<boolean>(false);

const createStorefrontBtnRef = ref(null);

const isActionReady = computed(() => {
  return storefrontPayload.value.name &&
    storeNameValidity.value &&
    storefrontPayload.value.tag
    ? false
    : true;
});

const handleCreateStorefront = async () => {
  const response = await processAPIRequest({
    action: createStorefront,
    payload: storefrontPayload.value,
    btnRef: createStorefrontBtnRef,
    btnText: "Create Storefront",
    alertHandler: {
      200: {
        message: "Storefront created successfully",
        description: "You are being redirected to your storefront dashboard",
        type: "success",
      },

      400: {
        message: "Storefront creation failed",
        description: "Please provide a valid storefront name",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    emits("reloadStorefront");
    emits("closeTriggered");
  } else {
    pushToastAlert({
      message: capitalizeFirstLetter(
        response.error || response.message || "Failed to create storefront",
      ),
      description: "Provide a valid storefront name",
      type: "error",
    });
  }
};
</script>

<style lang="scss" scoped>
.storefront-display-block {
  @apply border border-grey-300 rounded-md px-4 py-3 -mt-1 mb-8;

  .top-row {
    @apply flex justify-start items-center gap-x-2 mb-2;

    .icon {
      @apply text-lg text-grey-600;
    }

    .ptimary-text {
      @apply text-[14px] text-grey-700 font-semibold;
    }
  }

  .bottom-row {
    @apply flex justify-start items-start text-sm;

    .base-domain-url {
      @apply text-grey-500;
    }

    .secondary-domain-url {
      @apply text-grey-600 font-semibold break-all text-wrap whitespace-pre;
    }
  }
}
</style>
