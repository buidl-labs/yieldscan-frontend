const getErasHistoric = async (api, setErasHistoric) => {
	api.derive.staking.erasHistoric().then((data) => {
		setErasHistoric(data);
	});
};

export default getErasHistoric;
