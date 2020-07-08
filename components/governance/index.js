const { default: MembersTable } = require("./MembersTable")

const Governance = () => {
	return (
		<div  className="px-10 py-10">
			<h1 className="text-2xl text-gray-600 font-semibold">Council Members</h1>
			<MembersTable />
		</div>
	);
};

export default Governance;
