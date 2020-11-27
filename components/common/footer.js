import { useAccounts, useHeaderLoading } from "@lib/store";
import Link from "next/link";
import React from "react";
import { FaDiscord, FaTelegram } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";


const Footer = () => {
	const { accountInfoLoading } = useAccounts();
	const { headerLoading } = useHeaderLoading();
	return (
		!accountInfoLoading &&
		!headerLoading && (
			<footer className="w-full mb-12 px-8">
				<hr className="border border-gray-200 my-8" />{" "}
				<div className="flex justify-between text-gray-600 px-8">
					<p>
						Made with ❤️ by{" "}
						<a
							href="https://buidllabs.io"
							className="underline hover:text-teal-500"
							target="_blank"
						>
							BUIDL Labs
						</a>
					</p>
					<div className="flex items-center flex-wrap">
						<div>
							<Link href="/about">
								<a className="mr-8 hover:text-teal-500">About</a>
							</Link>
							<Link href="/privacy">
								<a className="mr-8 hover:text-teal-500">Privacy</a>
							</Link>
							<Link href="/terms">
								<a className="mr-8 hover:text-teal-500">Terms</a>
							</Link>
							<Link href="/disclaimer">
								<a className="mr-12 hover:text-teal-500">Disclaimer</a>
							</Link>
						</div>
						<div className="flex">
							<a
								target="_blank"
								href="https://discord.gg/5Dggqx8"
								className="mr-8 hover:text-teal-500"
							>
								<FaDiscord size="24px" />
							</a>
							<a
								target="_blank"
								href="https://t.me/yieldscan"
								className="mr-8 hover:text-teal-500"
							>
								<FaTelegram size="24px" />
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
				</div>
			</footer>
		)
	);
};

export default Footer;
