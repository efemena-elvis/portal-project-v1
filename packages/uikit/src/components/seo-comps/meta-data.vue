<template>
  <Head>
    <html :lang="getMetaLocales.current" />
    <meta property="og:locale" :content="getMetaLocales.current" />
    <meta
      v-for="locale in getMetaLocales.other"
      :key="locale"
      property="og:locale:alternate"
      :content="locale"
    />
    <!-- Page Title -->
    <title>{{ getMetaTitle }}</title>

    <!-- Description -->
    <meta name="description" :content="getMetaDescription" />

    <!-- Keywords -->
    <meta name="keywords" :content="metaKeywords" />

    <!-- Authors -->
    <meta name="author" :content="metaCompanyName" />
    <link rel="author" :href="metaCompanyBaseUrl" />
    <meta name="creator" :content="metaCompanyCreator" />

    <!-- Open Graph / Social -->
    <meta property="og:title" :content="getMetaTitle" />
    <meta property="og:description" :content="getMetaDescription" />
    <meta property="og:type" content="website" />
    <meta
      v-if="getMetaImageUrl"
      property="og:image"
      :content="getMetaImageUrl"
    />
    <meta
      v-if="getMetaImageUrl"
      property="og:image:secure_url"
      :content="getMetaImageUrl"
    />
    <meta
      v-if="getMetaImageUrl"
      property="og:image:alt"
      :content="metaCompanyName"
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      v-if="getMetaImageUrl"
      name="twitter:image"
      :content="getMetaImageUrl"
    />
    <meta
      v-if="getMetaImageUrl"
      name="twitter:image:alt"
      :content="metaCompanyName"
    />
    <link v-if="getMetaImageUrl" rel="image_src" :href="getMetaImageUrl" />

    <!-- Canonical and Language Alternates -->
    <link rel="canonical" :href="metaCompanyBaseUrl" />
    <link rel="alternate" hreflang="en-US" href="/en-US" />
  </Head>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Head } from "@vueuse/head";

// Define SEO props
interface SEOProps {
  baseTitle: string;
  pageDescription: string;
  keywords: string;
  companyName: string;
  companyCreator: string;
  companyBaseUrl: string;
  companyLogo?: string;
}

const route = useRoute();

const props = withDefaults(defineProps<SEOProps>(), {
  baseTitle: "",
  pageDescription: "",
  keywords: "",
  companyName: "",
  companyCreator: "",
  companyBaseUrl: "",
  companyLogo: "",
});

const metaTitle = props.baseTitle;
const metaDescription = props.pageDescription;
const metaKeywords = props.keywords;
const metaCompanyName = props.companyName;
const metaCompanyCreator = props.companyCreator;
const metaCompanyBaseUrl = props.companyBaseUrl;
const metaCompanyLogo = props.companyLogo;

const getMetaImageUrl = computed(() => {
  if (!metaCompanyLogo) return "";
  return metaCompanyLogo.startsWith("http")
    ? metaCompanyLogo
    : `${metaCompanyBaseUrl.replace(/\/$/, "")}${metaCompanyLogo.startsWith("/") ? "" : "/"}${metaCompanyLogo}`;
});

const getMetaLocales = computed(() => ({
  current: "en",
  other: ["fr", "es"],
}));

const getTitleText = computed(() =>
  route.meta.title ? `${route.meta.title} -` : "",
);

const getMetaTitle = computed(
  () => `${getTitleText.value} ${metaTitle}` || metaTitle,
);

const getMetaDescription = computed(() => {
  const { description } = route.meta;
  return typeof description === "string" ? description : metaDescription;
});
</script>
