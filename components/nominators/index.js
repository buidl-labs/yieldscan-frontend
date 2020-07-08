import { Avatar } from "@chakra-ui/core";
import Top3Section from "./Top3Section";
import NominationsTable from "./NominatorsTable";

const Nominators = () => {
	return (
		<div className="px-10 py-5">
			<h1 className="text-2xl text-gray-800 font-semibold">Nominators</h1>

			<div className="flex w-full">
				<div className="w-2/3 mr-4">
					<div className="mt-10">
						<p className="text-gray-600 font-thin mb-2">TOP NOMINATORS</p>
						<Top3Section />
					</div>
					<NominationsTable />
				</div>
				<div className="w-1/3 flex flex-col justify-around">
					<div className="shadow-xl flex flex-col rounded-lg pt-16 pb-10 px-12 text-white" style={{ background: '#1F495B' }}>
						<h1 className="text-4xl">1245</h1>
						<h3 className="text-lg">Active Nominations</h3>
					</div>
					<div className="shadow-xl flex flex-col rounded-lg pt-16 pb-10 px-12 text-white" style={{ background: '#1F495B' }}>
						<h1 className="text-4xl">1420 KSM</h1>
						<h3 className="text-lg">Total Amount Staked</h3>
					</div>
					<div className="shadow-xl flex flex-col rounded-lg pt-16 pb-10 px-12 bg-teal-500 text-white">
						<h1 className="text-4xl">1200 KSM</h1>
						<h3 className="text-lg">Total Rewards</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Nominators;
