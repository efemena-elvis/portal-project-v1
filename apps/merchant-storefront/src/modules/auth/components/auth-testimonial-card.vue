<template>
  <div class="auth-testimonial-card">
    <transition-group name="slide-fade" tag="div" class="top-section-wrapper">
      <div class="top-section" :key="activeIndex">
        {{ testimonials[activeIndex].message }}
      </div>
    </transition-group>

    <div class="bottom-section">
      <div class="user-data">
        <div class="img-wrapper">
          <img
            :src="testimonials[activeIndex].user_avatar_url"
            :alt="testimonials[activeIndex].user_name"
          />
        </div>

        <div>
          <div class="title-text">
            {{ testimonials[activeIndex].user_name }}
          </div>
          <div class="description-text">
            {{ testimonials[activeIndex].user_business }}
          </div>
        </div>
      </div>

      <div class="controls">
        <div class="controller" @click="handleControlClick('prev')">
          <div class="icon icon-caret-left"></div>
        </div>
        <div class="controller" @click="handleControlClick('next')">
          <div class="icon icon-caret-right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";

interface ITestimonial {
  message: string;
  user_name: string;
  user_business: string;
  user_avatar_url: string;
}

const testimonials = ref<ITestimonial[]>([
  {
    message:
      "Since integrating the platform, our storefront now updates inventory in real time, no more overselling! It's intuitive and scales beautifully with our catalog.",
    user_name: "Efemena Elvis",
    user_business: "Founder, AngelWears",
    user_avatar_url:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60",
  },
  {
    message:
      "The analytics dashboard helped us discover that 70% of our customers drop off at checkout. We fixed it in a day and saw conversions rise by 26%.",
    user_name: "Aisha Bello",
    user_business: "Head of Product, Techify Mart",
    user_avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60",
  },
  {
    message:
      "Customer support automation through the SaaS cut our email volume in half. It's like having an AI-powered store manager working 24/7.",
    user_name: "Kenji Tanaka",
    user_business: "COO, Innovate Co.",
    user_avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
  },
  {
    message:
      "From real-time shipping updates to automatic tax calculation, the system does it all. We launched globally in weeks instead of months.",
    user_name: "Maria Rodriguez",
    user_business: "Logistics Lead, Global Bodega",
    user_avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
  },
]);

const activeIndex = ref(0);

const handleControlClick = (direction: "next" | "prev") => {
  const length = testimonials.value.length;
  activeIndex.value =
    direction === "next"
      ? (activeIndex.value + 1) % length
      : (activeIndex.value - 1 + length) % length;
};

const handleAutoSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % testimonials.value.length;
};

const interval = setInterval(handleAutoSlide, 5000);
onUnmounted(() => clearInterval(interval));
</script>

<style lang="scss" scoped>
.auth-testimonial-card {
  @apply border border-neutral-10/20 rounded-xl p-8 bg-neutral-10/10 backdrop-blur-3xl overflow-hidden;
}

.top-section-wrapper {
  @apply relative w-full min-h-[72px] block mb-6;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30%);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}

.top-section {
  @apply text-[15.75px] text-neutral-10 absolute;
}

.bottom-section {
  @apply flex justify-between items-center gap-x-4;

  .user-data {
    @apply flex justify-start items-center gap-x-2;

    .img-wrapper {
      @apply size-9 min-w-9 min-h-9 rounded-full overflow-hidden border border-neutral-10/20;
    }

    .title-text {
      @apply text-sm font-semibold text-neutral-10 mb-[1px];
    }

    .description-text {
      @apply text-xs text-neutral-50/75;
    }
  }

  .controls {
    @apply flex justify-end items-center gap-x-3;

    .controller {
      @apply size-8 min-w-8 min-h-8 overflow-hidden rounded-full flex justify-center items-center cursor-pointer border border-neutral-10/65 transition duration-300 ease-in-out hover:bg-neutral-10/10;

      .icon {
        @apply text-lg text-neutral-10/65 font-medium transition duration-300 ease-in-out;
      }
    }
  }
}
</style>
