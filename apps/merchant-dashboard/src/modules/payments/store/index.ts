import { defineStore } from "pinia";
import * as actions from "./actions";
import * as mutations from "./mutations";
import { previewPayload, showPreviewModal, showCreateLinkModal } from './state';

export const usePaymentStore = defineStore("payment", () => {
  return {
    previewPayload,
    showPreviewModal,
    showCreateLinkModal,
    ...actions,
    ...mutations
  };
});