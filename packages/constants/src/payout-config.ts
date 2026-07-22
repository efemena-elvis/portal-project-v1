type PayoutGroup = {
  currencies: string[];
  fields: string[];
};

type PayoutConfigData = Record<string, PayoutGroup>;

interface Result {
  group: string;
  country: string; // Normalized from currency name (if available)
  fields: string[];
  currency: string;
}

class PayoutConfig {
  private data: PayoutConfigData;

  constructor(data: PayoutConfigData) {
    this.data = data;
  }

  private currencyDescriptions: Record<string, string> = {
    NGN: "Nigerian Naira",
    ZAR: "South African Rand",
    EGP: "Egyptian Pound",
    MAD: "Moroccan Dirham",
    KES: "Kenyan Shilling",
    GHS: "Ghanaian Cedi",
    UGX: "Ugandan Shilling",
    TZS: "Tanzanian Shilling",
    RWF: "Rwandan Franc",
    XAF: "Central African CFA Franc",
    XOF: "West African CFA Franc",
    ZMW: "Zambian Kwacha",
    EUR: "Euro",
    GBP: "Great British Pound",
    CHF: "Swiss Franc",
    USD: "United States Dollar",
    CAD: "Canadian Dollar",
    BRL: "Brazilian Real",
    MXN: "Mexican Peso",
    ARS: "Argentine Peso",
  };

  private normalizeCountry(currency: string): string {
    const name = this.currencyDescriptions[currency];
    return name
      ? name.toLowerCase().replace(/ /g, "_")
      : currency.toLowerCase();
  }

  public getAllCurrencies(): { currency: string; description: string }[] {
    const currencies = new Set<string>();
    for (const group of Object.values(this.data)) {
      group.currencies.forEach((cur) => currencies.add(cur));
    }

    return Array.from(currencies).map((currency) => ({
      currency,
      description: this.currencyDescriptions[currency] || currency,
    }));
  }

  public getBankDetailsByCurrency(
    currencyCode: string,
  ): Result | { error: string } {
    for (const [groupKey, group] of Object.entries(this.data)) {
      if (group.currencies.includes(currencyCode)) {
        return {
          group: groupKey,
          country: this.normalizeCountry(currencyCode),
          fields: group.fields,
          currency: currencyCode,
        };
      }
    }

    return { error: "Currency not supported" };
  }

  public getBankDetailsFields(result: Result | { error: string }) {
    if ("error" in result) return [];

    const fieldToLabelMap: Record<string, string> = {
      account_holder_name: "Account Holder Name",
      // bank_name: "Bank Name",
      account_number: "Account Number",
      // bank_code: "Bank Code",
      bank_branch: "Bank Branch",
      bank_address: "Bank Address",
      iban: "IBAN",
      swift_bic: "SWIFT/BIC",
      sort_code: "Sort Code",
      mobile_money_number: "Mobile Money Number",
      routing_number: "Routing Number",
      account_type: "Account Type",
      recipient_address: "Recipient Address",
      transit_number: "Transit Number",
      institution_number: "Institution Number",
      cpf_cnpj: "CPF or CNPJ",
      branch_code: "Branch Code",
      clabe: "CLABE",
      cbu: "CBU",
      cuil: "CUIL",
    };

    const numberFields = new Set([
      "account_number",
      // "bank_code",
      "sort_code",
      "mobile_money_number",
      "routing_number",
      "transit_number",
      "institution_number",
      "branch_code",
      "clabe",
      "cbu",
      "cuil",
    ]);

    return result.fields.map((field) => {
      const isNumber = numberFields.has(field);
      const isMobileMoney = field === "mobile_money_number";

      const getErrorHandler = () => {
        if (isMobileMoney)
          return {
            validator: "validatePhone",
          };
        else if (isNumber)
          return {
            validator: "validateOnlyNumbers",
            message: `${label} must contain only numbers`,
          };
        return {
          validator: "validateRequired",
          message: `${label} is a required field`,
        };
      };

      const label = fieldToLabelMap[field] || field.replace(/_/g, " ");
      return {
        labelId: field.replace(/_/g, "").toLowerCase(),
        labelTitle: label,
        inputType: isMobileMoney ? "Phone" : isNumber ? "Number" : "Text",
        inputPlaceholder: `Provide your ${label.toLowerCase()}`,
        isRequired: true,
        modelKey: field,
        errorHandler: getErrorHandler(),
      };
    });
  }
}

// ✅ New, cleaner payout config structure
const payoutConfigData: PayoutConfigData = {
  africa_bank_only: {
    currencies: ["NGN", "ZAR", "EGP", "MAD"],
    fields: ["account_holder_name", "account_number"],
  },
  africa_bank_and_mobile_money: {
    currencies: ["KES", "GHS", "UGX", "TZS", "RWF", "XAF", "XOF", "ZMW"],
    fields: [
      "account_holder_name",
      // "bank_name",
      "account_number",
      // "bank_code",
      "bank_branch",
      // "mobile_money_number",
    ],
  },
  europe_bank_only: {
    currencies: ["EUR", "GBP", "CHF"],
    fields: [
      "account_holder_name",
      "iban",
      "swift_bic",
      // "bank_name",
      "bank_address",
    ],
  },
  america_bank_only: {
    currencies: ["USD"],
    fields: [
      "account_holder_name",
      "account_number",
      "routing_number",
      "swift_bic",
      // "bank_name",
      "bank_address",
    ],
  },
  canada_bank_only: {
    currencies: ["CAD"],
    fields: [
      "account_holder_name",
      "account_number",
      "transit_number",
      "institution_number",
      "swift_bic",
      // "bank_name",
      "bank_address",
    ],
  },
};

const payoutConfigInstance = new PayoutConfig(payoutConfigData);
export default payoutConfigInstance;
