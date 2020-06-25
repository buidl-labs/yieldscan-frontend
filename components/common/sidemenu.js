import { Home, UserCheck, Users, Sliders, Globe } from 'react-feather';
import { useRouter } from 'next/router';
import Routes from '@lib/routes';

const MenuOption = ({ label, Icon, selected = false, onClick }) => {
	return (
		<div className={`rounded-full mx-1 px-5 py-1 mb-2 ${selected && 'teal-500-light py-2'}`}>
			<button
				className={`
					flex-center font-light text-xl
					${selected ? 'text-teal-500' : 'text-gray-600'}
				`}
				onClick={onClick}
			>
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
	const router = useRouter();

	return (
		<div className="px-4">
			<MenuOption
				label="Overview"
				Icon={Home}
				selected={router.pathname === Routes.DASHBOARD}
				onClick={() => router.push(Routes.DASHBOARD)}
			/>
			<MenuOption
				label="Calculator"
				Icon={Sliders}
				selected={router.pathname === Routes.CALCULATOR}
				onClick={() => router.push(Routes.CALCULATOR)}
			/>
			<MenuOption
				label="Validators"
				Icon={UserCheck}
				selected={router.pathname === Routes.VALIDATORS}
				onClick={() => router.push(Routes.VALIDATORS)}
			/>
			<MenuOption
				label="Nominators"
				Icon={Users}
				selected={router.pathname === Routes.NOMINATORS}
				onClick={() => router.push(Routes.NOMINATORS)}
			/>
			<MenuOption
				label="Governance"
				Icon={Globe}
				selected={router.pathname === Routes.GOVERNANCE}
				onClick={() => router.push(Routes.GOVERNANCE)}
			/>
		</div>
	);
};

export default SideMenu;
