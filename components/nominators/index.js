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
				<div className="w-1/3 flex flex-col">
					<h1>cards here</h1>
				</div>
			</div>
		</div>
	);
};

export default Nominators;
