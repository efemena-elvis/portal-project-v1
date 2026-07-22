const supportedCurrencies: {
  value: string;
  name: string;
  currency_description: string;
  image?: string;
}[] = [
  {
    value: "GHS",
    name: "Ghana (GHS)",
    currency_description: "Ghanaian Cedi",
    image: "https://flagsapi.com/GH/flat/64.png",
  },

  {
    value: "TZS",
    name: "Tanzania (TZS)",
    currency_description: "Tanzanian Shilling",
    image: "https://flagsapi.com/TZ/flat/64.png",
  },

  {
    value: "ZMW",
    name: "Zambia (ZMW)",
    currency_description: "Zambian Kwacha",
    image: "https://flagsapi.com/ZM/flat/64.png",
  },

  // {
  //   value: "NGN",
  //   name: "Nigeria (NGN)",
  //   currency_description: "Nigerian Naira",
  //   image: "https://flagsapi.com/NG/flat/64.png",
  // },
  // {
  //   value: "ZAR",
  //   name: "South Africa (ZAR)",
  //   currency_description: "South African Rand",
  //   image: "https://flagsapi.com/ZA/flat/64.png",
  // },
  // {
  //   value: "EGP",
  //   name: "Egypt (EGP)",
  //   currency_description: "Egyptian Pound",
  //   image: "https://flagsapi.com/EG/flat/64.png",
  // },
  // {
  //   value: "MAD",
  //   name: "Morocco (MAD)",
  //   currency_description: "Moroccan Dirham",
  //   image: "https://flagsapi.com/MA/flat/64.png",
  // },
  // {
  //   value: "KES",
  //   name: "Kenya (KES)",
  //   currency_description: "Kenyan Shilling",
  //   image: "https://flagsapi.com/KE/flat/64.png",
  // },

  // {
  //   value: "UGX",
  //   name: "Uganda (UGX)",
  //   currency_description: "Ugandan Shilling",
  //   image: "https://flagsapi.com/UG/flat/64.png",
  // },

  // {
  //   value: "RWF",
  //   name: "Rwanda (RWF)",
  //   currency_description: "Rwandan Franc",
  //   image: "https://flagsapi.com/RW/flat/64.png",
  // },

  // {
  //   value: "GBP",
  //   name: "United Kingdom (GBP)",
  //   currency_description: "Great British Pound",
  //   image: "https://flagsapi.com/GB/flat/64.png",
  // },
  // {
  //   value: "USD",
  //   name: "United States (USD)", {

  //   currency_description: "United States Dollar",
  //   image: "https://flagsapi.com/US/flat/64.png",
  // },
  // {
  //   value: "CAD",
  //   name: "Canada (CAD)",
  //   currency_description: "Canadian Dollar",
  //   image: "https://flagsapi.com/CA/flat/64.png",
  // },
];

export default supportedCurrencies;
