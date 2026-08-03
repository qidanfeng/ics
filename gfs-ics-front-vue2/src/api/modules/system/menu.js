import request from '@/api/request'
import requestParam from '@/api/requestParam'
import isInteger from 'lodash/isInteger'



// 获取导航菜单列表 / 权限
export function nav () {
    return request({
        url: process.env.VUE_APP_SYSTEM_BASE_URL + '/menu/nav/',
        method: 'get'
    })
}
