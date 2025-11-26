import { ref, Ref } from "vue";
import { storeToRefs } from "pinia";
import { Store } from "pinia";
import { useRouter } from "vue-router";
import { useEvents } from "@packages/hooks";

interface ComplianceSubsetRefs {
  getComplianceBusiness: Ref<any>;
  getComplianceRegistration: Ref<any>;
  getComplianceRepresentative: Ref<any>;
  getComplianceBankAccount: Ref<any>;
  getComplianceBusinessSignatory: Ref<any>;
  getComplianceAgreement: Ref<any>;
}

interface ComplianceSubsetActions {
  uploadCompliance: (payload: any) => Promise<any>;
}

type ComplianceSubsetStore = ComplianceSubsetRefs & ComplianceSubsetActions;

// Accept a full Pinia store
export default class ComplianceUtil<TStore extends Store> {
  private store: TStore;
  private router = useRouter();
  private timeOut = ref<number>(1200);
  private processAPIRequest = useEvents().processAPIRequest;

  constructor(store: TStore) {
    this.store = store;
  }

  private get storeRefs(): ComplianceSubsetRefs {
    const refs = storeToRefs(this.store);

    const {
      getComplianceBusiness,
      getComplianceRegistration,
      getComplianceRepresentative,
      getComplianceBankAccount,
      getComplianceBusinessSignatory,
      getComplianceAgreement,
    } = refs as Partial<ComplianceSubsetRefs>;

    return {
      getComplianceBusiness: getComplianceBusiness!,
      getComplianceRegistration: getComplianceRegistration!,
      getComplianceRepresentative: getComplianceRepresentative!,
      getComplianceBankAccount: getComplianceBankAccount!,
      getComplianceBusinessSignatory: getComplianceBusinessSignatory!,
      getComplianceAgreement: getComplianceAgreement!,
    };
  }

  private getRequestPayload({
    businessPayload = {},
    registrationPayload = {},
    representativePayload = {},
    bankPayload = {},
    signatoryPayload = {},
    termsPayload = {},
  }: any) {
    const {
      getComplianceBusiness,
      getComplianceRegistration,
      getComplianceRepresentative,
      getComplianceBankAccount,
      getComplianceBusinessSignatory,
      getComplianceAgreement,
    } = this.storeRefs;

    return {
      business: { ...getComplianceBusiness.value, ...businessPayload },
      registration: {
        ...getComplianceRegistration.value,
        ...registrationPayload,
      },
      representatives:
        Array.isArray(representativePayload.representatives) &&
        representativePayload.representatives.length > 0
          ? representativePayload.representatives.map(
              (rep: any, index: number) => ({
                ...(getComplianceRepresentative.value?.[index] || {}),
                ...rep,
              })
            )
          : getComplianceRepresentative.value || [],

      bank_account: {
        ...getComplianceBankAccount.value,
        ...bankPayload,
      },
      business_signatory: {
        ...getComplianceBusinessSignatory.value,
        ...signatoryPayload,
      },
      terms: { ...getComplianceAgreement.value, ...termsPayload },
    };
  }

  private getRequestAlertHandler(successMsg: string, errorMsg: string) {
    return {
      200: {
        message: successMsg,
        type: "success",
      },
      400: {
        message: errorMsg,
        type: "error",
      },
    };
  }

  private processComplianceRedirect({
    responsePayload,
    stopClickHandler,
    redirectRoute,
  }: any) {
    stopClickHandler.value = true;

    if (responsePayload.code === 200) {
      setTimeout(
        () => this.router.push({ name: redirectRoute }),
        this.timeOut.value
      );
    }
  }

  private selectPayload(
    payload: any,
    payloadType:
      | "business"
      | "registration"
      | "representatives"
      | "bank_account"
      | "business_signatory"
      | "terms"
  ) {
    const payloadBucket = {
      business: { businessPayload: payload },
      registration: { registrationPayload: payload },
      representatives: { representativePayload: payload },
      bank_account: { bankPayload: payload },
      business_signatory: { signatoryPayload: payload },
      terms: { termsPayload: payload },
    };

    return payloadBucket[payloadType];
  }

  public async handleComplianceRequest({
    payload,
    redirectRoute,
    stopClickHandler,
    successMsg,
    errorMsg,
    payloadType,
  }: any) {
    const requestPayload = this.getRequestPayload(
      this.selectPayload(payload, payloadType)
    );

    const response = await this.processAPIRequest({
      action: (this.store as unknown as ComplianceSubsetStore).uploadCompliance,
      payload: requestPayload,
      alertHandler: this.getRequestAlertHandler(successMsg, errorMsg),
    });

    this.processComplianceRedirect({
      responsePayload: response,
      stopClickHandler,
      redirectRoute,
    });
  }
}
