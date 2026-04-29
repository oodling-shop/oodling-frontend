export enum NotificationType {
  // Order Processing
  ORDER_CONFIRMATION = 'order_confirmation',
  DRAFT_ORDER_INVOICE = 'draft_order_invoice',
  SHIPPING_CONFIRMATION = 'shipping_confirmation',

  // Local Pickup
  READY_FOR_LOCAL_PICKUP = 'ready_for_local_pickup',
  PICKED_UP_BY_CUSTOMER = 'picked_up_by_customer',

  // Local Delivery
  ORDER_OUT_FOR_LOCAL_DELIVERY = 'order_out_for_local_delivery',
  ORDER_LOCALLY_DELIVERED = 'order_locally_delivered',
  ORDER_MISSED_LOCAL_DELIVERY = 'order_missed_local_delivery',

  // Gift Cards
  NEW_GIFT_CARD = 'new_gift_card',
  GIFT_CARD_RECEIPT = 'gift_card_receipt',

  // Store Credit
  STORE_CREDIT_ISSUED = 'store_credit_issued',

  // Order Exceptions
  ORDER_INVOICE = 'order_invoice',
  ORDER_EDITED = 'order_edited',
  ORDER_CANCELED = 'order_canceled',
  ORDER_PAYMENT_RECEIPT = 'order_payment_receipt',
  ORDER_REFUND = 'order_refund',
  ORDER_LINK = 'order_link',

  // Payments
  PAYMENT_ERROR = 'payment_error',
  PENDING_PAYMENT_ERROR = 'pending_payment_error',
  PENDING_PAYMENT_SUCCESS = 'pending_payment_success',
  PAYMENT_REMINDER = 'payment_reminder',

  // Point of Sale
  POS_ABANDONED_CHECKOUT = 'pos_abandoned_checkout',
  POS_EMAIL_TO_CUSTOMER = 'pos_email_to_customer',
  POS_AND_MOBILE_RECEIPT = 'pos_and_mobile_receipt',
  POS_EXCHANGE_RECEIPT = 'pos_exchange_receipt',

  // Shipping Updated
  SHIPPING_UPDATE = 'shipping_update',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',

  // Accounts and Outreach
  CUSTOMER_ACCOUNT_INVITE = 'customer_account_invite',
  CUSTOMER_ACCOUNT_WELCOME = 'customer_account_welcome',
  CUSTOMER_ACCOUNT_PASSWORD_RESET = 'customer_account_password_reset',
  CUSTOMER_PAYMENT_METHOD_ADD = 'customer_payment_method_add',
  CUSTOMER_PAYMENT_METHOD_UPDATE = 'customer_payment_method_update',
  CUSTOMER_PAYMENT_METHOD_RESTORE = 'customer_payment_method_restore',
  B2B_ACCESS_EMAIL = 'b2b_access_email',
  B2B_LOCATION_UPDATE_PAYMENT_METHOD = 'b2b_location_update_payment_method',
  CONTACT_CUSTOMER = 'contact_customer',
  CUSTOMER_EMAIL_CHANGE_CONFIRMATION = 'customer_email_change_confirmation',
}

export type NotificationPreference = {
  type: NotificationType;
  enabled: boolean;
};

export type UserNotificationSettings = {
  preferences: NotificationPreference[];
};
