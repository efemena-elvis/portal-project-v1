import { computed } from 'vue'
import { disputeList, disputeDetail } from './state'

export const getAllDisputes = computed(() => disputeList.value)
export const getCurrentDispute = computed(() => disputeDetail.value)
