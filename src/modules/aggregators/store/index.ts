import { defineStore } from 'pinia'
import * as actions from './actions'
import * as getters from './getters'
import * as state from './state'
import { useAggregatorMutations } from './mutations'

export const useAggregatorStore = defineStore('aggregator', () => {
  const mutations = useAggregatorMutations()

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  }
})
