import { authRequest, blobRequest, request } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 * @param code Verification code
 * @param key Captcha key
 */
export function fetchLogin(userName: string, password: string, code?: string, key?: string) {
  return authRequest<Api.Auth.LoginToken>({
    url: '/gfs-auth/oauth/token',
    method: 'post',
    params: {
      grant_type: 'password',
      key,
      code
    },
    data: {
      username: userName,
      password,
      grant_type: 'password'
    }
  });
}

/** Get image captcha */
export function fetchGetCaptcha(key?: string) {
  return blobRequest<Blob>({ url: '/gfs-auth/captcha', params: { key } });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/system/user/info/' });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * Logout
 */
export function fetchLogOut() {
  return request({
    url: '/gfs-auth/token/revoke',
    method: 'delete'
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
