import { IMerchantBaseType, CleanedMerchantType } from "@packages/models";

// Function to update state deep values
export function setDeepValue<T extends object>(
  obj: T,
  path: string,
  value: any
): void {
  const keys = path.split(".");
  let current: any = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
}

// Function to get state deep values
export function getDeepValue<T extends object, R = any>(
  obj: T,
  path: string
): R | undefined {
  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }
    current = current[key];
  }

  return current as R;
}

export function cleanMerchantData(
  merchantData: IMerchantBaseType[]
): CleanedMerchantType[] {
  return merchantData.map((merchant) => {
    const { profile, address, documents, director1, director2, ubo1, ubo2 } =
      merchant;

    const representatives = [director1, director2, ubo1, ubo2]
      .filter((rep) => rep.legal_full_name || rep.doc_url) // filter empty ones
      .map((rep, idx) => {
        const role = idx < 2 ? "director" : "ubo";
        return {
          legal_full_name: rep.legal_full_name,
          address: rep.address,
          country_id: rep.country_id,
          business_role: [role],
          doc: {
            type: rep.doc_type,
            url: rep.doc_url,
          },
        };
      });

    return {
      business: {
        legal_name: profile.legal_name,
        trading_name: profile.legal_name,
        mcc: profile.mcc,
        email: profile.email,
        phone_number: profile.phone_number,
        website_link: profile.website_link,
        address: address.address,
        country_id: address.country_id,
        certificate_url: documents.certificate_url,
        form3_url: documents.form3_url,
        tin_number: documents.tin_number,
        billing_descriptor1: address.billing_descriptor1,
        billing_descriptor2: address.billing_descriptor2,
        optional_doc_url: "", // fallback if you have other file input
      },
      representative: representatives,
      terms: {
        signed_agreement: true,
      },
    };
  });
}

export function transformCleanedToMerchantData(
  cleanedData: CleanedMerchantType[]
): IMerchantBaseType[] {
  return cleanedData.map((merchant, index) => {
    const business = merchant.business || {
      legal_name: "",
      trading_name: "",
      mcc: "",
      email: "",
      phone_number: "",
      website_link: "",
      address: "",
      country_id: "",
      certificate_url: "",
      form3_url: "",
      tin_number: "",
      billing_descriptor1: "",
      billing_descriptor2: "",
      optional_doc_url: "",
    };

    const representative = Array.isArray(merchant.representative)
      ? merchant.representative
      : [];

    // Separate representatives by role
    const directors = representative.filter((r) =>
      r.business_role?.includes("director")
    );
    const ubos = representative.filter((r) => r.business_role?.includes("ubo"));

    // Helper to safely map a representative
    const mapRep = (rep?: (typeof representative)[number]) => ({
      legal_full_name: rep?.legal_full_name || "",
      country_id: rep?.country_id || "",
      address: rep?.address || "",
      doc_url: rep?.doc?.url || "",
      doc_type: rep?.doc?.type || "",
    });

    return {
      id: `_initial_mid_${index}`,

      profile: {
        legal_name: business.legal_name || "",
        mcc: business.mcc || "",
        email: business.email || "",
        phone_number: business.phone_number || "",
        website_link: business.website_link || "",
      },

      address: {
        country_id: business.country_id || "",
        address: business.address || "",
        billing_descriptor1: business.billing_descriptor1 || "",
        billing_descriptor2: business.billing_descriptor2 || "",
      },

      documents: {
        tin_number: business.tin_number || "",
        certificate_url: business.certificate_url || "",
        form3_url: business.form3_url || "",
      },

      director1: mapRep(directors[0]),
      director2: mapRep(directors[1]),
      ubo1: mapRep(ubos[0]),
      ubo2: mapRep(ubos[1]),
    };
  });
}
