import request from '@/api/request'
import requestUrl from '@/api/requestUrl'


export function getActivatedCarrierByExternalClientId(clientId){
  return request({
    url:  process.env.VUE_APP_MDM_BASE_URL + `/carrier/getActivatedCarrierByExternalClientId?externalClientId=`+clientId,
    method: 'get',
  })
};
