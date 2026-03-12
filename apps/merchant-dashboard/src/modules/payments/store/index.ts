import { defineStore } from "pinia";
import * as actions from "./actions";
import * as mutations from "./mutations";
import { previewPayload, showPreviewModal } from "./state";

export const usePaymentStore = defineStore("payment", () => {
  return {
    previewPayload,
    showPreviewModal,
    ...actions,
    ...mutations
  };
});