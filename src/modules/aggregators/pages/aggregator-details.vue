<template>
  <MerchantDetailsWrapper
    :merchantId="id"
    :merchantDetails="detail"
    :entityType="'Aggregator'"
    :showMetrics="false"
    :showPayoutRequest="false"

    @actionSelected="openActionModal"
  >
    <template #summaryExtra>
      <p class="merchant-count">
        Number of merchants:
        <strong>{{ merchantCount }}</strong>
      </p>
    </template>

    <div class="tabs-container">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-item"
        :class="{ active: activeTab === tab }"
        type="button"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <AggregatorMerchants
      v-if="activeTab === 'Merchants'"
      :aggregatorId="id"
      class="tab-content"
    />
    <Profile v-else :profiles="profileSections" />
  </MerchantDetailsWrapper>

  <MerchantActionModal
    v-if="showActionModal"
    :action="activeAction"
    :title="modalContent.title"
    :description="modalContent.description"
    :confirmText="modalContent.confirmText"
    :tone="modalContent.tone"
    @closeTriggered="closeActionModal"
    @confirmed="handleActionConfirmed"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents } from "@packages/hooks";
import AggregatorMerchants from "../components/merchants.vue";
import Profile from "@/modules/payments/components/profile.vue";
import MerchantActionModal from "@/modules/payments/modals/merchant-action-modal.vue";
import MerchantDetailsWrapper from "@/modules/payments/components/merchant-details-wrapper.vue";
import { useAggregatorStore } from "@/modules/aggregators/store";

type AggregatorAction = "reset-password" | "login" | "delete";
interface ProfileSection {
  section: string;
  fields: {
    label: string;
    value: string | number;
  }[];
}

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const {
  getSingleAggregator,
  resetAggregatorPassword,
  loginAggregatorAccount,
  deleteAggregator,
} = useAggregatorStore();
const { processAPIRequest } = useEvents();

const activeTab = ref("Merchants");
const tabs = ["Merchants", "Profile"];
const aggregatorDetails = ref<Record<string, any> | null>(null);
const showActionModal = ref(false);
const activeAction = ref<AggregatorAction>("reset-password");

const detail = computed(() => aggregatorDetails.value || {});

const aggregatorName = computed(
  () =>
    detail.value.business_name ||
    detail.value.businessName ||
    detail.value.name ||
    "Tech-village Inc",
);
const countryName = computed(
  () =>
    detail.value.country?.name ||
    detail.value.country_name ||
    detail.value.country ||
    "Tanzania",
);
const merchantCount = computed(
  () =>
    detail.value.merchant_count ||
    detail.value.merchantCount ||
    detail.value.number_of_merchants ||
    54,
);

const profileSections = computed<ProfileSection[]>(() => [
  {
    section: "Business information",
    fields: [
      { label: "Business name", value: aggregatorName.value },
      {
        label: "Established year",
        value: detail.value.established_year || detail.value.year || "2015",
      },
      {
        label: "Director's",
        value: detail.value.director || detail.value.directors || "Jane Smith",
      },
      { label: "Website", value: detail.value.website || "www.terrafirma.com" },
    ],
  },
  {
    section: "Business contacts",
    fields: [
      {
        label: "Business Address",
        value:
          detail.value.business_address ||
          detail.value.address ||
          "123 Green Lane, Springfield",
      },
      {
        label: "Phone number",
        value: detail.value.phone_number || detail.value.phone || "08145671903",
      },
      { label: "X", value: detail.value.x || detail.value.twitter || "-" },
      { label: "Email", value: detail.value.email || "contact@terrafirma.com" },
    ],
  },
]);

const modalContent = computed(() => {
  const content: Record<
    AggregatorAction,
    {
      title: string;
      description: string;
      confirmText: string;
      tone: "success" | "danger";
    }
  > = {
    "reset-password": {
      title: "Reset account password",
      description:
        "A password reset request will be sent for this aggregator account.",
      confirmText: "Reset password",
      tone: "success",
    },
    login: {
      title: "Login to aggregator account",
      description:
        "You will be logged into this aggregator account if the request is approved by the server.",
      confirmText: "Login",
      tone: "success",
    },
    delete: {
      title: "Deactivate aggregator's account",
      description:
        "This aggregator account will be deactivated. This action cannot be undone.",
      confirmText: "Deactivate aggregator's account",
      tone: "danger",
    },
  };

  return content[activeAction.value];
});

const fetchAggregatorDetails = async () => {
  const response = await processAPIRequest({
    action: async () => getSingleAggregator(id),
    showAlert: false,
  });

  if (response?.code === 200) {
    aggregatorDetails.value = response.data || {};
  }
};

const actionHandler = computed(() => {
  const actions: Record<AggregatorAction, () => Promise<any>> = {
    "reset-password": () => resetAggregatorPassword(id),
    login: () => loginAggregatorAccount(id),
    delete: () => deleteAggregator(id),
  };

  return actions[activeAction.value];
});

const openActionModal = (action: AggregatorAction) => {
  activeAction.value = action;
  showActionModal.value = true;
};

const closeActionModal = () => {
  showActionModal.value = false;
};

const handleActionConfirmed = async () => {
  const action = activeAction.value;
  const response = await processAPIRequest({
    action: actionHandler.value,
    alertHandler: {
      200: {
        type: "success",
        message: modalContent.value.title,
        description: "Action completed successfully.",
      },
      201: {
        type: "success",
        message: modalContent.value.title,
        description: "Action completed successfully.",
      },
      400: {
        type: "error",
        message: "Unable to complete action",
      },
      404: {
        type: "error",
        message: "Aggregator not found",
        description: "Please refresh the page and try again.",
      },
    },
  });

  showActionModal.value = false;

  if (response?.code !== 200 && response?.code !== 201) return;

  if (action === "login" && response.data?.login_url) {
    window.location.assign(response.data.login_url);
    return;
  }

  if (action === "delete") {
    router.push("/aggregators");
  }
};

onMounted(fetchAggregatorDetails);
</script>

<style scoped lang="scss">
.tabs-container {
  @apply flex w-full items-center gap-4 overflow-x-auto rounded-lg bg-teal-100 p-3;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-item {
  @apply h-8 min-w-[96px] cursor-pointer rounded-md px-4 text-center text-xs font-bold text-grey-600 transition-all ease-in-out duration-200;

  &.active {
    @apply bg-white text-teal-800 shadow-sm;
  }
}

.merchant-count {
  @apply ml-auto text-sm font-bold text-teal-800 sm:ml-0;

  strong {
    @apply ml-2 text-grey-900;
  }
}

.tab-content {
  @apply mt-0;
}
</style>
