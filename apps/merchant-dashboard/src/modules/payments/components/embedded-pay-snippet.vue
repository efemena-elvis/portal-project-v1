<template>
  <div class="developer-area p-6 max-w-4xl mx-auto">
    <div class="cdn-usage bg-gray-100 rounded-lg p-4">
      <h2 class="text-xl font-semibold mb-2">Integration Snippet</h2>
      <p class="mb-2">
        Copy the snippet below and replace <code>pk_live_xxx</code> with your
        actual publishable key:
      </p>

      <div class="bg-gray-200 rounded p-3 mb-4 overflow-x-auto">
        <pre class="text-sm">
&lt;script src="https://cdn.yourpayment.com/embed-pay-sdk.js"&gt;&lt;/script&gt;

&lt;!-- MODE A: DIRECT --&gt;
&lt;button
  data-identifier="embedded-pay-checkout"
  data-pk-key="pk_live_xxx"
  data-amount="45000"
  data-currency="NGN"
  data-description="Pro Plan"
  data-callback-url="/success"
  data-cancel-url="/cancel"
&gt;Pay ₦45,000&lt;/button&gt;

&lt;!-- MODE B: CART --&gt;
&lt;button
  data-cart-item
  data-amount="18000"
  data-description="Vessel"
&gt;Add to Cart&lt;/button&gt;

&lt;button
  data-identifier="embedded-pay-checkout"
  data-pk-key="pk_live_xxx"
  data-cart-total="true"
  data-currency="NGN"
  data-shipping="3500"
  data-tax="7.5"
  data-callback-url="/success"
  data-cancel-url="/cancel"
&gt;Checkout&lt;/button&gt;
        </pre>
        <button class="mt-2 btn btn-sm btn-secondary" @click="copyCDNSnippet">
          Copy Snippet
        </button>
      </div>

      <h2 class="text-xl font-semibold mb-2">Quick Notes</h2>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li>MODE A is for single payments or subscriptions.</li>
        <li>MODE B is for cart payments with multiple items.</li>
        <li>Amounts are in plain Naira — no kobo calculations needed.</li>
        <li>
          Optional events can be listened to via
          <code>window.addEventListener('embedpay:cart:update', ...)</code>.
        </li>
        <!-- <li>Refer to full documentation for advanced options: 
          <a href="https://developer.redstonepgs.com" target="_blank" class="text-blue-600 underline">
            EmbedPay Docs
          </a>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEvents } from "@packages/hooks";

const { pushToastAlert } = useEvents();

const cdnSnippet = `<script src="https://cdn.yourpayment.com/embed-pay-sdk.js"><\/script>

<!-- MODE A: DIRECT -->
<button
  data-identifier="embedded-pay-checkout"
  data-pk-key="pk_live_xxx"
  data-amount="45000"
  data-currency="NGN"
  data-description="Pro Plan"
  data-callback-url="/success"
  data-cancel-url="/cancel"
>Pay ₦45,000</button>

<!-- MODE B: CART -->
<button
  data-cart-item
  data-amount="18000"
  data-description="Vessel"
>Add to Cart</button>

<button
  data-identifier="embedded-pay-checkout"
  data-pk-key="pk_live_xxx"
  data-cart-total="true"
  data-currency="NGN"
  data-shipping="3500"
  data-tax="7.5"
  data-callback-url="/success"
  data-cancel-url="/cancel"
>Checkout</button>`;

const copyCDNSnippet = async () => {
  try {
    await navigator.clipboard.writeText(cdnSnippet);
    pushToastAlert({
      message: "Successful",
      description: "Snippet copied to clipboard!",
      type: "success",
    });
  } catch (error) {
    pushToastAlert({
      message: "Failed",
      description: "Failed to copy snippet",
      type: "error",
    });
  
  }
};
</script>

<style scoped lang="scss">
.cdn-usage {
  pre {
    font-family: Menlo, monospace;
  }

  a {
    text-decoration: underline;
  }
}
</style>
