const payoutConfigData = {
  africa_bank_only: {
    currencies: ["NGN", "ZAR", "EGP", "MAD"],
    fields: ["account_holder_name", "bank_name", "account_number", "bank_code"],
  },
  africa_bank_and_mobile_money: {
    currencies: ["KES", "GHS", "UGX", "TZS", "RWF", "XAF", "XOF", "ZMW"],
    fields: [
      "account_holder_name",
      "bank_name",
      "account_number",
      "bank_code",
      "mobile_money_number",
    ],
  },
  europe_bank_only: {
    currencies: ["EUR", "GBP", "CHF"],
    fields: [
      "account_holder_name",
      "iban",
      "swift_bic",
      "bank_name",
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
      "bank_name",
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
      "bank_name",
      "bank_address",
    ],
  },
};
