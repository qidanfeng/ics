import request from '@/api/request'
import requestUrl from '@/api/requestUrl'


export function getActivatedCarrierByClientId(clientId){
  return request({
    url:  process.env.VUE_APP_MDM_BASE_URL + `/carrier/getActivatedCarrierByClientId?clientId=`+clientId,
    method: 'get',
  })
};
