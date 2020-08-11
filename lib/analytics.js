if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_TOKEN) {
  throw new Error('No Amplitude API key passed!');
}

let amplitude;

const trackEvent = async (eventName = '', eventProperties = {}) => {
  if (!window) return;

  if (!amplitude) {
    const Amplitude = await import('amplitude-js');
    amplitude = Amplitude.getInstance();
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_TOKEN);
  }

  // TODO: check for user permissions
  amplitude.logEvent(eventName, eventProperties);
};

const Events = {
  // General
  PAGE_VIEW: 'PAGE_VIEW',

  // Wallet connection popover
  WALLET_CONNECTED: 'WALLET_CONNECTED',
  INTENT_CONNECT_WALLET: 'INTENT_CONNECT_WALLET',
  USER_ACCOUNT_SELECTION: 'USER_ACCOUNT_SELECTION',
  
  // Reward Calculator
  REWARD_CALCULATED: 'REWARD_CALCULATED',
  INTENT_ADVANCED_SELECTION: 'INTENT_ADVANCED_SELECTION',
  INTENT_STAKING: 'INTENT_STAKING',

  // Payment steps (confirmation, reward destination and final transaction)
  PAYMENT_STEP_UPDATED: 'PAYMENT_STEP_UPDATED',
  INTENT_TRANSACTON: 'INTENT_TRANSACTON',
  TRANSACTION_SUCCESS: 'TRANSACTION_SUCCESS',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
};

export { trackEvent, Events };
