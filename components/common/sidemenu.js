import { Home, UserCheck, Users, Sliders, Globe } from 'react-feather';

const MenuOption = ({ children, Icon, selected = false }) => {
	return (
		<div className={`rounded-full mx-1 px-5 py-1 mb-2 ${selected && 'teal-500-light py-2'}`}>
			<button className={`
				flex-center font-light text-xl
				${selected ? 'text-teal-500' : 'text-gray-600'}
			`}>
				<Icon size="1.25rem" className="mr-2 mb-px" />
				<span>{children}</span>
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
		<div className="px-4 mt-10">
			<MenuOption Icon={Home} selected>Overview</MenuOption>
			<MenuOption Icon={Sliders}>Calculator</MenuOption>
			<MenuOption Icon={UserCheck}>Validators</MenuOption>
			<MenuOption Icon={Users}>Nominators</MenuOption>
			<MenuOption Icon={Globe}>Governance</MenuOption>
		</div>
	);
};

export default SideMenu;
