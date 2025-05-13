export type TStackParamsList = {
  WELCOME_SCREEN: undefined;
  LOGIN_SCREEN: undefined;
  SIGNUP_SCREEN: undefined;
  DOCUMENT_SCREEN: {
    type: string;
  };
  PRICINGPLAN_SCREEN: undefined;
  PAYMENT_SCREEN: {
    type: "e-wallet" | "credit-card";
    channel: string;
    amount: number;
    planTitle: string;
  };
  USERHOME_SCREEN: undefined;
  USERHOME2_SCREEN: undefined;
  ORDERS_SCREEN: {
    selectedOrderId?: string;
    showDetails?: boolean;
  };
  WALLET_SCREEN: undefined;
  PROFILE_SCREEN: undefined;
  HELPCENTER_SCREEN: undefined;
  CHATASSISTANT_SCREEN: undefined;
  ACCOUNT_SETTINGS_SCREEN: undefined;
  PRODUCT_COMPARE_SCREEN: undefined;
  VIEW_PRODUCT_DETAIL_SCREEN: {
    product: {
      id: number | string;
      name: string;
      price: number;
      image?: any;
      description?: string;
    };
  };
  PRODUCTS_SCREEN: {
    category: string;
    searchQuery?: string;
  };
  CART_SCREEN: {
    autoCheckout?: boolean;
  };
  CHECKOUT_WEBVIEW: {
    url: string;
  };
};
