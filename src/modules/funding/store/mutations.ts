import { fundingList, fundingDetail } from './state'

export function useFundingMutations() {
  const mutateFundingList = (payload: any[]) => {
    fundingList.value = payload
  }

  const mutateFundingDetail = (payload: Record<string, any> | null) => {
    fundingDetail.value = payload
  }

  return {
    mutateFundingList,
    mutateFundingDetail,
  }
}
