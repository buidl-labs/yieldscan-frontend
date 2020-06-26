import { Edit2 } from "react-feather";
import OverviewCards from "./OverviewCards";
import NominationsTable from "./NominationsTable";

const Overview = () => {
	return (
		<div className="px-10 py-10">
			<OverviewCards />
			<div className="mt-10">
				<div className="flex justify-between items-center">
					<h3 className="text-2xl">My Validators</h3>
					<div className="flex items-center">
						<button className="flex items-center text-gray-500 mr-5 p-1">
							<Edit2 size="20px" className="mr-2" />
							<span>Edit Validators</span>
						</button>
						<button className="text-teal-500 p-1">Claim All Rewards</button>
					</div>
				</div>
				<NominationsTable />
			</div>
		</div>
	);
};

export default Overview;
