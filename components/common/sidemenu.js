import { Home, UserCheck, Users, Sliders, Globe } from "react-feather";
import { useRouter } from "next/router";
import Link from "next/link";
import Routes from "@lib/routes";

const MenuOption = ({ label, Icon, selected = false, href }) => {
	return (
		<Link href={href}>
			<a
				className={`
					block
					${!selected && "hover:text-teal-500 hover:ml-2"}
					rounded-full 
					px-5
					py-2
					mb-2 
					transition-all
					duration-300 ease-in-out
					text-sm min-w-fit-content
					${selected ? "text-teal-500 bg-teal-500 bg-opacity-22" : "text-gray-600"}
				`}
			>
				<Icon size="1rem" className="mr-2 mb-px inline" />
				<span>{label}</span>
			</a>
		</Link>
	);
};

const SideMenu = () => {
	const router = useRouter();

	return (
		<div className="px-4">
			<MenuOption
				label="Overview"
				Icon={Home}
				selected={router.pathname === Routes.OVERVIEW}
				href={Routes.OVERVIEW}
			/>
			<MenuOption
				label="Calculator"
				Icon={Sliders}
				selected={router.pathname === Routes.CALCULATOR}
				href={Routes.CALCULATOR}
			/>
			<MenuOption
				label="Validators"
				Icon={UserCheck}
				selected={router.pathname === Routes.VALIDATORS}
				href={Routes.VALIDATORS}
			/>
			<MenuOption
				label="Nominators"
				Icon={Users}
				selected={router.pathname === Routes.NOMINATORS}
				href={Routes.NOMINATORS}
			/>
			<MenuOption
				label="Governance"
				Icon={Globe}
				selected={router.pathname === Routes.GOVERNANCE}
				href={Routes.GOVERNANCE}
			/>
		</div>
	);
};

export default SideMenu;
