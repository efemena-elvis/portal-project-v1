// Country-to-Providers Mapping Type
type MobileMoneyProviders = Record<
  string,
  { name: string; pattern: RegExp; example: string }[]
>;

export const mobileMoneyProviders: MobileMoneyProviders = {
  Kenya: [
    {
      name: "M-Pesa",
      pattern: /^2547[0-9]{8}$/, // Kenyan numbers: 2547xxxxxxxx (10 digits after 254)
      example: "254712345678",
    },
    {
      name: "Airtel Money",
      pattern: /^2547[3-4]\d{7}$/, // 25473/25474 prefixes
      example: "254734567890",
    },
    {
      name: "Telkom T-Kash",
      pattern: /^25477\d{7}$/, // Telkom prefix 77
      example: "254771234567",
    },
  ],
  Ghana: [
    {
      name: "MTN Mobile Money",
      pattern: /^233(24|54|55)\d{7}$/, // MTN Ghana prefixes
      example: "233241234567",
    },
    {
      name: "Vodafone Cash",
      pattern: /^23320\d{7}$/, // Vodafone prefix 20
      example: "233201234567",
    },
    {
      name: "AirtelTigo Money",
      pattern: /^233(26|56)\d{7}$/, // AirtelTigo prefixes
      example: "233261234567",
    },
  ],
  Uganda: [
    {
      name: "MTN Mobile Money",
      pattern: /^2567(7|8)\d{7}$/, // MTN prefixes 77/78
      example: "256771234567",
    },
    {
      name: "Airtel Money",
      pattern: /^2567(0|5)\d{7}$/, // Airtel prefixes 70/75
      example: "256751234567",
    },
  ],
  Tanzania: [
    {
      name: "Tigo Pesa",
      pattern: /^2556(5|7)\d{7}$/, // Tigo prefixes 65/67
      example: "255651234567",
    },
    {
      name: "Airtel Money",
      pattern: /^2556(8|9)\d{7}$/, // Airtel prefixes 68/69
      example: "255681234567",
    },
    {
      name: "Vodacom M-Pesa",
      pattern: /^2557(4|5)\d{7}$/, // Vodacom prefixes 74/75
      example: "255741234567",
    },
  ],
  Rwanda: [
    {
      name: "MTN Mobile Money",
      pattern: /^2507(8|9)\d{7}$/, // MTN prefixes 78/79
      example: "250781234567",
    },
    {
      name: "Airtel Money",
      pattern: /^2507(2|3)\d{7}$/, // Airtel prefixes 72/73
      example: "250721234567",
    },
  ],
  Cameroon: [
    {
      name: "Orange Money",
      pattern: /^2376(9|7)\d{7}$/, // (?) Orange prefixes 69/67?
      example: "237691234567",
    },
    {
      name: "MTN Mobile Money",
      pattern: /^2376(5|6)\d{7}$/, // (?) MTN prefixes 65/66?
      example: "237651234567",
    },
  ],
  Senegal: [
    {
      name: "Orange Money",
      pattern: /^2217(7|6)\d{7}$/, // (?) Orange prefixes 77/76?
      example: "221771234567",
    },
    {
      name: "Free Money",
      pattern: /^2217(8|9)\d{7}$/, // (?) Free prefixes 78/79?
      example: "221781234567",
    },
    {
      name: "Wari",
      pattern: /^221\d{9}$/, // (?) Wari uses full phone numbers
      example: "221771234567",
    },
  ],
  "Ivory Coast": [
    {
      name: "Orange Money",
      pattern: /^225(07|08)\d{7}$/, // Orange CI prefixes 07/08
      example: "225071234567",
    },
    {
      name: "MTN Mobile Money",
      pattern: /^225(05|01)\d{7}$/, // MTN prefixes 05/01
      example: "225051234567",
    },
    {
      name: "Moov Money",
      pattern: /^225(04|06)\d{7}$/, // Moov prefixes 04/06
      example: "225041234567",
    },
  ],
  Zambia: [
    {
      name: "Airtel Money",
      pattern: /^26097\d{7}$/,
      example: "260971234567",
    },
    {
      name: "Zamtel Kwacha",
      pattern: /^26095\d{7}$/,
      example: "260951234567",
    },
    {
      name: "MTN Mobile Money",
      pattern: /^26096\d{7}$/,
      example: "260961234567",
    },
  ],
};
