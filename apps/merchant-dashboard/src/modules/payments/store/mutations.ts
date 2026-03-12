import { previewPayload, showPreviewModal } from "./state";

export const setPaymentLinkPreview = (payload: any) => {
  previewPayload.value = { ...payload };
};

export const openPaymentLinkPreview = () => {
  showPreviewModal.value = true;
};

export const closePaymentLinkPreview = () => {
  showPreviewModal.value = false;
};

export const resetPaymentLinkPreview = () => {
  previewPayload.value = null;
  showPreviewModal.value = false;
};