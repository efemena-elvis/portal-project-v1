<template>
  <div class="pagination-row">
    <div class="left">
      <div class="page-description">
        {{ pageDescription }}
        <span class="font-medium">({{ pagingData?.page_count || 0 }})</span>
      </div>

      <div class="page-keys">
        <div class="page-key-item" v-if="pageKeys.green">
          <div class="bg-green-400 status-key"></div>
          <div class="status-text">{{ pageKeys.green }}</div>
        </div>

        <div class="page-key-item" v-if="pageKeys.yellow">
          <div class="bg-yellow-400 status-key"></div>
          <div class="status-text">{{ pageKeys.yellow }}</div>
        </div>

        <div class="page-key-item" v-if="pageKeys.red">
          <div class="bg-red-400 status-key"></div>
          <div class="status-text">{{ pageKeys.red }}</div>
        </div>
      </div>
    </div>

    <div class="right" v-if="pagingData.total_pages_count > 1">
      <div class="nav btn btn-sm" @click="goToPrevPage">
        <div class="icon icon-caret-left"></div>
        <div class="nav-text">Prev</div>
      </div>

      <div class="paging">
        <input
          v-model.number="inputPage"
          type="number"
          class="form-control"
          min="1"
          :max="pagingData.total_pages_count"
          placeholder="1"
        />
        <div class="page-slash">/</div>
        <div class="page-total">{{ pagingData.total_pages_count }}</div>
        <button class="btn btn-primary btn-sm page-btn" @click="goToPage">
          Go
        </button>
      </div>

      <div
        class="nav btn btn-sm"
        :class="{
          disabled: pagingData.current_page === pagingData.total_pages_count,
        }"
        @click="goToNextPage"
      >
        <div class="nav-text">Next</div>
        <div class="icon icon-caret-right"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

interface IPaging {
  current_page: number;
  page_count: number;
  total_pages_count: number;
}

interface IPaginationType {
  pageDescription: string;
  pagingData: IPaging;
  pageKeys?: any;
}

const props = defineProps<IPaginationType>();

const emit = defineEmits(["page-change"]);

const inputPage = ref(props.pagingData.current_page);

watch(
  () => props.pagingData.current_page,
  (newVal) => {
    inputPage.value = newVal;
  },
);

const goToPage = () => {
  if (
    inputPage.value >= 1 &&
    inputPage.value <= props.pagingData.total_pages_count
  ) {
    emit("page-change", inputPage.value);
  }
};

const goToPrevPage = () => {
  if (props.pagingData.current_page > 1) {
    emit("page-change", props.pagingData.current_page - 1);
  }
};

const goToNextPage = () => {
  if (props.pagingData.current_page < props.pagingData.total_pages_count) {
    emit("page-change", props.pagingData.current_page + 1);
  }
};
</script>

<style lang="scss" scoped>
.pagination-row {
  @apply flex justify-between items-center gap-x-3 w-full pb-2;

  .left {
    @apply flex flex-col justify-start items-start gap-y-1.5;

    .page-description {
      @apply text-grey-600/90 text-[15px];
    }

    .page-keys {
      @apply flex justify-start items-center gap-x-3.5;

      .page-key-item {
        @apply flex justify-start items-center gap-x-1.5;

        .status-key {
          @apply h-2 w-2 min-h-2 min-w-2 rounded-full;
        }

        .status-text {
          @apply text-xs text-grey-500/90;
        }
      }
    }
  }

  .right {
    @apply relative flex justify-end items-center gap-x-1.5;

    .nav {
      @apply h-10 w-[78px] flex justify-center items-center gap-x-1 rounded-lg cursor-pointer text-grey-500 transition duration-300 ease-in-out hover:text-green-600 first-of-type:pl-3.5 last-of-type:pr-3.5;

      .icon {
        @apply text-xl relative font-medium;
      }

      .nav-text {
        @apply text-[13.75px] relative;
      }

      &.disabled {
        @apply cursor-not-allowed text-grey-400;
      }

      &:hover {
        &.disabled {
          background: unset;
        }
      }
    }

    .paging {
      @apply flex justify-center items-center gap-x-2 text-sm text-grey-800;

      .form-control {
        @apply w-[42px] h-[21px] min-w-[42px] min-h-[21px] py-[16px] px-2 text-center;
      }

      .page-btn {
        @apply text-[12.75px] py-2 px-3 h-9;
      }
    }
  }
}
</style>
