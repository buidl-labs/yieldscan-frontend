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

const setUserProperties = async (userProperties = {}) => {
	if (!window) return;

	if (!amplitude) {
		const Amplitude = await import("amplitude-js");
		amplitude = Amplitude.getInstance();
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_TOKEN);
    amplitude.clearUserProperties();
  }
	amplitude.setUserProperties(userProperties);
};

const Events = {
	// General
	PAGE_VIEW: "Visited Page",

	LANDING_CTA_CLICK: "User clicked CTA to redirect to reward calculator",

	// Wallet connection popover
	WALLET_CONNECTED: "Wallet successfully authorized",
	INTENT_CONNECT_WALLET: "Intention to connect wallet",
	INTENT_ACCOUNT_SELECTION: "Intention to select account",

	USER_ACCOUNT_SELECTION: "USER_ACCOUNT_SELECTION",

	// Reward Calculator
	REWARD_CALCULATED:
		"User changed at least one of the inputs on the calculator (boolean)",
	INTENT_ADVANCED_SELECTION: "INTENT_ADVANCED_SELECTION",
	CALCULATOR_CTA_CLICK: "User clicked CTA to redirect to confirmation",
	INTENT_STAKING: "INTENT_STAKING",

	// Payment steps (confirmation, reward destination and final transaction)
	PAYMENT_STEP_UPDATED: "PAYMENT_STEP_UPDATED",
	INTENT_TRANSACTION: "INTENT_TRANSACTION",
	TRANSACTION_SUCCESS: "TRANSACTION_SUCCESS",
	TRANSACTION_FAILED: "TRANSACTION_FAILED",
};

export { setUserProperties, trackEvent, Events };
