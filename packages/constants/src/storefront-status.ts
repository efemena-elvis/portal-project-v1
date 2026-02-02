 const orderStatuses = [
  {
    id: 1,
    name: "Preparing Order",
    description: "The order is being packed or prepared for dispatch.",
  },
  {
    id: 2,
    name: "Ready for Pickup",
    description:
      "The order is ready for customer collection at the specified location.",
  },
  {
    id: 3,
    name: "Awaiting Pickup by Carrier",
    description:
      "The package is prepared and waiting for the carrier to collect it.",
  },
  {
    id: 4,
    name: "Out for Delivery",
    description: "The order is currently on its way to the customer.",
  },
  {
    id: 5,
    name: "Delivered",
    description: "The customer has successfully received the order.",
  },
  {
    id: 6,
    name: "Cancelled",
    description: "The order was cancelled before or during processing.",
  },
];

export default orderStatuses;