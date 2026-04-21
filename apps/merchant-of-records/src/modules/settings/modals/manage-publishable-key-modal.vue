<template>
  <ModalDialog
    @closeModal="$emit('closeTriggered')"
    :place_side="!isRegenerate"
  >
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">
          {{ buttonText }}
        </div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="publishable-key-area">
        <div class="publishable-key-input">
          <p class="text-sm text-grey-600 px-6 mt-4">
            {{
              isRegenerate
                ? "This will replace your publishable key. The old key will be invalidated."
                : "Fill in the details to generate a publishable key."
            }}
          </p>

          <div class="whitelist-block rounded-2xl" v-if="!isRegenerate">
            <TextFieldInput
              labelId="textName"
              labelTitle="Name"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="e.g., My Store"
              :inputValue="keyPayload.name"
              @inputChanged="keyPayload.name = $event"
              :isRequired="true"
            />

            <SelectFieldInput
              labelId="currency"
              labelTitle="Currency"
              inputPlaceholder="Select currency"
              :inputValue="keyPayload.currency"
              :selectData="currencyOptions"
              @onSelectionChange="onCurrencyChange"
              isRequired
            />
            <SelectFieldInput
              labelId="method"
              labelTitle="Payment Method"
              inputPlaceholder="Select payment method"
              :inputValue="keyPayload.payment_method"
              :selectData="paymentMethods"
              @onSelectionChange="onMethodChange"
              isRequired
            />

            <TextFieldInput
              labelId="textCallbackUrl"
              labelTitle="Callback URL"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="https://mystore.com/thank-you"
              :inputValue="keyPayload.callback_url"
              @inputChanged="keyPayload.callback_url = $event"
              :errorHandler="{
                validator: 'validateURL',
                message: 'Enter a valid url.',
              }"
              :isRequired="true"
            />

            <TextFieldInput
              labelId="textCancelUrl"
              labelTitle="Cancel URL"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="https://mystore.com/cart"
              :inputValue="keyPayload.cancel_url"
              @inputChanged="keyPayload.cancel_url = $event"
              :errorHandler="{
                validator: 'validateURL',
                message: 'Enter a valid url.',
              }"
            />

            <TextFieldInput
              labelId="textNarration"
              labelTitle="Narration"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="e.g., Store order"
              :inputValue="keyPayload.narration"
              @inputChanged="keyPayload.narration = $event"
            />

            <TextFieldInput
              labelId="textWebhookUrl"
              labelTitle="Webhook URL"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="https://mystore.com/webhook"
              :inputValue="keyPayload.webhook_url"
              @inputChanged="keyPayload.webhook_url = $event"
              :errorHandler="{
                validator: 'validateURL',
                message: 'Enter a valid url.',
              }"
              :isRequired="true"
            />

            <TextFieldInput
              labelId="textDomains"
              labelTitle="Domains"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="Enter allowed domains, separated by commas"
              :inputValue="keyPayload.domains"
              @inputChanged="keyPayload.domains = $event"
              :errorHandler="{
                validator: 'validateURL',
                message: 'Enter a valid url.',
              }"
            />

            <TextFieldInput
              labelId="textIPs"
              labelTitle="IPs"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="Enter allowed IP addresses, separated by commas"
              :inputValue="keyPayload.ips"
              @inputChanged="keyPayload.ips = $event"
            />
          </div>

          <div class="px-4">
            <button
              class="btn btn-primary w-full mt-3"
              ref="generateKeyBtnRef"
              :disabled="!isActionReady || isLoading"
              @click="
                isRegenerate
                  ? handleRegeneratePublishableKey()
                  : handleGeneratePublishableKey()
              "
            >
              {{ buttonText }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <template #modal-cover-footer>
      <div class="modal-cover-footer"></div>
    </template>
  </ModalDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { IInputType } from "@packages/models";
import { useSettingsStore } from "@/modules/settings/store";
import { useEvents } from "@packages/hooks";
import { TextFieldInput, ModalDialog, SelectFieldInput } from "@packages/uikit";
import { updatePublishableKey } from "../store/actions";

type IPublishableKeyPayload = {
  name?: string;
  currency?: string;
  payment_method?: string;
  callback_url?: string;
  cancel_url?: string;
  narration?: string;
  webhook_url?: string;
  domains?: string;
  ips?: string;
};

const emits = defineEmits(["closeTriggered", "reloadPublishableKeys"]);

const props = defineProps<{
  isRegenerate?: boolean;
  isUpdate?: boolean;
  keyData?: any;
}>();

const { generatePublishableKey, regeneratePublishableKey } = useSettingsStore();
const { processAPIRequest } = useEvents();

const paymentMethods = [
  { name: "Card", value: "card" },
  { name: "Mobile Money", value: "mobilemoney" },
];

const keyPayload = ref<IPublishableKeyPayload>({
  name: "",
  currency: "",
  payment_method: "",
  callback_url: "",
  cancel_url: "",
  narration: "",
  webhook_url: "",
  domains: "",
  ips: "",
});

const generateKeyBtnRef = ref<HTMLButtonElement | null>(null);
const isLoading = ref<boolean>(false);

const isActionReady = computed(() => {
  if (props.isRegenerate) return true;

  const { name, currency, callback_url, webhook_url, domains, ips } =
    keyPayload.value;

  const hasRequiredFields =
    Boolean(name) &&
    Boolean(currency) &&
    Boolean(callback_url) &&
    Boolean(webhook_url);

  const hasWhitelist = Boolean(domains) || Boolean(ips);

  return hasRequiredFields && hasWhitelist;
});

const onMethodChange = (method: string) => {
  keyPayload.value.payment_method = method;
};

const formFields: (keyof IPublishableKeyPayload)[] = [
  "name",
  "currency",
  "payment_method",
  "callback_url",
  "cancel_url",
  "narration",
  "webhook_url",
];

const currencyOptions = [
  { name: "USD", value: "USD" },
  { name: "GHS", value: "GHS" },
  { name: "ZMW", value: "ZMW" },
  { name: "TZS", value: "TZS" },
];

const parseList = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const getPublishableKeyPayload = () => {
  const payload: Record<string, any> = {};
  const source = keyPayload.value;

  formFields.forEach((field) => {
    const value = source[field];
    if (value) payload[field] = value;
  });

  const domains = parseList(source.domains);
  const ips = parseList(source.ips);

  if (domains.length) payload.domains = domains;
  if (ips.length) payload.ips = ips;

  if (props.isUpdate && props.keyData?.id) {
    payload.id = props.keyData.id;
  }

  return payload;
};

const buttonText = computed(() => {
  if (props.isRegenerate) return "Regenerate Publishable Key";
  if (props.isUpdate) return "Update Publishable Key";
  return "Generate Publishable Key";
});

const onCurrencyChange = (currency: string) => {
  keyPayload.value.currency = currency;
};

const handleGeneratePublishableKey = async () => {
  const response = await processAPIRequest({
    action: props.isUpdate ? updatePublishableKey : generatePublishableKey,
    btnRef: generateKeyBtnRef,
    btnText: buttonText.value,
    payload: getPublishableKeyPayload(),
    alertHandler: {
      200: {
        message: props.isUpdate
          ? "Publishable key updated successfully"
          : "Publishable key generated successfully",
        type: "success",
      },
      400: {
        message: props.isUpdate
          ? "Failed to update publishable key"
          : "Failed to generate publishable key",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    emits("reloadPublishableKeys");
    emits("closeTriggered");
  }
};

const handleRegeneratePublishableKey = async () => {
  const response = await processAPIRequest({
    action: regeneratePublishableKey,
    btnRef: generateKeyBtnRef,
    btnText: "Regenerate Publishable Key",
    // payload: { id: props.keyData?.id },
    alertHandler: {
      200: {
        message: "Publishable key regenerated successfully",
        type: "success",
      },
      400: {
        message: "Failed to regenerate publishable key",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    emits("reloadPublishableKeys");
    emits("closeTriggered");
  }
};
watch(
  () => props.keyData,
  (newData) => {
    if (!props.isUpdate || !newData) return;

    keyPayload.value = {
      name: newData.name ?? "",
      currency: newData.currency ?? "",
      payment_method: newData.payment_method ?? "",
      callback_url: newData.callback_url ?? "",
      cancel_url: newData.cancel_url ?? "",
      narration: newData.narration ?? "",
      webhook_url: newData.webhook_url ?? "",

      domains: Array.isArray(newData.allowed_domains)
        ? newData.allowed_domains.join(", ")
        : (newData.allowed_domains ?? ""),

      ips: Array.isArray(newData.allowed_ips)
        ? newData.allowed_ips.join(", ")
        : (newData.allowed_ips ?? ""),
    };
  },
  { immediate: true },
);


</script>
<style scoped lang="scss">
.publishable-key-area {
  .publishable-key-input {
    .whitelist-block {
      @apply rounded-2xl p-6;
    }

    .text-grey-600 {
      @apply leading-7;
    }

    .modal-cover-footer {
      @apply hidden;
    }

    .btn-alert {
      @apply bg-red-500 text-neutral-10 hover:bg-red-600;
    }
  }
}
</style>
