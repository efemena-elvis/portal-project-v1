<template>
  <div class="pb-10 store-overview-page">
    <!-- TOP AREA -->
    <div class="top-area">
      <div class="top-area--left">
        <div class="section-title">Storefront Information</div>

        <div class="section-description">
          Update your storefront profile and details here.
        </div>
      </div>

      <div class="top-area--right button-actions">
        <div class="spinner-icon icon-spinner-ios" v-if="storeIsLoading"></div>

        <button class="btn btn-sm btn-secondary" @click="fetchStorefrontById">
          Cancel
        </button>
        <button
          class="btn btn-sm btn-primary"
          ref="updateStorefrontBtnRef"
          @click="updateStorefrontDetails"
        >
          Save Profile
        </button>
      </div>
    </div>

    <!-- BOTTOM AREA -->
    <div class="bottom-area">
      <!-- STOREFRONT NAME -->
      <div class="input-row">
        <div class="input-row--left">
          <div class="input-title">Storefront Name</div>
          <div class="input-description">
            This is the name of your storefront.
          </div>
        </div>

        <div class="input-row--right">
          <div class="form-wrapper">
            <div class="form-input-block">
              <input
                type="text"
                class="form-control form-input"
                v-model="storePayload.name"
                placeholder="Provide storefront name"
              />
            </div>

            <div class="form-input-block">
              <div
                v-if="!storePayload.domain"
                class="form-input-block form-control form-input"
              >
                <div class="form-placeholder">
                 {{getDomain}}
                </div>
                <input
                  type="text"
                  placeholder="storefront url"
                  className="bg-transparent"
                  disabled
                  v-model="storePayload.slug"
                />
              </div>
              <div v-else class="form-input-block form-control form-input">
                <div class="form-placeholder">https://</div>
                <div class="form-placeholder">
                  {{ storePayload?.domain }}
                </div>
              </div>
            </div>

            
            <div
              v-if="!storePayload.domain"
              class="text-grey-600/85 text-[12.5px] leading-5 mt-[1px]"
            >
              NOTE: Your storefront URL is auto-generated and cannot be edited. 
              <!-- Add a -->
              <!-- <router-link
                class="underline"
                :to="`/storefront/custom-domain/${storefrontId}?storeSlug=${storefrontSlug}`"
                >custom domain</router-link
              > -->
              <!-- for a more professional and memorable address. -->
            </div>
          </div>
        </div>
      </div>

      <!-- STOREFRONT TAGLINE / DESCRIPTION -->
      <div class="input-row">
        <div class="input-row--left">
          <div class="input-title">Tagline / Description</div>
          <div class="input-description">
            A quick snapshot of your storefront.
          </div>
        </div>

        <div class="input-row--right">
          <div class="form-wrapper">
            <div class="form-input-block">
              <textarea
                class="form-control form-input"
                rows="3"
                v-model="storePayload.description"
                placeholder="Provide storefront tagline or description"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- STOREFRONT LOGO -->
      <div class="input-row">
        <div class="input-row--left">
          <div class="input-title">Storefront Logo</div>
          <div class="input-description">
            Upload a logo for your storefront.
          </div>
        </div>

        <div class="input-row--right">
          <div class="form-wrapper">
            <div class="w-full form-file-upload">
              <FileUploadInput
              :uploadAction="uploadFile"
                :showSkip="false"
                :hasDocumentUploaded="!!uploadedLogo"
                :uploadedDocumentContent="getUploadedLogoContent"
                fileUploadText="Click here to upload your logo"
                @onDocumentUploaded="uploadedLogo = $event"
              />
            </div>

            <div
              class="mx-auto mt-2 transition duration-300 ease-in-out"
              v-if="uploadedLogo"
            >
              <img
                :src="uploadedLogo"
                alt="display-img"
                class="h-[80px] w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- STOREFRONT NICHE -->
      <div class="input-row">
        <div class="input-row--left">
          <div class="input-title">Storefront Niche</div>
          <div class="input-description">
            Classify your storefront into a specific niche.
          </div>
        </div>

        <div class="input-row--right">
          <div class="form-wrapper">
            <div class="form-input-block">
              <select class="form-control" v-model="storePayload.tag">
                <option value="" disabled selected hidden>
                  Select a storefront niche
                </option>
                <option
                  v-for="(niche, index) in storefrontNicheOptions"
                  :key="index"
                  :value="niche.value"
                >
                  {{ niche.label }}
                </option>
              </select>

              <!-- CARET DOWN -->
              <div class="icon-caret-down"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- STOREFRONT CONTACTS -->
      <div class="input-row">
        <div class="input-row--left">
          <div class="input-title">Contact Information</div>
          <div class="input-description">
            Provide contact information for your storefront.
          </div>
        </div>

        <div class="input-row--right">
          <div class="form-wrapper">
            <div class="form-input-block">
              <textarea
                class="form-control form-input"
                v-model="storePayload.address"
                placeholder="Provide storefront address"
              ></textarea>
            </div>

            <div class="form-input-block">
              <input
                type="email"
                class="form-control form-input"
                v-model="storePayload.email"
                placeholder="Provide storefront email address"
              />
            </div>

            <div class="form-input-block">
              <input
                type="text"
                class="form-control form-input"
                v-model="storePayload.phone_number"
                placeholder="Provide storefront phone number"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- SOCIAL PROFILES -->
      <div class="input-row">
        <div class="input-row--left">
          <div class="input-title">Social Profiles</div>
          <div class="input-description">
            Connect with your social profiles.
          </div>
        </div>

        <div class="input-row--right">
          <div class="form-wrapper">
            <div class="form-input-block form-control form-input">
              <div class="form-placeholder">https://facebook.com/</div>
              <input
                type="text"
                class="focus:outline-none"
                placeholder="facebook name"
                v-model="storePayload.facebook"
              />
            </div>
            <!-- 
            <div class="form-input-block form-control form-input">
              <div class="form-placeholder">
                https://api.whatsapp.com/send?phone=
              </div>
              <input
                type="text"
                class="focus:outline-none"
                placeholder="whatsapp phone"
                v-model="socials.whatsapp_url.path_url"
              />
            </div> -->

            <div class="form-input-block form-control form-input">
              <div class="form-placeholder">https://instagram.com/</div>
              <input
                type="text"
                class="focus:outline-none"
                placeholder="instagram username"
                v-model="storePayload.instagram"
              />
            </div>

            <div class="form-input-block form-control form-input">
              <div class="form-placeholder">https://twitter.com/</div>
              <input
                type="text"
                class="focus:outline-none"
                placeholder="twitter username"
                v-model="storePayload.twitter"
              />
            </div>

            <div class="form-input-block form-control form-input">
              <div class="form-placeholder">https://tiktok.com/</div>
              <input
                type="text"
                class="focus:outline-none"
                placeholder="tiktok username"
                v-model="storePayload.tikTok"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="top-area--right button-actions">
        <div class="spinner-icon icon-spinner-ios" v-if="storeIsLoading"></div>

        <button class="btn btn-sm btn-secondary" @click="fetchStorefrontById">
          Cancel
        </button>
        <button
          class="btn btn-sm btn-primary"
          ref="updateStorefrontBtnRef"
          @click="updateStorefrontDetails"
        >
          Save Profile
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStorefrontStore } from "@/modules/storefront/store";
import { storefrontNiches } from "@packages/constants";
import {useEvents, useAppVariant} from "@packages/hooks";
import {FileUploadInput} from "@packages/uikit";
import { useGlobalStore } from "@/modules/global/store";


const route = useRoute();

const { processAPIRequest } = useEvents();
const { fetchStoreById, updateStorefront } = useStorefrontStore();
const { uploadFile } = useGlobalStore();
const appVariant = ref<string>(useAppVariant());

const storeIsLoading = ref<boolean>(true);
const updateStorefrontBtnRef = ref(null);
const storefrontId = ref(route.params.storeId);
const storefrontSlug = ref(route.query.storeSlug);


const storePayload = ref<any>({
  name: "",
  slug: "",
  domain: "",
  description: "",
  tag: "",
  address: "",
  email: "",
  phone_number: "",
  facebook: "",
  instagram: "",
  twitter: "",
  tikTok: "",
});

const uploadedLogo = ref<string>("");

const getUploadedLogoContent = computed(() => {
  return {
    name: uploadedLogo.value ? "Store Logo" : "",
    link: uploadedLogo.value,
  };
});

const storefrontNicheOptions = computed(() => {
  return storefrontNiches.map((niche) => {
    return { value: niche.slug, label: niche.nicheTitle };
  });
});

const getDomain = computed(() => {
  return appVariant.value === "alexpay"
    ? "https://store.alexpay.com/"
    : "https://store.redstonepgs.com/"
});

const getStorefrontPayload = computed(() => {
  return {
    id: route.params.storeId,
    ...storePayload.value,
    logo: uploadedLogo.value,
  };
});

const fetchStorefrontById = async () => {
  storeIsLoading.value = true;

  const response = await processAPIRequest({
    action: fetchStoreById,
    payload: { storeId: route.params.storeId },
    showAlert: false,
  });

  storeIsLoading.value = false;

  if (response.code === 200) {
    storePayload.value.name = response.data.name;
    storePayload.value.slug = response.data.slug;
    storePayload.value.description = response.data.description;
    storePayload.value.tag = response.data.tag;
    storePayload.value.address = response.data.address;
    storePayload.value.email = response.data.email;
    storePayload.value.phone_number = response.data.phone_number;
    storePayload.value.domain = response.data.domain_config?.domain;

    uploadedLogo.value = response.data.logo ?? "";

    storePayload.value.facebook = response.data.facebook ?? "";
    storePayload.value.instagram = response.data.instagram ?? "";
    storePayload.value.twitter = response.data.twitter ?? "";
    storePayload.value.tikTok = response.data.tikTok ?? "";
  }
};

const updateStorefrontDetails = async () => {
  const response = await processAPIRequest({
    action: updateStorefront,
    payload: getStorefrontPayload.value,
    btnRef: updateStorefrontBtnRef,
    btnText: "Save Profile",
    alertHandler: {
      200: {
        message: "Success",
        description: "Storefront updated successfully",
        type: "success",
      },

      400: {
        message: "Storefront update failed",
        description: "An error occurred while updating your storefront",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    fetchStorefrontById();
  }
};

onMounted(() => {
  fetchStorefrontById();
});
</script>

<style lang="scss" scoped>
.store-overview-page {
  .top-area {
    @apply flex justify-between items-center gap-x-3 border-b border-b-grey-200/70 pb-7;

    &--left {
      @apply flex flex-col justify-center items-start gap-y-0.5 w-full;

      .section-title {
        @apply font-semibold text-base sm:text-[15.5px] text-grey-700;
      }

      .section-description {
        @apply text-grey-600/85 text-[12.5px];
      }
    }

    &--right {
      @apply flex justify-end items-center gap-x-3 sm:hidden;
    }
  }

  .bottom-area {
    .input-row {
      @apply py-8 border-b border-b-grey-200/70 flex sm:flex-col justify-start items-start gap-x-5 md:gap-x-2 sm:gap-y-4;

      &--left {
        @apply flex flex-col justify-start items-start gap-y-0.5 pt-0.5 w-[25%] xl:w-[30%] md:w-[35%] sm:w-full;

        .input-title {
          @apply font-semibold text-sm text-grey-700/95;
        }

        .input-description {
          @apply text-grey-600/85 text-[12.25px];
        }
      }

      &--right {
        @apply flex flex-col justify-start items-start gap-y-1 w-[75%] xl:w-[70%] md:w-[65%] sm:w-full;

        .form-wrapper {
          @apply w-[54%] xl:w-4/5 md:w-full flex flex-col justify-start items-start gap-y-3;

          .form-input-block {
            @apply relative w-full;
          }

          .form-input {
            @apply w-full text-grey-600 text-[13.5px] placeholder:text-[13.5px] py-[12.75px] px-4 border-grey-300 hover:border-green-400/80 focus:border-green-400;
          }

          .form-input-block {
            @apply relative w-full flex justify-start items-center;

            .form-placeholder {
              @apply text-grey-500/65 mr-[1px];
            }

            .icon-caret-down {
              @apply absolute top-1/2 right-4 transform -translate-y-1/2 text-grey-700 text-sm z-10;
            }
          }
        }
      }
    }
  }

  .button-actions {
    @apply w-full mt-8;

    .btn {
      @apply w-max h-[46px] py-2.5 sm:py-3 px-7 text-grey-800/80 border text-[13px];
    }

    .btn-primary {
      @apply text-neutral-10;
    }

    .btn-secondary {
      @apply border-grey-300/70 hover:bg-grey-200/40;
    }

    .spinner-icon {
      @apply text-3xl text-grey-400/90 animate-spin mr-0.5;
    }
  }
}
</style>
