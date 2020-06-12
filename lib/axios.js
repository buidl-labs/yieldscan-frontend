import _axios from 'axios';

const axios = _axios.create({
	baseURL: 'https://mock-api-yieldscan.onrender.com',
});

export default axios;
