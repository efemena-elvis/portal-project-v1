<script setup lang="ts">
import { ref } from "vue";

type Tab = "js" | "react" | "vue" | "nocode";

const activeTab = ref<Tab>("js");

const tabs: { key: Tab; label: string }[] = [
  { key: "js", label: "JavaScript" },
  { key: "react", label: "React" },
  { key: "vue", label: "Vue" },
  { key: "nocode", label: "No-Code" },
];

const codeSnippets: Record<Tab, string> = {
  js: `<script src="https://cdn.yoursdk.com/sdk.js"><\/script>

<button onclick="pay()">Pay Now</button>

<script>
function pay() {
  const sdk = new PaymentSDK({
    publishableKey: "pk_test_xxx"
  });

  sdk.open({
    amount: 5000,
    currency: "NGN",
    customer: { email: "user@email.com" },
    onSuccess: (res) => console.log(res)
  });
}
<\/script>`,

  react: `import { usePayment } from "your-payment-sdk";

export default function App() {
  const { openPayment } = usePayment();

  return (
    <button onClick={() => openPayment({
      publishableKey: "pk_test_xxx",
      amount: 5000,
      currency: "NGN",
      customer: { email: "user@email.com" }
    })}>
      Pay Now
    </button>
  );
}`,

  vue: `<script setup>
import { usePayment } from "your-payment-sdk";

const { openPayment } = usePayment();

const pay = () => {
  openPayment({
    publishableKey: "pk_test_xxx",
    amount: 5000,
    currency: "NGN",
    customer: { email: "user@email.com" }
  });
};
<\/script>

<template>
  <button @click="pay">Pay Now</button>
<\/template>
`,
  nocode: `
<script src="https://cdn.yoursdk.com/sdk.js">
<\/script>

<button onclick="pay()">Pay Now</button>

<script>
function pay() {
  const sdk = new PaymentSDK({
    publishableKey: "pk_test_xxx"
  });

  sdk.open({
    amount: 5000,
    currency: "NGN",
    customer: { email: "user@email.com" }
  });
}
<\/script>`,
};

import { useEvents } from '@packages/hooks';

const { pushToastAlert } = useEvents();

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    pushToastAlert({
      type: "success",
      message: "Copied to clipboard",
    });
  } catch (e) {
    console.error("Copy failed");
  }
};
</script>

<template>
  <div class="max-w-4xl px-12 pb-4">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Embedded Payment SDK</h1>
      <p class="text-gray-600 mt-2">Choose your preferred integration method</p>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-4 py-2 rounded-lg text-sm font-medium transition"
        :class="
          activeTab === tab.key
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Code Block -->
    <div class="bg-gray-900 rounded-xl p-4 relative">
      <pre class="overflow-x-auto text-sm text-gray-100">
<code>{{ codeSnippets[activeTab] }}</code>
      </pre>

      <!-- Copy Button -->
      <button
        @click="copyToClipboard(codeSnippets[activeTab])"
        class="absolute top-3 right-3 text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
      >
        Copy
      </button>
    </div>
  </div>
</template>
