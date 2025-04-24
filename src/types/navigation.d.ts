export type TStackParamsList = {
  WELCOME_SCREEN: undefined;
  LOGIN_SCREEN: undefined;
  SIGNUP_SCREEN: undefined;
  PRICINGPLAN_SCREEN: undefined;
  USERHOME_SCREEN: undefined;
  USERHOME2_SCREEN: undefined;
  ORDERS_SCREEN: undefined;
  WALLET_SCREEN: undefined;
  PROFILE_SCREEN: undefined;
  VIEW_PRODUCT_DETAIL_SCREEN: {
    product: {
      id: number | string;
      name: string;
      price: number;
      image?: any;
      description?: string;
    };
  };
  ACCESSORIES_SCREEN: undefined;
  ALBUMS_SCREEN: undefined;
  BEAUTY_PRODUCTS_SCREEN: undefined;
  CLOTHING_SCREEN: undefined;
  HOME_GOODS_SCREEN: undefined;
  LIGHTSTICKS_SCREEN: undefined;
  PHOTOCARDS_SCREEN: undefined;
  STATIONARIES_SCREEN: undefined;
  CART_SCREEN: undefined;
  CHECKOUT_WEBVIEW: {
    url: string;
  };
};
