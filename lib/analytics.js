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

export { trackEvent };
