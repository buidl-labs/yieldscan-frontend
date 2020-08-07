import Amplitude from 'amplitude-js';

if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_TOKEN) {
  throw new Error('No Amplitude API key passed!');
}

const amplitude = Amplitude.getInstance();
amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_TOKEN);

const trackEvent = (eventName = '', eventProperties = {}) => {
  // TODO: check for user permissions
  amplitude.logEvent(eventName, eventProperties);
};

export { trackEvent };
