<template>
  <div class="pagination-row">
    <div class="left">
      <div class="page-description">
        {{ pageDescription }}
        <span class="font-medium">({{ pagingData?.page_count || 0 }})</span>
      </div>
    </div>

    <div class="right" v-if="pagingData.total_pages_count > 1">
      <div
        class="nav btn btn-sm"
        :class="pagingData.current_page === 1 ? 'disabled' : null"
      >
        <div class="icon icon-caret-left"></div>
        <div class="nav-text">Prev</div>
      </div>

      <!--PAGING -->
      <div class="paging">
        <input
          type="number"
          class="form-control"
          onkeypress="return event.charCode >= 48"
          min="1"
          max="10"
          placeholder="1"
        />
        <div class="page-slash">/</div>
        <div class="page-total">{{ pagingData.total_pages_count }}</div>
        <button class="btn btn-primary btn-sm page-btn">Go</button>
      </div>

      <div
        class="nav btn btn-sm"
        :class="
          pagingData.current_page === pagingData.total_pages_count
            ? 'disabled'
            : null
        "
      >
        <div class="nav-text">Next</div>
        <div class="icon icon-caret-right"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IPaging {
  current_page: number;
  page_count: number;
  total_pages_count: number;
}

interface IPaginationType {
  pageDescription: string;
  pagingData: IPaging;
}

const props = defineProps<IPaginationType>();
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
