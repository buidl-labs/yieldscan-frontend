import { Avatar } from "@chakra-ui/core";

const Nominators = () => {
	return (
		<div className="px-10 py-5">
			<h1 className="text-2xl text-gray-800 font-semibold">Nominators</h1>

			<div className="flex w-full">
				<div className="w-2/3 mr-4">
					<div className="mt-10">
						<p className="text-gray-600 font-thin">TOP NOMINATORS</p>
						<div className="flex items-center">
							<div className="px-10 py-8 flex-center flex-col rounded-lg shadow-xl">
								<Avatar mb="1rem" />
								<h3 className="text-xl font-bold mb-4">Nominator Name</h3>
								<span className="text-gray-600 font-semibold text-sm">Daily Earning</span>
								<h5 className="">10k KSM</h5>
								<span className="text-gray-600 font-semibold text-sm">Nominations</span>
								<h5 className="">42</h5>
							</div>
						</div>
					</div>
				</div>
				<div className="w-1/3 flex flex-col">
					<h1>cards here</h1>
				</div>
			</div>
		</div>
	);
};

export default Nominators;
