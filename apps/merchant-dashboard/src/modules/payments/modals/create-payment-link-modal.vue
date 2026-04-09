<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Create Payment Link</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="mt-2 modal-cover-body">
        <!-- AMOUNT-->
        <div class="">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Amount</label
          >
          <div
            class="flex items-center border border-gray-300 rounded-lg overflow-hidden h-12 focus-within:ring-1 focus-within:ring-green-500"
          >
            <div
              class="flex items-center gap-2 px-3 bg-gray-50 border-r border-gray-200 h-full"
            >
              <img
                :src="selectedCurrency.logo"
                class="w-5 h-3.5 object-cover rounded-sm"
              />
              <select
                v-model="paymentLinkPayload.currency"
                class="bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
              >
                <option
                  v-for="curr in validCurrencies"
                  :key="curr.value"
                  :value="curr.value"
                >
                  {{ curr.value }}
                </option>
              </select>
            </div>

            <div class="flex items-center flex-1 px-3 bg-white h-full">
              <span class="text-gray-400 mr-1">{{ currencySymbol }}</span>
              <input
                type="number"
                v-model="paymentLinkPayload.amount"
                class="w-full text-right focus:outline-none font-medium"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <!-- ALLOW CUSTOMER EDIT AMOUNT -->
        <div class="flex items-center gap-3 w-full my-3">
          <button
            type="button"
            @click="
              allowCustomerEdit = !allowCustomerEdit;
              paymentLinkPayload.allow_amount_edit = allowCustomerEdit;
            "
            :class="allowCustomerEdit ? 'bg-green-600' : 'bg-gray-200'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none"
          >
            <span
              :class="allowCustomerEdit ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300"
            ></span>
          </button>
          <span class="text-sm font-medium text-gray-700"
            >Allow customer edit amount</span
          >
        </div>

        <TextFieldInput
          labelId="description"
          labelTitle="Description"
          :labelCompact="false"
          :inputType="IInputType.Text"
          inputPlaceholder="Provide a description for the payment"
          :inputValue="paymentLinkPayload.description"
          isRequired
          @inputChanged="paymentLinkPayload.description = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Description is required',
          }"
        />

        <TextFieldInput
          labelId="redirect_url"
          labelTitle="Redirect URL"
          :isDisabled="true"
          :labelCompact="false"
          :inputType="IInputType.Text"
          :inputValue="paymentLinkPayload.redirect_url"
        />

        <!-- IS REUSABLE -->
        <div class="flex items-center gap-3 my-2 w-full">
          <button
            type="button"
            @click="
              paymentLinkPayload.is_reusable = !paymentLinkPayload.is_reusable
            "
            :class="
              paymentLinkPayload.is_reusable ? 'bg-green-600' : 'bg-gray-200'
            "
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none"
          >
            <span
              :class="
                paymentLinkPayload.is_reusable
                  ? 'translate-x-6'
                  : 'translate-x-1'
              "
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300"
            ></span>
          </button>
          <span class="text-sm font-medium text-gray-700"
            >Payment link is reusable</span
          >
        </div>

        <!-- CUSTOMIZATION -->
        <div class="font-bold mb-3 mt-5">Customization</div>

        <!-- LOGO -->
        <div class="relative">
          <label for="logo_url" class="text-[14px] font-medium"
            >Add a logo</label
          >
          <div class="mt-2">
            <FileUploadInput
              :uploadAction="uploadFile"
              :showSkip="false"
              fileUploadText="Click here to upload your logo"
              :uploadedDocumentContent="getUploadedLogoContent"
              @onDocumentUploaded="
                (logo) => (paymentLinkPayload.logo_url = logo)
              "
              :hasDocumentUploaded="!!uploadedLogo"
            />
          </div>
        </div>
        <!-- BACKGROUND COLOR -->
        <div class="mt-4">
          <label class="block mb-2 text-[14px] font-medium"
            >Background colour</label
          >

          <div class="flex items-center gap-3">
            <input
              type="color"
              v-model="paymentLinkPayload.background_color"
              class="w-10 h-10 border rounded mb-4"
            />
            <TextFieldInput
              labelId="bgColor"
              :labelCompact="false"
              inputPlaceholder="FFFFFF"
              :inputValue="backgroundHex"
              :maxLength="6"
              :inputType="IInputType.Text"
              @inputChanged="backgroundHex = $event"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="mt-2 modal-cover-footer flex gap-3">
        <button
          class="w-1/2 btn btn-primary cursor-pointer"
          ref="createPaymentLinkBtnRef"
          :disabled="isActionReady"
          @click="handleCreatePaymentLink"
        >
          Create Payment Link
        </button>
        <button
          class="w-1/2 btn btn-secondary cursor-pointer disabled:text-grey-100"
          ref="previewPaymentLinkBtnRef"
          :disabled="isActionReady"
          @click="handlePreviewPaymentLink"
        >
          Preview
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { IInputType } from "@packages/models";
import { ModalDialog, TextFieldInput, FileUploadInput } from "@packages/uikit";
import { useEvents, useString, useAppVariant } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
import { useGlobalStore } from "@/modules/global/store";
import { countryCurrencies } from "@packages/constants";

type IPaymentLinkType = {
  amount: string;
  allow_amount_edit?: boolean;
  description: string;
  currency: string;
  payment_method: string;
  redirect_url: string;
  logo_url?: string;
  background_color?: string;
  is_reusable: boolean;
};

const emits = defineEmits(["closeTriggered", "reloadPaymentLinks"]);

const appVariant = ref<string>(useAppVariant());
const { uploadFile } = useGlobalStore();

const { capitalizeFirstLetter } = useString();
const { processAPIRequest, pushToastAlert } = useEvents();
const { createPaymentLink } = usePaymentStore();
const paymentStore = usePaymentStore();

const validCurrencies = computed(() => {
  return appVariant.value === "alexpay"
    ? [
        {
          value: "GHS",
          name: "Ghanaian Cedi",
          logo: "https://flagcdn.com/gh.svg",
        },
        {
          value: "USD",
          name: "United States Dollars",
          logo: "https://flagcdn.com/us.svg",
        },
      ]
    : [
        {
          value: "ZMW",
          name: "Zambian Kwacha",
          logo: "https://flagcdn.com/zm.svg",
        },
        {
          value: "GHS",
          name: "Ghanaian Cedi",
          logo: "https://flagcdn.com/gh.svg",
        },
      ];
});

// Display the hex without #
const backgroundHex = computed({
  get: () => {
    return paymentLinkPayload.value.background_color
      ? paymentLinkPayload.value.background_color.replace(/^#/, "")
      : "";
  },
  //set internally to include #
  set: (val: string) => {
    val = val.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    paymentLinkPayload.value.background_color = val ? `#${val}` : "";
  },
});

const isActionReady = computed(() => {
  const baseValid =
    paymentLinkPayload.value.amount &&
    paymentLinkPayload.value.description &&
    paymentLinkPayload.value.redirect_url;

  return !baseValid;
});

const uploadedLogo = ref<string>(paymentStore.previewPayload?.logo_url || "");

const getUploadedLogoContent = computed(() => {
  return {
    name: "Logo",
    link: uploadedLogo.value,
  };
});

const allowCustomerEdit = ref<boolean>(false);

const getDomain = computed(() =>
  appVariant.value === "alexpay"
    ? "https://merchants.alexpay.com"
    : "https://merchant.redstonepgs.com",
);

const paymentLinkPayload = ref<IPaymentLinkType>({
  ...{
    amount: "",
    allow_amount_edit: false,
    description: "",
    currency: appVariant.value === "alexpay" ? "GHS" : "ZMW",
    payment_method: "mobilemoney",
    redirect_url: `${getDomain.value}/payment-links/success`,
    logo_url: uploadedLogo.value,
    background_color: "#ffffff",
    is_reusable: false,
  },
  ...paymentStore.previewPayload, // override defaults with store values if available
});

allowCustomerEdit.value = paymentLinkPayload.value.allow_amount_edit ?? false;
const createPaymentLinkBtnRef = ref(null);
const previewPaymentLinkBtnRef = ref(null);

const selectedCurrency = computed(() => {
  return (
    validCurrencies.value.find(
      (c) => c.value === paymentLinkPayload.value.currency,
    ) ?? validCurrencies.value[0]
  );
});

const currencySymbol = computed(() => {
  const countryCurrency = countryCurrencies.find(
    (country) => country.currency.short === selectedCurrency.value?.value,
  );
  return countryCurrency?.currency.sign;
});

const handlePreviewPaymentLink = () => {
  paymentStore.setPaymentLinkPreview(paymentLinkPayload.value);
  paymentStore.closeCreateLinkModal();
  paymentStore.openPaymentLinkPreview();
};

const handleCreatePaymentLink = async () => {
  const response = await processAPIRequest({
    action: createPaymentLink,
    payload: paymentLinkPayload.value,
    btnRef: createPaymentLinkBtnRef,
    btnText: "Create Payment Link",
    alertHandler: {
      201: {
        message: "Payment link created successfully",
        description: "You are being redirected to your storefront dashboard",
        type: "success",
      },

      400: {
        message: "Payment link creation failed",
        description: "Please provide a valid payment link name",
        type: "error",
      },
    },
  });

  if (response.code === 201) {
    emits("reloadPaymentLinks");
    emits("closeTriggered");
  } else {
    pushToastAlert({
      message: capitalizeFirstLetter(
        response.error || response.message || "Failed to create payment link",
      ),
      description: "Provide a valid payment link name",
      type: "error",
    });
  }
};

watch(
  () => paymentStore.previewPayload,
  (newPayload) => {
    if (newPayload) {
      paymentLinkPayload.value = { ...paymentLinkPayload.value, ...newPayload };
      allowCustomerEdit.value =
        paymentLinkPayload.value.allow_amount_edit ?? false;
    }
  },
);
</script>

<style lang="scss" scoped>
.display-block {
  @apply border border-grey-300 rounded-md px-4 py-3 -mt-1 mb-2;

  .top-row {
    @apply flex justify-start items-center gap-x-2 mb-2;

    .icon {
      @apply text-lg text-grey-600;
    }

    .primary-text {
      @apply text-[14px] text-grey-700 font-semibold;
    }
  }

  .bottom-row {
    @apply flex justify-start items-start text-sm;

    .base-redirect-url {
      @apply text-grey-500;
    }

    .secondary-redirect-url {
      @apply text-grey-600 font-semibold break-all text-wrap whitespace-pre;
    }
  }

  .modal-cover-footer {
    @apply absolute bottom-0 left-0 right-0 py-6 sm:py-4 bg-white;
  }
}
</style>
