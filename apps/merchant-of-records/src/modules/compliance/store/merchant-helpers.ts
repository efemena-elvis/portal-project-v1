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
        website_link: profile.website_link ?? "",
        address: address.address,
        country_id: address.country_id,
        certificate_url: documents.certificate_url,
        form3_url: documents.form3_url,
        tin_number: documents.tin_number,
        billing_descriptor1: address.billing_descriptor1,
        billing_descriptor2: address.billing_descriptor2 ?? "",
        optional_doc_url: "", // fallback if you have other file input
      },
      representative: representatives,
      terms: {
        signed_agreement: true,
      },
    };
  });
}
