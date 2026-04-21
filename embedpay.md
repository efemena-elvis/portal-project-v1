# EmbedPay Integration Guide

Add payment checkout to your website in minutes, without building a payment system from scratch.

---

## 1. What is EmbedPay?

EmbedPay is a payment tool you add to your existing website. When a customer clicks your checkout button, EmbedPay opens a secure payment page, collects their card or mobile money details, and sends them back to your site when done.

You do not need to:
- Build a payment form
- Handle card numbers
- Set up a payment gateway yourself

You only need to:
1. Create an EmbedPay account and get a key
2. Add a small snippet of code to your website
3. Mark your checkout button with one attribute (or use the component)

---

## 2. Before You Start — Getting Your Key

Every EmbedPay integration starts with a **publishable key**. This is a unique code that identifies your account.

### Publishable Key Format

EmbedPay keys follow this format:
```
pk_[env]_[provider]_[merchantHash]_[randomBytes]
```

| Segment | Description | Example |
|---------|-------------|---------|
| `pk` | Always "pk" (publishable key) | `pk` |
| `env` | Environment: `live` or `test` | `live`, `test` |
| `provider` | Payment provider slug | `vesicash`, `demo` |
| `merchantHash` | First 8 chars of your merchant ID hash | `a1b2c3d4` |
| `randomBytes` | Unique identifier | `X9mKpRqWnBzDhVsTyUeJcFgLiAoNwE2rP` |

**Examples:**
- `pk_live_vesicash_a1b2c3d4_X9mKpRqWnBzDhVsTyUeJcFgLiAoNwE2rP` — Live Vesicash key
- `pk_test_demo_00000000_DMoJdEm0SaNdBoXkEyIsHaRdCoDeD1234AbCd` — Demo/test key

### Steps to get your key:

1. Go to [dashboard.vesicash.com](https://dashboard.vesicash.com) and sign in
2. Click **API Keys** in the left menu
3. Click **Create New Key**
4. Fill in the form:

| Field | What to enter | Example |
|-------|--------------|---------|
| **Name** | A label for yourself (not shown to customers) | "My Store" |
| **Currency** | The currency you accept | NGN |
| **Payment Method** | How customers pay | Card |
| **Callback URL** | Where to send the customer after payment | `https://mystore.com/thank-you` |
| **Cancel URL** | Where to send the customer if they cancel | `https://mystore.com/cart` |
| **Narration** | What appears on the payment screen | "Store order" |
| **Allowed Domains** | Your website address | `mystore.com` |
| **Webhook URL** | URL to send webhook notifications to | `https://mystore.com/webhook` | (optional)

5. Click **Create Key**
6. Copy the key

> **Keep this key safe.** It is a publishable key, which means it is safe to include in your website code. Do not share the secret key (a different key shown elsewhere in your dashboard).

---

## 3. How EmbedPay Works (The Short Version)

Here is what happens from start to finish when a customer pays:

```
1. Customer browses your site and adds products
2. Customer clicks your checkout button
3. EmbedPay checks the total amount is valid and has not been tampered with
4. EmbedPay opens a secure payment page
5. Customer enters their payment details
6. Payment is processed
7. Customer is sent to your Callback URL
8. EmbedPay sends a notification to your server (optional but recommended)
```

EmbedPay **does not** manage your cart or your products. It only handles the payment step. Your website continues to manage everything else exactly as it does today.

---

## 4. Setup Guide A — Plain HTML/JS Website

Use this guide if your website is built with plain HTML files, or if you use a tool like Webflow, Framer, or Squarespace that lets you add custom HTML.

**You need to add two things to your page:**

---

### Step 1 — Add the EmbedPay script to your page

Copy this code and paste it inside the `<head>` section of your HTML file.

```html
<script
  src="https://cdn.vesicash.com/embedpay.js"
  data-key="YOUR_PUBLISHABLE_KEY"
  data-amount-var="cartTotal"
></script>
```

Replace `YOUR_PUBLISHABLE_KEY` with your actual key from the dashboard.

Replace `cartTotal` with the name of the JavaScript variable in your code that holds the cart or payment total.

> **What is a JavaScript variable?** It is a named value in your code.
> For example, if your site has `var total = 0;` somewhere in a script,
> then `total` is the variable name. You would write `data-amount-var="total"`.

**If you do not have a JavaScript variable** and your site shows the total in an HTML element (like a `<div>` or `<span>`), use this version instead:

```html
<script
  src="https://cdn.vesicash.com/embedpay.js"
  data-key="YOUR_PUBLISHABLE_KEY"
  data-amount-from="#cart-total"
></script>
```

Replace `#cart-total` with the CSS selector of the element that shows your total.
For example, if your total element has `id="order-total"`, write `data-amount-from="#order-total"`.

---

### Step 2 — Mark your checkout button

Find your existing checkout button in your HTML. Add `data-checkout` to it.

**Before:**
```html
<button>Proceed to Payment</button>
```

**After:**
```html
<button data-checkout>Proceed to Payment</button>
```

That is the only change to your button. You keep your existing button label and styles.

**Optional — override the payment narration for this specific button:**
```html
<button data-checkout data-narration="Summer Sale Order">Proceed to Payment</button>
```

**Optional — force mock mode for testing (even with a test key):**
```html
<button data-checkout data-force-mock="true">Proceed to Payment</button>
```

---

### Alternative: Global Configuration via Window Object

Instead of using script tag attributes, you can configure EmbedPay via the global `window.EMBEDPAY` object:

```html
<script>
  window.EMBEDPAY = {
    key: 'pk_test_demo_00000000_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    amountVar: 'cartTotal',
    forceMock: false
  };
</script>
<script src="https://cdn.vesicash.com/embedpay.js"></script>
```

---

### Complete Example

Here is a minimal working page showing both pieces together:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Step 1: EmbedPay script -->
  <script
    src="https://cdn.vesicash.com/embedpay.js"
    data-key="pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    data-amount-var="cartTotal"
  ></script>
</head>
<body>

  <!-- Your cart total, managed however you like -->
  <div>Total: <span id="cart-total-display">₦0</span></div>

  <!-- Step 2: Your checkout button with data-checkout added -->
  <button data-checkout data-narration="Order Payment">Proceed to Payment</button>

  <script>
    // Your cart logic — EmbedPay reads "cartTotal" from here
    var cartTotal = 0;

    function addToCart(price) {
      cartTotal += price;
      document.getElementById('cart-total-display').textContent =
        '₦' + cartTotal.toLocaleString();
    }
  </script>

</body>
</html>
```

**Webflow users:** Paste the script tag into Project Settings → Custom Code → Before `</head>`. Add `data-checkout` to your button via the Element Settings → Custom Attributes panel.

---

## 5. Setup Guide B — React App

Use this guide if your website is built with React (including Next.js).

**You need to do two things:**

---

### Step 1 — Install the EmbedPay package

Open your terminal in your project folder and run:

```bash
npm install @vesicash/embedpay-react
```

---

### Step 2 — Use the EmbedPayButton component

In the file where your checkout button lives, import and use `<EmbedPayButton>`.

**Before (your existing code):**
```jsx
<button onClick={handleCheckout}>Proceed to Payment</button>
```

**After (with EmbedPay):**
```jsx
import { EmbedPayButton } from '@vesicash/embedpay-react';

<EmbedPayButton
  publishableKey="pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  amount={cartTotal}
  narration="Store order"
  onError={(message) => alert(message)}
>
  Proceed to Payment
</EmbedPayButton>
```

Replace `cartTotal` with whatever variable or state value holds your total.

---

### What each prop does

| Prop | Required | Type | Description |
|------|----------|------|-------------|
| `publishableKey` | Yes | string | Your publishable key from the dashboard |
| `amount` | Yes | number | The total amount to charge (number, in base currency e.g. 5000 for ₦5,000) |
| `narration` | No | string | Override the payment description shown on the checkout screen |
| `checkoutUrl` | No | string | URL path to your checkout page (default: `/checkout`) |
| `forceMock` | No | boolean | Force mock/demo mode even with test keys |
| `onError` | No | function | Called when something goes wrong — use it to show the error to your user |
| `children` | No | ReactNode | Button label/content (default: "Proceed to Payment") |
| `className` | No | string | CSS class names for styling |

All other settings (currency, method, callback URL, cancel URL) come from your key's dashboard configuration automatically.

The component accepts all standard button HTML attributes (like `className`, `style`, `disabled`, etc.).

---

### Complete Example (React)

```jsx
// CheckoutPage.jsx
import { useState } from 'react';
import { EmbedPayButton } from '@vesicash/embedpay-react';

export default function CheckoutPage() {
  const [cartTotal, setCartTotal] = useState(0);
  const [errorMsg,  setErrorMsg]  = useState('');

  return (
    <div>
      <p>Total: ₦{cartTotal.toLocaleString()}</p>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      <EmbedPayButton
        publishableKey="pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        amount={cartTotal}
        narration="My Store Order"
        onError={setErrorMsg}
      >
        Proceed to Payment
      </EmbedPayButton>
    </div>
  );
}
```

The button handles everything else — including security checks on the amount and opening the checkout page.

---

### Using the useEmbedPay Hook (Advanced)

For programmatic control, use the `useEmbedPay` hook:

```jsx
import { useEmbedPay } from '@vesicash/embedpay-react';

function MyComponent() {
  const { init, checkout } = useEmbedPay({
    publishableKey: 'pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    checkoutUrl: '/checkout'
  });

  // Initialize when your component mounts
  useEffect(() => {
    init(() => cartTotal); // Pass a getter function for the amount
  }, []);

  // Call checkout when ready
  const handlePayment = async () => {
    try {
      await checkout(cartTotal, 'Custom narration');
    } catch (err) {
      console.error('Payment failed:', err.message);
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
}
```

**Next.js users:** If using server-side rendering, add `'use client'` at the top of the file containing `<EmbedPayButton>`.

---

## 6. Setup Guide C — Vue App

Use this guide if your website is built with Vue 3.

---

### Step 1 — Install the EmbedPay package

```bash
npm install @vesicash/embedpay-vue
```

---

### Step 2 — Use the EmbedPayButton component

```vue
<script setup>
import { ref } from 'vue';
import { EmbedPayButton } from '@vesicash/embedpay-vue';

const cartTotal = ref(0);
const errorMsg  = ref('');
</script>

<template>
  <div>
    <p>Total: ₦{{ cartTotal.toLocaleString() }}</p>

    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>

    <EmbedPayButton
      :publishable-key="'pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'"
      :amount="cartTotal"
      narration="My Store Order"
      @error="(msg) => errorMsg = msg"
    >
      Proceed to Payment
    </EmbedPayButton>
  </div>
</template>
```

> **Note the colon before props:** In Vue, `:amount="cartTotal"` means
> "bind this prop to the variable called cartTotal". Without the colon,
> Vue would treat it as a plain text string. Always use `:publishable-key` and `:amount` 
> when passing variables.

---

### What each prop does (Vue)

| Prop | Required | Type | Description |
|------|----------|------|-------------|
| `:publishable-key` | Yes | string | Your publishable key from the dashboard |
| `:amount` | Yes | number | The total amount (reactive — updates automatically as your total changes) |
| `narration` | No | string | Override the payment description |
| `checkout-url` | No | string | URL path to your checkout page (default: `/checkout`) |
| `:force-mock` | No | boolean | Force mock/demo mode even with test keys |
| `@error` | No | event | Fired when something goes wrong — use it to show the error |

---

### Using the useEmbedPay Composable (Advanced)

For programmatic control, use the `useEmbedPay` composable:

```vue
<script setup>
import { useEmbedPay } from '@vesicash/embedpay-vue';
import { computed } from 'vue';

const cartItems = ref([]);
const cartTotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price, 0));

const { isReady, init, checkout } = useEmbedPay({
  publishableKey: 'pk_live_vesicash_a1b2c3d4_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});

// Initialize on mount
onMounted(async () => {
  await init(() => cartTotal.value);
});

// Handle payment
const handlePayment = async () => {
  try {
    await checkout(cartTotal.value, 'Custom narration');
  } catch (err) {
    console.error('Payment failed:', err.message);
  }
};
</script>

<template>
  <button @click="handlePayment" :disabled="!isReady">
    Pay ₦{{ cartTotal.toLocaleString() }}
  </button>
</template>
```

---

## 7. Setup Guide D — WordPress

Use this guide if your site runs on WordPress, with or without WooCommerce. EmbedPay offers four installation methods to suit different needs.

---

### Overview: Choosing the Right Method

| Method | Best For | WooCommerce Required | Elementor Required | Technical Level |
|--------|----------|---------------------|-------------------|-----------------|
| **Standard Plugin ZIP** | Most merchants | No | No | Beginner |
| **Must-Use (MU) Plugin** | Developers, multi-site | No | No | Advanced |
| **WooCommerce Gateway** | WooCommerce stores | Yes | No | Intermediate |
| **Elementor Widget** | Elementor page builders | No | Yes | Beginner |

---

## Method 1: Standard Plugin ZIP (Recommended)

The easiest way to add EmbedPay to any WordPress site. Works automatically with WooCommerce and includes a Gutenberg block and shortcode for non-WooCommerce sites.

### Installation

1. Download `embedpay-v1.1.0.zip` from your Vesicash dashboard
2. Go to your WordPress Admin → **Plugins → Add New**
3. Click **Upload Plugin** and select the ZIP file
4. Click **Install Now**, then **Activate**

### Configuration

1. Go to **Settings → EmbedPay**
2. Paste your **Publishable Key** (from the Vesicash dashboard)
3. Configure optional settings:
   - **Currency**: Override default (NGN, USD, GHS)
   - **Payment Method**: Restrict to card or mobile money
   - **Checkout URL**: Path for demo mode (default: /checkout)
   - **Callback URL**: Success redirect URL
   - **Cancel URL**: Cancel redirect URL
   - **Default Narration**: Payment description
   - **Force Mock Mode**: Enable sandbox for testing
4. Click **Save Settings**

### Usage with WooCommerce

Once configured, the plugin automatically:
- Detects WooCommerce and injects a checkout button on the cart page
- Reads cart totals in real-time (updates as items are added/removed)
- Uses your configured narration for payment descriptions

No additional setup required.

### Usage without WooCommerce

#### Option A: Gutenberg Block

1. Edit any page or post
2. Click the **+** icon to add a block
3. Search for **"EmbedPay Checkout Button"**
4. Configure in the right panel:
   - **Amount Selector**: CSS selector of element showing total (e.g., `#total-price`)
   - **Button Label**: Text displayed on button
   - **Narration**: Payment description override

#### Option B: Shortcode

Add the shortcode to any page, post, or widget area:

**Dynamic amount (from page element):**
```
[embedpay_button amount_from="#my-total"]Checkout[/embedpay_button]
```

**Fixed amount:**
```
[embedpay_button amount="5000" narration="Monthly membership"]Subscribe Now[/embedpay_button]
```

### Shortcode Attributes Reference

| Attribute | Required | Description | Example |
|-----------|----------|-------------|---------|
| `amount` | No* | Fixed amount in smallest currency unit | `5000` |
| `amount_from` | No* | CSS selector to read amount dynamically | `#total-price` |
| `narration` | No | Payment description | `Store order` |
| `label` | No | Button text (ignored if content provided) | `Pay Now` |
| `checkout_url` | No | Checkout page URL for demo mode | `/checkout` |
| `force_mock` | No | Force sandbox mode | `true` |
| `callback` | No | Success redirect URL | `https://yoursite.com/thank-you` |
| `cancel` | No | Cancel redirect URL | `https://yoursite.com/cart` |
| `currency` | No | Currency override | `NGN`, `USD` |

*Use either `amount` or `amount_from`, not both.

---

## Method 2: Must-Use (MU) Plugin

A single-file plugin that loads before regular plugins. Ideal for developers, multi-site networks, and sites where you want to prevent accidental deactivation.

### What It Is

- Runs from `wp-content/mu-plugins/` directory
- Loads before regular plugins (cannot be deactivated from admin)
- Perfect for client sites and WordPress multisite networks
- Configurable via PHP constants or admin settings

### Installation

1. Download `embedpay-mu.php`
2. Create the directory `wp-content/mu-plugins/` if it doesn't exist
3. Upload `embedpay-mu.php` to `wp-content/mu-plugins/`
4. No activation needed — it loads automatically

### Configuration

#### Option A: PHP Constants (Recommended for Developers)

Edit the file directly to set defaults:

```php
define('EMBEDPAY_PK_KEY', 'pk_live_vesicash_a1b2c3d4_...');
define('EMBEDPAY_CURRENCY', 'NGN');
define('EMBEDPAY_METHOD', ''); // card, mobile-money, or empty
define('EMBEDPAY_CHECKOUT_URL', '/checkout');
define('EMBEDPAY_CALLBACK_URL', 'https://yoursite.com/thank-you');
define('EMBEDPAY_CANCEL_URL', 'https://yoursite.com/cart');
define('EMBEDPAY_NARRATION', 'Store order');
define('EMBEDPAY_FORCE_MOCK', false);
```

#### Option B: Admin Settings (Merchant-Friendly)

1. Go to **Settings → EmbedPay**
2. Configure the same options through the UI
3. Settings are stored in the database and override PHP constants

### Features

- **Shortcode**: `[embedpay_button]` with full attribute support
- **WooCommerce Integration**: Auto-detects and adds button to cart
- **Template Function**: `embedpay_mu_render_button()` for theme developers
- **Config Check**: `embedpay_mu_is_configured()` to verify setup

### Shortcode Example

```
[embedpay_button amount="10000" narration="Service fee" currency="NGN"]
    Pay Service Fee
[/embedpay_button]
```

---

## Method 3: WooCommerce Custom Gateway

A dedicated WooCommerce payment gateway that integrates EmbedPay into the standard WooCommerce checkout flow. Best for stores wanting EmbedPay as a primary payment option.

### What It Is

- Appears as a payment option in WooCommerce checkout
- Follows standard WooCommerce payment flow
- Supports order status tracking
- Includes payment verification handling

### Installation

1. Download `embedpay-wc-gateway.php`
2. Upload to `wp-content/plugins/`
3. Go to **Plugins** and activate "EmbedPay — WooCommerce Payment Gateway"
4. WooCommerce must be installed and active

### Configuration

1. Go to **WooCommerce → Settings → Payments**
2. Click **EmbedPay by Vesicash**
3. Enable the gateway and configure:
   - **Title**: Customer-facing name (default: "Pay with EmbedPay")
   - **Description**: Payment method description
   - **Publishable Key**: Your EmbedPay key
   - **Currency**: Optional override
   - **Payment Method**: Card, mobile money, or dashboard default
   - **Default Narration**: Order payment description
   - **Checkout URL**: Demo mode path
   - **Callback URL**: Success redirect
   - **Cancel URL**: Cancel redirect
   - **Force Mock Mode**: Enable sandbox testing
4. Click **Save changes**

### How the Payment Flow Works

1. Customer selects "Pay with EmbedPay" at checkout
2. Order is created with "pending" status
3. Customer clicks the EmbedPay payment button
4. Payment is processed via Vesicash
5. Order status updates to "processing" or "completed"
6. Customer is redirected to the thank-you page

### Payment Verification

The gateway includes an AJAX handler for payment verification:
- Transaction ID is recorded with the order
- Order notes include EmbedPay transaction details
- Webhook support can be extended for server-side verification

---

## Method 4: Elementor Widget

A native Elementor widget for drag-and-drop EmbedPay button placement. Perfect for sites built with Elementor page builder.

### What It Is

- Native Elementor widget (no coding required)
- Visual configuration in Elementor editor
- Supports both fixed and dynamic amounts
- Full styling control through Elementor

### Installation

1. Download `embedpay-elementor-widget.php`
2. Upload to `wp-content/plugins/`
3. Go to **Plugins** and activate "EmbedPay — Elementor Widget"
4. Elementor must be installed and active

### Global Settings

1. Go to **Settings → EmbedPay Elementor**
2. Set your **Publishable Key**
3. Configure defaults:
   - **Default Currency**: NGN, USD, GHS
   - **Default Method**: Card, mobile money, or dashboard default
   - **Default Narration**: Payment description
   - **Force Mock Mode**: Enable for testing

### Using the Widget

1. Open any page with Elementor
2. Search for **"EmbedPay Button"** in the widget panel
3. Drag it to your desired location
4. Configure in the **Content** tab:
   - **Button Text**: Display text (default: "Pay Now")
   - **Amount**: Fixed amount (leave empty for dynamic)
   - **Amount From Selector**: CSS selector for dynamic amounts (e.g., `#price`)
   - **Narration**: Payment description
   - **Currency**: Override default currency
   - **Payment Method**: Card, mobile money, or default
   - **Callback URL**: Success redirect
   - **Cancel URL**: Cancel redirect
   - **Force Mock Mode**: Enable sandbox
5. Style in the **Style** tab:
   - **Alignment**: Left, center, or right

### Widget Settings Reference

| Setting | Type | Description |
|---------|------|-------------|
| Button Text | Text | Label displayed on button |
| Amount | Number | Fixed amount (smallest currency unit) |
| Amount From Selector | Text | CSS selector to read dynamic amount |
| Narration | Text | Payment description |
| Currency | Text | NGN, USD, GHS |
| Payment Method | Select | Card, mobile money, or default |
| Callback URL | URL | Success redirect page |
| Cancel URL | URL | Cancel redirect page |
| Force Mock Mode | Switcher | Enable sandbox mode |
| Alignment | Choose | Left, center, or right alignment |

---

## WordPress Troubleshooting

### Plugin Upload Fails

**Problem**: "The package could not be installed" or "No valid plugins were found"

**Solutions**:
1. Ensure you're uploading the correct ZIP file (not the folder containing it)
2. Try uploading via FTP instead:
   - Extract the ZIP locally
   - Upload the `embedpay` folder to `wp-content/plugins/`
3. Check PHP version: Requires PHP 7.4 or higher
4. Verify file permissions on `wp-content/plugins/` directory

### Button Not Appearing

**Problem**: Checkout button doesn't show on the page

**Solutions**:
1. **Verify Publishable Key**: Check that a valid key is configured in settings
2. **Check Console Errors**: Open browser DevTools → Console for JavaScript errors
3. **Confirm WooCommerce**: If using WooCommerce, ensure it's active and cart has items
4. **Elementor Cache**: Clear Elementor cache (Elementor → Tools → Regenerate CSS)
5. **Page Cache**: Clear any caching plugin or CDN cache

### Amount Not Detected

**Problem**: Button shows but amount is wrong or zero

**Solutions**:
1. **Check Selector**: Verify `amount_from` selector matches an element on the page
2. **Numeric Format**: Ensure the target element contains only numbers (no currency symbols)
3. **Timing Issue**: If using dynamic loading, the element might not exist when EmbedPay loads
4. **WooCommerce Cart**: Check that cart items have prices set

### WooCommerce Conflicts

**Problem**: Issues with other WooCommerce plugins or themes

**Solutions**:
1. **Theme Compatibility**: Switch to a default theme (Twenty Twenty-Four) to test
2. **Plugin Conflicts**: Disable other payment plugins one by one
3. **Checkout Hooks**: If using MU plugin or Gateway, check if other plugins are modifying `woocommerce_proceed_to_checkout`
4. **Script Loading**: Ensure no other plugins are blocking the EmbedPay CDN script

### Getting Help

If issues persist:
1. Check the [Vesicash Help Center](https://vesicash.com/help)
2. Contact support with your WordPress version, active plugins list, and error messages
3. Enable mock mode to test without real transactions

---

## 8. Configuration Reference

### Script Tag Attributes (HTML/JS only)

| Attribute | Required | Description | Example |
|-----------|----------|-------------|---------|
| `data-key` | Yes | Your publishable key | `pk_live_vesicash_a1b2c3d4_XXX` |
| `data-amount-var` | One of these | Name of JS variable holding total | `cartTotal` |
| `data-amount-from` | One of these | CSS selector of element showing total | `#order-total` |
| `data-checkout-url` | No | URL to checkout page | `/checkout` |
| `data-force-mock` | No | Force mock mode for testing | `true` or `false` |
| `data-narration` | No | Default narration override | `Store order` |
| `data-currency` | No | Currency override | `NGN`, `USD` |
| `data-method` | No | Payment method override | `card`, `mobile-money` |
| `data-callback` | No | Success URL override | `https://mysite.com/success` |
| `data-cancel` | No | Cancel URL override | `https://mysite.com/cancel` |

### Window.EMBEDPAY Object (Alternative to attributes)

```javascript
window.EMBEDPAY = {
  key: 'pk_live_vesicash_a1b2c3d4_XXX',      // Required
  amountVar: 'cartTotal',                     // or amountFrom
  amountFrom: '#cart-total',                  // or amountVar
  checkoutUrl: '/checkout',                   // Optional
  forceMock: false,                           // Optional
  narration: 'Store order',                   // Optional
  currency: 'NGN',                            // Optional
  method: 'card',                             // Optional
  callback: 'https://mysite.com/success',     // Optional
  cancel: 'https://mysite.com/cancel'         // Optional
};
```

### Button Attributes (HTML/JS only)

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-checkout` | Yes | Marks this button as the checkout trigger |
| `data-narration` | No | Override narration for this button only |
| `data-key` | No | Use a different key for this button |
| `data-force-mock` | No | Force mock mode for this button |

### EmbedPayButton Props (React/Vue)

| Prop | Required | Type | Description |
|------|----------|------|-------------|
| `publishableKey` / `:publishable-key` | Yes | string | Your publishable key |
| `amount` / `:amount` | Yes | number | Total in base currency units (e.g. 5000 = ₦5,000) |
| `narration` | No | string | Payment description override |
| `checkoutUrl` / `checkout-url` | No | string | URL path to checkout page |
| `forceMock` / `:force-mock` | No | boolean | Force mock/demo mode |
| `onError` / `@error` | No | function | Error callback |
| `currency` | No | string | Currency override |
| `method` | No | string | Payment method override |
| `callback` | No | string | Success URL override |
| `cancel` | No | string | Cancel URL override |
| `children` / slot | No | ReactNode/string | Button label |
| `className` / `class` | No | string | CSS class names |

### Dashboard Configuration (applies to all paths)

These settings are configured in the EmbedPay dashboard per key —
you do not write them in your code:

| Setting | Description |
|---------|-------------|
| Currency | NGN, USD, GHS, etc. |
| Payment Method | Card or Mobile Money |
| Callback URL | Where customer goes after payment |
| Cancel URL | Where customer goes if they cancel |
| Narration | Default payment description |
| Checkout URL | URL path to your checkout page |
| Allowed Domains | Domains authorised to use this key |
| Webhook URL | URL to send webhook notifications to |

---

## 9. Testing Your Integration

EmbedPay provides test keys and test cards so you can try a full payment
without moving real money.

### Use a test key

In your dashboard, create a key with `test` in the environment segment.
Use it exactly like a live key during development.

Example test key format:
```
pk_test_demo_00000000_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> **Demo provider (`demo`):** Always uses the mock/sandbox flow automatically.
> **Test keys with real providers:** Hit the provider's sandbox API unless `forceMock` is enabled.

### Test cards

Use these card numbers on the checkout page to simulate different outcomes:

| Card number | Expiry | CVV | Result |
|-------------|--------|-----|--------|
| `4084 0841 2345 6789` | Any future date | Any 3 digits | **Payment succeeds** |
| `4000 0000 0000 0002` | Any future date | Any 3 digits | **Card declined** |

### Force Mock Mode

To test with the local sandbox UI even when using a real provider test key:

**HTML/JS:**
```html
<script data-force-mock="true" ...></script>
```

**React:**
```jsx
<EmbedPayButton forceMock={true} ... />
```

**Vue:**
```vue
<EmbedPayButton :force-mock="true" ... />
```

### What to check

Go through this checklist after completing your integration:

- [ ] Add items (or increase total), then click checkout — payment screen opens
- [ ] Clicking checkout with a zero total shows an error message
- [ ] After successful test payment, you are redirected to your Callback URL
- [ ] Clicking Cancel on the checkout page takes you to your Cancel URL
- [ ] The payment narration shown on the checkout screen matches what you configured

---

## 10. Troubleshooting

### "Nothing happens when I click the checkout button"

**Most common causes:**
1. The `data-checkout` attribute is missing from your button. Double-check it is there.
2. Your publishable key has not loaded yet. Open your browser console (F12) and look for any EmbedPay errors.
3. The key is set to a domain that does not match your site. Check the Allowed Domains setting in your dashboard.
4. The SDK hasn't found a valid amount. Check that your `data-amount-var` or `data-amount-from` is correct.

---

### "Invalid payment key" error

Your `data-key` value is incorrect or malformed. Copy it again directly from your dashboard to avoid typos. Make sure you are using a publishable key (starts with `pk_`), not a secret key.

The key format should be:
```
pk_[live|test]_[provider]_[8-char-hash]_[random-bytes]
```

---

### "Payment service not authorized for this site"

Your website's domain is not in the **Allowed Domains** list for this key. Go to your EmbedPay dashboard, open the key settings, and add your domain.

---

### "Payment amount is missing or zero"

The SDK could not find a valid amount. Check:
- If using `data-amount-var`: is the variable name spelled correctly? Is it a global variable (`var`, not `let` inside a module)?
- If using `data-amount-from`: does the CSS selector match an element on your page? Try the selector in your browser console: `document.querySelector('#your-selector')`.
- If using React/Vue: is the `amount` prop receiving a number greater than zero?

---

### "We noticed unusual activity during your session. Please refresh the page and try again."

EmbedPay's security system detected potential tampering (browser resize, devtools opened, or amount changed suspiciously). This is a security feature. Refresh the page and try again. If the issue persists, check that no browser extension is interfering with the page.

---

### The checkout button does not appear in WooCommerce

1. Make sure the EmbedPay plugin is activated
2. Make sure you have entered your publishable key in **Settings → EmbedPay**
3. Check that WooCommerce is installed and active
4. The button appears on the Cart page, not the product page

---

### The total in the checkout screen does not match my cart

For WooCommerce users: the plugin reads the total using WooCommerce's built-in events. If your theme heavily customises the WooCommerce cart template, the selector may not match. Contact your theme developer or EmbedPay support.

For custom implementations: Ensure your amount source (variable or DOM element) is updating correctly before checkout is clicked.

---

### I'm on React/Vue and getting "window is not defined" on the server

This happens with server-side rendering (SSR) frameworks like Next.js or Nuxt. EmbedPay runs only in the browser. Make sure the `EmbedPayButton` component is used inside a client component:

**Next.js fix:** Add `'use client'` at the top of the file that contains `<EmbedPayButton>`.

```jsx
'use client'
import { EmbedPayButton } from '@vesicash/embedpay-react';
```

**Nuxt fix:** Wrap the component in `<ClientOnly>`:

```vue
<ClientOnly>
  <EmbedPayButton ... />
</ClientOnly>
```

---

## 11. FAQ

**Q: Can I have multiple checkout buttons on the same page?**

Yes. Add `data-checkout` to as many buttons as you like. The SDK binds to all of them. They will all use the same amount source and configuration.

You can also use different keys per button by adding `data-key` to individual buttons:

```html
<button data-checkout data-key="pk_live_provider2_xxx">Pay with Provider 2</button>
```

---

**Q: Can I use different currencies on different pages?**

Create a separate publishable key for each currency in your dashboard. Use the correct key on each page.

---

**Q: Can I change the look of the checkout page?**

The checkout page is hosted by EmbedPay. In the dashboard, you can add your logo and merchant name. The layout itself cannot be changed — it is standardised for security and trust.

For full control, you can host your own checkout page and set its URL in the **Checkout URL** dashboard setting.

---

**Q: What happens if the customer's internet disconnects during payment?**

The customer will see an error on the checkout page and can try again. No charge is made until the payment is fully confirmed.

---

**Q: How do I know a payment was actually successful?**

Two ways:
1. The customer is redirected to your **Callback URL** — you can show a "Thank you" page
2. EmbedPay sends a **webhook** (a notification) to your server with payment details. This is the most reliable way to confirm payment. Set it up in your dashboard under Webhooks.

---

**Q: Is EmbedPay secure?**

Yes. Card data is never sent to your server. It is handled entirely by EmbedPay's checkout page, which uses 256-bit SSL encryption. EmbedPay also runs client-side integrity checks to detect if the payment amount has been tampered with before checkout begins.

---

**Q: Can I use EmbedPay for subscriptions or recurring payments?**

Yes — create a separate key configured for recurring billing. Contact EmbedPay support to enable this feature.

---

**Q: I'm a developer. Is there a programmatic API?**

Yes. For React, use the `useEmbedPay` hook:
```jsx
import { useEmbedPay } from '@vesicash/embedpay-react';
const { init, checkout } = useEmbedPay({ publishableKey: 'pk_live_xxx' });
// Call when ready:
await init(() => cartTotal);  // Initialize with amount getter
await checkout(cartTotal, 'Custom narration');
```

For Vue, use the `useEmbedPay` composable:
```js
import { useEmbedPay } from '@vesicash/embedpay-vue';
const { isReady, init, checkout } = useEmbedPay({ publishableKey: 'pk_live_xxx' });
```

For plain JS (browser), the SDK exposes:
```js
window.EmbedPay.refresh(); // re-scan for new [data-checkout] buttons (useful for SPAs)
```

---

**Q: Which payment providers are supported?**

EmbedPay supports multiple providers:
- **Vesicash** — Full production support
- **AlexPay** — Full production support
- **Portal** — Full production support
- **Demo** — Built-in mock provider for testing (always uses sandbox flow)

The provider is determined by the `provider` segment in your publishable key.

---

**Q: Can I switch between live and test mode?**

Yes. Use a `pk_test_...` key for testing and a `pk_live_...` key for production. The environment segment in your key controls this automatically.

---

*Need help? Email support@vesicash.com or visit [vesicash.com/support](https://vesicash.com/support)*
