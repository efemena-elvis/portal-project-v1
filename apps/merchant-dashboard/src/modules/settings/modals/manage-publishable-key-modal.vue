<template>
  <ModalDialog
    @closeModal="$emit('closeTriggered')"
    @reloadPublishableKeys="$emit('reloadPublishableKeys')"
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

            <TextFieldInput
              labelId="textCurrency"
              labelTitle="Currency"
              :labelCompact="false"
              :inputType="IInputType.Text"
              :inputValue="getCurrency"
              :isDisabled="true"
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
              v-if="keyPayload.payment_method === 'mobilemoney'"
              labelId="textRedirectUrl"
              labelTitle="Redirect URL"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="https://mystore.com/thank-you"
              :inputValue="keyPayload.redirect_url"
              @inputChanged="keyPayload.redirect_url = $event"
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
              v-if="keyPayload.payment_method === 'card'"
              labelId="textRedirectSuccess"
              labelTitle="Redirect Success URL"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="https://mystore.com/success"
              :inputValue="keyPayload.redirect_success_url"
              @inputChanged="keyPayload.redirect_success_url = $event"
              :errorHandler="{
                validator: 'validateURL',
                message: 'Enter a valid url.',
              }"
            />

            <TextFieldInput
              v-if="keyPayload.payment_method === 'card'"
              labelId="textRedirectFailed"
              labelTitle="Redirect Failed URL"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="https://mystore.com/failed"
              :inputValue="keyPayload.redirect_failed_url"
              @inputChanged="keyPayload.redirect_failed_url = $event"
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
              :disabled="isLoading"
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
import { useAppVariant, useEvents } from "@packages/hooks";
import { TextFieldInput, ModalDialog, SelectFieldInput } from "@packages/uikit";
import { updatePublishableKey } from "../store/actions";

const appVariant = ref<string>(useAppVariant());

type IPublishableKeyPayload = {
  name: string;
  currency: string;
  payment_method: string;
  redirect_url: string;
  cancel_url: string;
  narration: string;
  webhook_url: string;
  domains?: string;
  ips?: string;

  redirect_success_url?: string;
  redirect_failed_url?: string;
};

const emits = defineEmits(["closeTriggered", "reloadPublishableKeys"]);

const props = defineProps<{
  isRegenerate?: boolean;
  isUpdate?: boolean;
  keyData?: any;
}>();

const { generatePublishableKey, regeneratePublishableKey } = useSettingsStore();
const { processAPIRequest, pushToastAlert } = useEvents();

const paymentMethods = [
  { name: "Card", value: "card" },
  { name: "Mobile Money", value: "mobilemoney" },
];

const getCurrency = computed(() =>
  appVariant.value === "alexpay" ? "GHS" : "ZMW",
);

const keyPayload = ref<IPublishableKeyPayload>({
  name: "",
  currency: "",
  payment_method: "",
  redirect_url: "",
  cancel_url: "",
  narration: "",
  webhook_url: "",
  redirect_success_url: "",
  redirect_failed_url: "",
  domains: "",
  ips: "",
});

const generateKeyBtnRef = ref<HTMLButtonElement | null>(null);
const isLoading = ref<boolean>(false);

const isActionReady = computed(() => {
  if (props.isRegenerate) return true;

  const payload = keyPayload.value;

  const baseValid =
    Boolean(payload.name) &&
    Boolean(payload.currency) &&
    Boolean(payload.payment_method) &&
    Boolean(payload.webhook_url);

  const hasWhitelist = Boolean(payload.domains) || Boolean(payload.ips);

  const isCardValid =
    payload.payment_method !== "card" ||
    (Boolean(payload.redirect_url) && Boolean(payload.cancel_url));

  const isMomoValid =
    payload.payment_method !== "mobilemoney" || Boolean(payload.redirect_url);

  return baseValid && hasWhitelist && isCardValid && isMomoValid;
});

const onMethodChange = (method: string) => {
  keyPayload.value.payment_method = method;
};

const formFields: (keyof IPublishableKeyPayload)[] = [
  "name",
  "currency",
  "payment_method",
  "redirect_url",
  "cancel_url",
  "narration",
  "webhook_url",
  "redirect_success_url",
  "redirect_failed_url",
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

  if (source.payment_method === "card") {
    payload.operator = "mpgs";

    payload.redirect_success_url = source.redirect_success_url;

    payload.redirect_failed_url = source.redirect_failed_url;
  } else {
    payload.redirect_url = source.redirect_url;
  }

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

const handleGeneratePublishableKey = async () => {
  if (!isActionReady.value) {
    pushToastAlert({
      message: "Key creation failed",
      description:
        "Please fill in all required fields and ensure the URLs are valid.",
      type: "error",
    });
    return; 
  }

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

  if (response.code === 201) {
    emits("reloadPublishableKeys");
    emits("closeTriggered");
  }
};

const handleRegeneratePublishableKey = async () => {
  const response = await processAPIRequest({
    action: regeneratePublishableKey,
    btnRef: generateKeyBtnRef,
    btnText: "Regenerate Publishable Key",
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
      currency: newData.currency ?? getCurrency.value,
      payment_method: newData.payment_method ?? "",
      redirect_url: newData.redirect_url ?? "",
      cancel_url: newData.cancel_url ?? "",
      narration: newData.narration ?? "",
      webhook_url: newData.webhook_url ?? "",
      redirect_success_url: newData.redirect_success_url ?? "",
      redirect_failed_url: newData.redirect_failed_url ?? "",

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
watch(
  getCurrency,
  (val) => {
    if (!props.isUpdate) {
      keyPayload.value.currency = val;
    }
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
