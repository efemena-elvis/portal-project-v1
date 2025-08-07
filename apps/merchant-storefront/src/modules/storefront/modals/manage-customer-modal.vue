<template>
  <ModalDialog
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    place_center
  >
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <!-- <div class="modal-cover-header">
        <div class="modal-cover-title">Manage Customer</div>
      </div> -->
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-6">
        <img src="@images/blacklist-user.png" alt="blacklist-icon" />

        <div class="title-text">Blacklist Customer</div>
        <div class="description-text">
          Choose a customer's status?
        </div>
      </div>



          <!-- STOREFRONT CUSTOMER'S STATUS STATUS -->
        <div class="w-full h-fit p-4 ">
          <SelectFieldInput
            labelId="storeCustomers"
            labelTitle=""
            inputPlaceholder="Select customer's status"
            :inputValue="customerStatus"
            :selectData="customerStatusOptions"
            :hasBottomPadding="false"
            isRequired
            @onSelectionChange="customerStatus = $event"
          />
        </div>
    </template>

      <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer flex justify-between gap-x-4 mt-3 mb-1">
        <button
          class="btn btn-sm btn-primary w-full"
          ref="updateCustomerBtnRef"
          :disabled="isActionReady"
          @click="handleUpdateCustomerStatus"
        >
          Update Customer's Status
        </button>
      </div>
    </template>


  
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps } from "vue";
import { useEvents } from "@packages/hooks";
import { ModalDialog, SelectFieldInput } from "@packages/uikit";
import { customerStatusList } from "@/modules/storefront/constants/storefront-customer-status";
import { useStoreStore } from "../store";

const emits = defineEmits(["closeTriggered", "reloadStoreCustomers"]);

const props = defineProps({
currentCustomerData: {
    type: Object,
    required: true,
  },

});

const { processAPIRequest, pushToastAlert } = useEvents();
const { updateCustomerStatus } = useStoreStore();


const updateCustomerBtnRef = ref(null);
const customerStatus = ref<string>("");


const customerStatusOptions = computed(() => {
  return customerStatusList.map((status) => {
    return { value: status.name.toLowerCase(), name: status.name };
  });
});


const isActionReady = computed(() => {
  return customerStatus.value ? false : true;
});

const getStoreCustomerPayload = computed(() => {
  return {
    id:  props.currentCustomerData?.id,
    status: customerStatus.value,
  };
});


const handleUpdateCustomerStatus = async () => {
  const response = await processAPIRequest({
    action: updateCustomerStatus,
    payload: getStoreCustomerPayload.value,
    btnRef: updateCustomerBtnRef,
    btnText: "Update Customer's Status",
    alertHandler: {
      200: {
        message: "Customer's status updated successfully",
        type: "success",
      },
      400: {
        message: "Process failed",
        type: "error",
      },
    },
  });
 if (response.code === 200) {
      emits("reloadStoreCustomers");
      emits("closeTriggered");
    }
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @apply flex flex-col items-center pt-6;

  img {
    @apply size-32 mb-2;
  }

  .title-text {
    @apply text-base text-grey-800 font-bold text-center mb-2;
  }

  .description-text {
    @apply text-[15px] text-grey-700 text-center w-[90%] mb-6;
  }
}
</style>
