import Amplitude from 'amplitude-js';

if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_TOKEN) {
  throw new Error('No Amplitude API key passed!');
}

const instance = Amplitude.getInstance();
instance.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_TOKEN);

export default instance;
