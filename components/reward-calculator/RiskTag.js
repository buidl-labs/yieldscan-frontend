const getRiskCategory = riskAmount => {
	if (Number.isNaN(riskAmount)) throw new Error('Risk amount should be a number');
	if (riskAmount < 0.33) return 'Low';
	if (riskAmount >= 0.33 && riskAmount <= 0.66) return 'Medium';
	if (riskAmount > 0.66) return 'High';
};

const getStyleByRisk = (risk) => {
	switch (risk) {
		case 'Low': return 'text-teal-500 bg-teal-100';
		case 'Medium': return 'text-orange-500 bg-orange-100';
		case 'High': return 'text-red-500 bg-red-100';
		default: return '';
	}
};

const RiskTag = ({ risk }) => {
	const riskCategory = getRiskCategory(risk);
	return (
		<span className={`ml-2 px-2 rounded ${getStyleByRisk(riskCategory)}`}>{risk}</span>
	);
};

export default RiskTag;