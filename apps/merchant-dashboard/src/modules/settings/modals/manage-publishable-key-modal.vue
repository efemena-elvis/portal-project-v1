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
              labelTitle="Key Name (Your key identifier name)"
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
              labelTitle="Narration (Optional)"
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
              labelTitle="Your Website Domain"
              :labelCompact="false"
              :inputType="IInputType.Text"
              inputPlaceholder="Enter website domain"
              :inputValue="keyPayload.allowed_domains"
              @inputChanged="keyPayload.allowed_domains = $event"
              :errorHandler="{
                validator: 'validateURL',
                message: 'Enter a valid url.',
              }"
            />
          </div>
          <div class="px-4">
            <button
              class="btn btn-primary w-full"
              ref="generateKeyBtnRef"
              :disabled="isLoading || !isActionReady"
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
import { useAppVariant, useEvents, useString } from "@packages/hooks";
import { TextFieldInput, ModalDialog, SelectFieldInput } from "@packages/uikit";
import { updatePublishableKey } from "../store/actions";

const appVariant = ref<string>(useAppVariant());

type IPublishableKeyPayload = {
  name: string;
  currency: string;
  payment_method: string;
  redirect_url: string;
  narration?: string;
  webhook_url: string;
  allowed_domains: string;

  redirect_success_url: string;
  redirect_failed_url: string;
};

const emits = defineEmits(["closeTriggered", "reloadPublishableKeys"]);

const props = defineProps<{
  isRegenerate?: boolean;
  isUpdate?: boolean;
  keyData?: any;
}>();

const { generatePublishableKey, regeneratePublishableKey } = useSettingsStore();
const { processAPIRequest, pushToastAlert } = useEvents();
const { capitalizeFirstLetter } = useString();

const paymentMethods = [
  { name: "Card", value: "card" },
  { name: "Mobile Money", value: "mobilemoney" },
];

const getCurrency = computed(() =>
  appVariant.value === "alexpay" ? "GHS" : "ZMW",
);

const keyPayload = ref<IPublishableKeyPayload>({
  name: "",
  currency: "USD",
  payment_method: "card",
  redirect_url: "",
  narration: "",
  webhook_url: "",
  redirect_success_url: "",
  redirect_failed_url: "",
  allowed_domains: "",
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
    Boolean(payload.webhook_url) &&
    Boolean(payload.allowed_domains);

  return baseValid;
});

const onMethodChange = (method: string) => {
  keyPayload.value.payment_method = method;
};

const formFields: (keyof IPublishableKeyPayload)[] = [
  "name",
  "currency",
  "payment_method",
  "redirect_url",
  "narration",
  "webhook_url",
  "redirect_success_url",
  "redirect_failed_url",
  "allowed_domains",
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

  const domains = parseList(source.allowed_domains);

  if (domains.length) payload.allowed_domains = domains;

  payload.operator = source.payment_method === "card" ? "mpgs" : "";

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
      201: {
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
  } else {
    pushToastAlert({
      message: "Key creation failed",
      description: capitalizeFirstLetter(response.error.message),
      type: "error",
    });
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

  if (response.code === 200 || response.code === 201) {
    emits("reloadPublishableKeys");
    emits("closeTriggered");
  } else {
    pushToastAlert({
      message: "key creation failed",
      description: capitalizeFirstLetter(response.error.message),
      type: "error",
    });
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

      narration: newData.narration ?? "",
      webhook_url: newData.webhook_url ?? "",
      redirect_success_url: newData.redirect_success_url ?? "",
      redirect_failed_url: newData.redirect_failed_url ?? "",

      allowed_domains: Array.isArray(newData.allowed_domains)
        ? newData.allowed_domains.join(", ")
        : (newData.allowed_domains ?? ""),
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
