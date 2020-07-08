import { Avatar } from "@chakra-ui/core";

const TopNominatorCard = () => (
	<div className="px-6 py-8 flex-center flex-col rounded-lg border shadow-xl">
		<Avatar mb="1rem" />
		<h3 className="text-xl text-gray-700 font-semibold mb-4">Nominator Name</h3>
		<span className="text-gray-600 font-semibold text-sm">Daily Earning</span>
		<h5 className="font-semibold">10k KSM</h5>
		<span className="text-gray-600 font-semibold text-sm">Nominations</span>
		<h5 className="font-semibold">42</h5>
	</div>
);

const Top3Section = () => {
	return (
		<div className="flex items-center">
			<div className="mr-5"><TopNominatorCard /></div>
			<div className="mx-5"><TopNominatorCard /></div>
			<div className="mx-5"><TopNominatorCard /></div>
		</div>
	);
};

export default Top3Section;
