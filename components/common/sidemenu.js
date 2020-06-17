import { Home, UserCheck, Users, Sliders, Globe, Info } from 'react-feather';

const MenuOption = ({ label, Icon, selected = false }) => {
	return (
		<div className={`rounded-full mx-1 px-5 py-1 mb-2 ${selected && 'teal-500-light py-2'}`}>
			<button className={`
				flex-center font-light text-xl
				${selected ? 'text-teal-500' : 'text-gray-600'}
			`}>
				<Icon size="1.125rem" className="mr-2 mb-px" />
				<span className="font-semibold">{label}</span>
			</button>
			<style jsx>{`
				.teal-500-light {
					background: rgba(43, 202, 202, 0.22);
				}
			`}</style>
		</div>
	);
};

const SideMenu = () => {
	return (
		<div className="px-4">
			<MenuOption
				label="Overview"
				Icon={Home}
			/>
			<MenuOption
				label="Calculator"
				Icon={Sliders}
				selected
			/>
			<MenuOption
				label="Validators"
				Icon={UserCheck}
			/>
			<MenuOption
				label="Nominators"
				Icon={Users}
			/>
			<MenuOption
				label="Governance"
				Icon={Globe}
			/>
		</div>
	);
};

export default SideMenu;
