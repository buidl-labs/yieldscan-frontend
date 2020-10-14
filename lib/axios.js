import _axios from "axios";

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
	throw new Error("No `NEXT_PUBLIC_API_BASE_URL` found in environment!");
}

const axios = _axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default axios;
