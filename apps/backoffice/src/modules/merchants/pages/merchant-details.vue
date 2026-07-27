<template>
  <MerchantDetailsWrapper
    :merchantId="id"
    :merchantDetails="merchantDetails"
    :businessName="businessName"
    :businessStatus="businessStatus"
    :overviewData="overviewData"
    @actionSelected="openMerchantAction"
    @payoutActionSelected="openPayoutAction"
  >
    <MerchantTabs v-model:activeTab="activeTab" />
    <component
      :is="currentComponent"
      class="tab-content"
      :merchantId="id"
      :merchantDetails="merchantDetails"
      :businessName="businessName"
      :overviewData="overviewData"
    />
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
import MerchantDetailsWrapper from "@/modules/payments/components/merchant-details-wrapper.vue";
import MerchantTabs from "@/modules/payments/components/merchant-tabs.vue";
import Profile from "@/modules/payments/components/profile.vue";
import TaxRecord from "@/modules/payments/components/tax-record.vue";
import Refunds from "@/modules/payments/components/refunds.vue";
import AddFee from "@/modules/payments/components/add-fee.vue";
import Transactions from "@/modules/payments/components/transactions.vue";
import PayoutHistory from "@/modules/payments/components/payout-history.vue";
import Disputes from "@/modules/payments/components/disputes.vue";
import MerchantActionModal from "@/modules/payments/modals/merchant-action-modal.vue";
import { useMerchantStore } from "@/modules/merchants/store";

type MerchantAction = "reset-password" | "login" | "reset-mfa" | "delete";
type PayoutAction = "approve" | "reject";
type DetailAction = MerchantAction | PayoutAction;

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const {
  getSingleMerchant,
  getMerchantOverview,
  resetMerchantPassword,
  loginMerchantAccount,
  deleteMerchant,
  resetMerchantMfa,
  approveMerchantPayoutRequest,
  rejectMerchantPayoutRequest,
} = useMerchantStore();
const { processAPIRequest } = useEvents();

const activeTab = ref<string>("Transactions");
const merchantDetails = ref<Record<string, any> | null>(null);
const overviewData = ref<Record<string, any> | null>(null);
const businessName = ref("");
const businessStatus = ref("");
const showActionModal = ref(false);
const activeAction = ref<DetailAction>("approve");

const tabComponents: Record<string, any> = {
  Transactions,
  Refunds,
  Payouts: PayoutHistory,
  "Tax Records": TaxRecord,
  Fees: AddFee,
  Disputes,
  Profile,
};

const currentComponent = computed(() => tabComponents[activeTab.value]);

const modalContent = computed(() => {
  const content: Record<
    DetailAction,
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
        "A password reset request will be sent for this merchant account.",
      confirmText: "Reset password",
      tone: "success",
    },
    login: {
      title: "Login to merchant's account",
      description:
        "You will be logged into this merchant's account if the request is approved by the server.",
      confirmText: "Login",
      tone: "success",
    },
    "reset-mfa": {
      title: "Reset MFA",
      description:
        "This will reset the multi-factor authentication for this merchant. They will need to set it up again.",
      confirmText: "Reset MFA",
      tone: "success",
    },
    delete: {
      title: "Deactivate merchant's account",
      description:
        "This merchant will be deactivated. This action cannot be undone.",
      confirmText: "Deactivate merchant",
      tone: "danger",
    },
    approve: {
      title: "Approve payout request",
      description: "This merchant payout request will be approved.",
      confirmText: "Approve",
      tone: "success",
    },
    reject: {
      title: "Reject payout request",
      description: "This merchant payout request will be rejected.",
      confirmText: "Reject",
      tone: "danger",
    },
  };

  return content[activeAction.value];
});

const fetchMerchantDetails = async () => {
  const response = await processAPIRequest({
    action: async () => getSingleMerchant(id),
    showAlert: false,
  });

  if (response?.code === 200) {
    merchantDetails.value = response.data || {};
    businessName.value = response.data?.name;
    businessStatus.value = response.data?.status;
  }
};

const fetchMerchantOverview = async () => {
  const response = await processAPIRequest({
    action: getMerchantOverview,
    payload: id,
    showAlert: false,
  });

  if (response?.code === 200 && response.data) {
    overviewData.value = response.data;

    const business = response.data.profile?.business;
    const user = response.data.profile?.user;

    if (business?.name) {
      businessName.value = business.name;
    } else if (user?.email) {
      businessName.value = user.email;
    }

    if (business?.status) {
      businessStatus.value = business.status;
    }
  }
};

const openMerchantAction = (action: MerchantAction) => {
  activeAction.value = action;
  showActionModal.value = true;
};

const openPayoutAction = (action: PayoutAction) => {
  activeAction.value = action;
  showActionModal.value = true;
};

const closeActionModal = () => {
  showActionModal.value = false;
};

const actionHandler = computed(() => {
  const actions: Record<DetailAction, () => Promise<any>> = {
    "reset-password": () => resetMerchantPassword(id),
    login: () => loginMerchantAccount(id),
    "reset-mfa": () => resetMerchantMfa(id),
    delete: () => deleteMerchant(id),
    approve: () => approveMerchantPayoutRequest(id),
    reject: () => rejectMerchantPayoutRequest(id),
  };

  return actions[activeAction.value];
});

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
        message: "Merchant not found",
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
    router.push("/merchants");
    return;
  }

  if (action === "approve" || action === "reject") {
    fetchMerchantDetails();
  }
};

onMounted(() => {
  fetchMerchantDetails();
  fetchMerchantOverview();
});
</script>

<style scoped>
.tab-content {
  margin-top: 1rem;
}
</style>
