import { defineStore } from 'pinia'
import * as actions from './actions'
import * as getters from './getters'
import * as state from './state'
import { useTeamMutations } from './mutations'

export const useTeamStore = defineStore('team', () => {
  const mutations = useTeamMutations()

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  }
})
