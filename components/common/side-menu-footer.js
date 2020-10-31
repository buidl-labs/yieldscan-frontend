import { FaDiscord, FaTelegram } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MenuOption } from "@components/common/sidemenu";
import { useRouter } from "next/router";
import Routes from "@lib/routes";

const SideMenuFooter = () => {
	const router = useRouter();

	return (
		<div className="text-gray-600 px-4 w-full">
			<MenuOption
				label="Request Features"
				href="https://yieldscan.upvoty.com/b/yieldscan/"
				isExternal
			/>
			<MenuOption
				label="Settings"
				selected={router.pathname === Routes.SETTINGS}
				href={Routes.SETTINGS}
			/>
			<div className="flex px-5 mt-8">
				<a
					target="_blank"
					href="https://discord.gg/5Dggqx8"
					className="mr-8 hover:text-teal-500"
				>
					<FaDiscord size="24px" className="mr-2" />
				</a>
				<a
					target="_blank"
					href="https://t.me/yieldscan"
					className="mr-8 hover:text-teal-500"
				>
					<FaTelegram size="24px" className="mr-2" />
				</a>
				<a
					href="mailto:karan@buidllabs.io"
					target="_blank"
					className="hover:text-teal-500"
				>
					<IoIosMail size="24px" />
				</a>
			</div>
		</div>
	);
};

export default SideMenuFooter;
