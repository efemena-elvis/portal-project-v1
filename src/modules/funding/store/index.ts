import { defineStore } from 'pinia'
import * as actions from './actions'
import * as getters from './getters'
import * as state from './state'
import { useFundingMutations } from './mutations'

export const useFundingStore = defineStore('funding', () => {
  const mutations = useFundingMutations()

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  }
})
