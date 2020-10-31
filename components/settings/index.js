const { Divider } = require("@chakra-ui/core");
import Link from "next/link";
import { ChevronRight } from "react-feather";
import { FaDiscord, FaTelegram } from "react-icons/fa";

const Settings = () => {
	return (
		<div className="pt-12 text-gray-700">
			<h1 className="font-semibold text-xl">Settings</h1>
			<section id="community" className="mt-12">
				<h3 className="font-medium text-sm">Join Our Community</h3>
				<Divider />
				<div className="flex text-gray-700 mt-4">
					<a
						target="_blank"
						href="https://discord.gg/5Dggqx8"
						className="mr-12 flex text-sm items-center hover:text-teal-500"
					>
						<FaDiscord size="16px" className="mr-2" /> Discord
					</a>
					<a
						target="_blank"
						href="https://t.me/yieldscan"
						className="mr-12 flex text-sm items-center hover:text-teal-500"
					>
						<FaTelegram size="16px" className="mr-2" /> Telegram
					</a>
				</div>
			</section>
			<section id="legal" className="mt-12">
				<h3 className="font-medium text-sm">Legal</h3>
				<Divider />
				<div className="flex flex-col">
					<Link href="/privacy">
						<a
							target="_blank"
							className="flex justify-between px-2 text-sm py-2 my-1 rounded-lg hover:text-teal-500 hover:bg-gray-400 hover:bg-opacity-22"
						>
							Privacy Policy <ChevronRight />
						</a>
					</Link>
					<Link href="/terms">
						<a
							target="_blank"
							className="flex justify-between px-2 text-sm py-2 my-1 rounded-lg hover:text-teal-500 hover:bg-gray-400 hover:bg-opacity-22"
						>
							Terms of service <ChevronRight />
						</a>
					</Link>
					<Link href="/disclaimer">
						<a
							target="_blank"
							className="flex justify-between px-2 text-sm py-2 my-1 rounded-lg hover:text-teal-500 hover:bg-gray-400 hover:bg-opacity-22"
						>
							Disclaimer <ChevronRight />
						</a>
					</Link>
				</div>
			</section>
		</div>
	);
};

export default Settings;
