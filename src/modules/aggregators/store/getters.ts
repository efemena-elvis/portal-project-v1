import { computed } from 'vue'
import { aggregatorList, aggregatorDetail } from './state'

export const getAllAggregators = computed(() => aggregatorList.value)
export const getCurrentAggregator = computed(() => aggregatorDetail.value)
