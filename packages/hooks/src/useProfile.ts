import { useString } from "@packages/hooks";
import { Store } from "pinia";
import { storeToRefs } from "pinia";
import { Ref } from "vue";

// ---------- INTERFACES ----------
interface IUserProfile {
  id: string;
  email: string;
  country: {
    country_code: string;
    currency_code: string;
    name: string;
    id: string;
  };
  firstName: string;
  lastName: string;
  currentBusiness: string;
  isEmailVerified: boolean;
}

interface IBusinessProfile {
  businessAddress: string;
  bankAccountNumber: string;
  bankName: string;
  disputeEmailAddress: string;
  generalEmailAddress: string;
  businessId: string;
  businessLogo: string;
  businessMode: string;
  businessName: string;
  businessSector: string;
  activated: string;
  supportEmailAddress: string;
  activateMyBusiness: boolean;
}

interface IAPIKeys {
  playground: Record<string, string>;
  alcatraz?: Record<string, string>;
}

// ---------- REF TYPES ----------
type AuthStoreRefsRaw = {
  getAuthToken: Ref<string>;
  getAuthUser: Ref<IUserProfile | null>;
  getAuthBusiness: Ref<IBusinessProfile | null>;
  getAuthBusinessToken: Ref<IAPIKeys | null>;
};

// ---------- UNWRAPPED TYPES ----------
type AuthStoreRefs = {
  getAuthToken: string;
  getAuthUser: IUserProfile | null;
  getAuthBusiness: IBusinessProfile | null;
  getAuthBusinessToken: IAPIKeys | null;
};

// ---------- UTILITY CLASS ----------
const { decodeString } = useString();

export default class ProfileUtil<TStore extends Store> {
  private store: TStore;

  constructor(store: TStore) {
    this.store = store;
  }

  private get storeRefs(): AuthStoreRefs {
    const refs = storeToRefs(this.store) as unknown as AuthStoreRefsRaw;

    return {
      getAuthToken: refs.getAuthToken.value || "",
      getAuthUser: refs.getAuthUser.value || null,
      getAuthBusiness: refs.getAuthBusiness.value || null,
      getAuthBusinessToken: refs.getAuthBusinessToken.value || null,
    };
  }

  public getToken(): string {
    return this.storeRefs.getAuthToken;
  }

  public isUserAuthenticated(): boolean {
    const token = this.getToken();
    return typeof token === "string" && token.trim().length > 0;
  }

  public getUser(): IUserProfile | null {
    return this.storeRefs.getAuthUser;
  }

  public getBusiness():
    | (Omit<IBusinessProfile, "bankAccountNumber" | "bankName"> & {
        bankAccountNumber: string;
        bankName: string;
      })
    | null {
    const business = this.storeRefs.getAuthBusiness;

    if (!business) return null;

    const { bankAccountNumber = "", bankName = "", ...rest } = business;

    return {
      ...rest,
      bankAccountNumber: decodeString(bankAccountNumber),
      bankName: decodeString(bankName),
    };
  }

  public getBusinessActivatedStatus(): string {
    const business = this.storeRefs.getAuthBusiness;
    const activated = business?.activated ?? "";
    return activated ? decodeString(activated) : "false";
  }

  public getAPIKeys(): {
    test: { public: string; secret: string };
    live: { public: string; secret: string };
  } {
    const tokens = this.storeRefs.getAuthBusinessToken;

    const testPublic = tokens?.playground?.nigeria ?? "";
    const testSecret = tokens?.playground?.unitedKingdom ?? "";

    const livePublic = tokens?.alcatraz?.nigeria ?? "";
    const liveSecret = tokens?.alcatraz?.unitedKingdom ?? "";

    return {
      test: {
        public: decodeString(testPublic),
        secret: decodeString(testSecret),
      },
      live: {
        public: decodeString(livePublic),
        secret: decodeString(liveSecret),
      },
    };
  }
}
