<script setup lang="ts">
import { ref } from "vue";

type Tab = "js" | "react" | "vue" | "nextjs" | "wordpress" | "webflow";

const activeTab = ref<Tab>("js");

const tabs: { key: Tab; label: string }[] = [
  { key: "js", label: "JavaScript" },
  { key: "react", label: "React" },
  { key: "vue", label: "Vue" },
  { key: "nextjs", label: "Next.js" },
  { key: "wordpress", label: "WordPress" },
  { key: "webflow", label: "Webflow" },
];

const codeSnippets: Record<Tab, string> = {
  js: `<script
  src="https://cdn.vesicash.com/embedpay.js"
  data-key="pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  data-amount-var="cartTotal"
><\/script>

<div>Total: <span id="cart-total-display">₦0<\/span><\/div>

<button data-checkout data-narration="Order Payment">Proceed to Payment<\/button>

<script>
  var cartTotal = 0;

  function addToCart(price) {
    cartTotal += price;
    document.getElementById('cart-total-display').textContent =
      '₦' + cartTotal.toLocaleString();
  }
<\/script>`,

  react: `import { EmbedPayButton } from '@vesicash/embedpay-react';
import { useState } from 'react';

export default function CheckoutPage() {
  const [cartTotal, setCartTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <div>
      <p>Total: ₦{cartTotal.toLocaleString()}<\/p>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}<\/p>}

      <EmbedPayButton
        publishableKey="pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        amount={cartTotal}
        narration="My Store Order"
        onError={setErrorMsg}
      >
        Proceed to Payment
      <\/EmbedPayButton>
    <\/div>
  );
}`,

  vue: `<script setup>
import { ref } from 'vue';
import { EmbedPayButton } from '@vesicash/embedpay-vue';

const cartTotal = ref(0);
const errorMsg = ref('');
<\/script>

<template>
  <div>
    <p>Total: ₦{{ cartTotal.toLocaleString() }}<\/p>

    <p v-if="errorMsg" style="color: red">{{ errorMsg }}<\/p>

    <EmbedPayButton
      :publishable-key="'pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'"
      :amount="cartTotal"
      narration="My Store Order"
      @error="(msg) => errorMsg = msg"
    >
      Proceed to Payment
    <\/EmbedPayButton>
  <\/div>
<\/template>`,

  nextjs: `'use client';

import { EmbedPayButton } from '@vesicash/embedpay-react';
import { useState } from 'react';

export default function CheckoutPage() {
  const [cartTotal, setCartTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <div>
      <p>Total: ₦{cartTotal.toLocaleString()}<\/p>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}<\/p>}

      <EmbedPayButton
        publishableKey="pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        amount={cartTotal}
        narration="My Store Order"
        onError={setErrorMsg}
      >
        Proceed to Payment
      <\/EmbedPayButton>
    <\/div>
  );
}`,

wordpress: `METHOD 1: Shortcode (Recommended)

[embedpay_button amount="5000"]Pay Now[/embedpay_button]

Dynamic Amount Example

[embedpay_button amount_from="#price-input"]Pay Now[/embedpay_button]

Full Configuration Example

[embedpay_button
  amount="10000"
  narration="Product Purchase"
  label="Buy Now"
  currency="NGN"
  method="card"
  callback="https://yoursite.com/success"
  cancel="https://yoursite.com/cancel"
  checkout_url="/checkout"
  force_mock="true"
]

METHOD 2: JavaScript SDK (Advanced Users)

<script src="https://cdn.vesicash.com/embedpay.js"><\/script>

<script>
window.EMBEDPAY = {
  key: "pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  currency: 'NGN',
  narration: 'Order Payment',
  method: 'card',
  callback: 'https://yoursite.com/success',
  cancel: 'https://yoursite.com/cancel',
  forceMock: false
};
<\/script>

<button
  data-checkout
  data-amount-from="#amount-input"
  data-narration="Order Payment"
>
  Pay Now
<\/button>

METHOD 3: WooCommerce

1. Install EmbedPay WooCommerce Gateway plugin
2. Go to WooCommerce Settings Payments
3. Enable EmbedPay by Vesicash
4. Add your Publishable Key
5. Done appears automatically on checkout

METHOD 4: Plugin Setup

1. Upload embedpay plugin to wp-content/plugins/
2. Activate plugin
3. Go to Settings EmbedPay
4. Add your Publishable Key and configure options

METHOD 5: Elementor

1. Install Elementor EmbedPay Widget plugin
2. Drag EmbedPay Button widget into page
3. Configure amount narration and callbacks
`,
};

import { useEvents } from "@packages/hooks";

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
  <div class="max-w-4xl py-12">

    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        Embedded Payment User Guide
      </h1>
      <p class="text-gray-600 mt-2">Choose your preferred integration method</p>
    </div>

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

   
    <div class="bg-gray-900 rounded-xl p-4 relative">
      <pre class="overflow-x-auto text-sm text-gray-100">
<code>{{ codeSnippets[activeTab] }}</code>
      </pre>

  
      <button
        @click="copyToClipboard(codeSnippets[activeTab])"
        class="absolute top-3 right-3 text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
      >
        Copy
      </button>
    </div>

   
    <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h2 class="text-lg font-semibold text-blue-900 mb-3">Implementation Notes</h2>
      <div class="space-y-2 text-sm text-blue-800">
        <div v-if="activeTab === 'js'">
          <p><strong>Plain JavaScript:</strong> No installation needed. Just add the script tag and mark your button with <code>data-checkout</code>.</p>
          <p class="mt-2">Replace <code>cartTotal</code> with your JavaScript variable name that holds the amount.</p>
        </div>
        <div v-else-if="activeTab === 'react'">
          <p><strong>React:</strong> Install package first: <code>npm install @vesicash/embedpay-react</code></p>
          <p class="mt-2">The component handles all security checks and amount validation automatically.</p>
        </div>
        <div v-else-if="activeTab === 'vue'">
          <p><strong>Vue 3:</strong> Install package first: <code>npm install @vesicash/embedpay-vue</code></p>
          <p class="mt-2">Remember to use <code>:amount</code> and <code>:publishable-key</code> with the colon for prop binding.</p>
        </div>
        <div v-else-if="activeTab === 'nextjs'">
          <p><strong>Next.js:</strong> Always add <code>'use client'</code> directive at the top since EmbedPay runs only in the browser.</p>
          <p class="mt-2">Works with both App Router and Pages Router. Use it like a regular React component.</p>
          <p class="mt-2">Package: <code>npm install @vesicash/embedpay-react</code></p>
        </div>
        <div v-else-if="activeTab === 'wordpress'">
          <p><strong>WordPress:</strong> Download the plugin from your dashboard and upload it via WordPress Admin.</p>
          <p class="mt-2">• <strong>WooCommerce:</strong> Auto-detects and adds button to cart (no extra config needed)</p>
          <p class="mt-2">• <strong>Non-WooCommerce:</strong> Use the shortcode or Gutenberg block on any page/post</p>
          <p class="mt-2">Go to <strong>Settings → EmbedPay</strong> to configure your Publishable Key and payment settings.</p>
        </div>
        <div v-else-if="activeTab === 'webflow'">
          <p><strong>Webflow:</strong> Add the script to Project Settings → Custom Code section.</p>
          <p class="mt-2">Mark your button with <code>data-checkout</code> attribute via Element Settings → Custom Attributes.</p>
          <p class="mt-2">Set <code>window.cartTotal</code> in your Webflow interactions or custom code.</p>
        </div>
      </div>
    </div>

 
    <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 class="text-sm font-semibold text-green-900 mb-2">⚡ Quick Start</h3>
      <ul class="text-sm text-green-800 space-y-1">
        <li>✓ Get your <strong>Publishable Key</strong> from the dashboard</li>
        <li>✓ Copy the code snippet for your platform</li>
        <li>✓ Replace the key placeholder with your actual key</li>
        <li>✓ Test with a test amount first</li>
      </ul>
    </div>
  </div>
</template>
