import { aggregatorList, aggregatorDetail } from './state'

export function useAggregatorMutations() {
  const mutateAggregatorList = (payload: any[]) => {
    aggregatorList.value = payload
  }

  const mutateAggregatorDetail = (payload: Record<string, any> | null) => {
    aggregatorDetail.value = payload
  }

  return {
    mutateAggregatorList,
    mutateAggregatorDetail,
  }
}
