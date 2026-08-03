declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      msg: string;
      code: number;
    }

    interface UserInfo {
      userId: number;
      warehouseCode: string;
      username: string;
      realName: string | null;
      mobile: string | null;
      wxNickName: string | null;
      wxHeadImgUrl: string | null;
      buttons: string[];
    }

    interface Captcha {
      img: string;
      id: string;
    }
  }
}
