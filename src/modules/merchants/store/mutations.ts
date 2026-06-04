import { merchantList, merchantDetail } from './state'

export function useMerchantMutations() {
  const mutateMerchantList = (payload: any[]) => {
    merchantList.value = payload
  }

  const mutateMerchantDetail = (payload: Record<string, any> | null) => {
    merchantDetail.value = payload
  }

  return {
    mutateMerchantList,
    mutateMerchantDetail,
  }
}
