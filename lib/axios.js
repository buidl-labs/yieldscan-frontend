import _axios from 'axios';

const axios = _axios.create({
	baseURL: 'https://yieldscan-api.onrender.com/api',
});

export default axios;
