import { useAccounts, useHeaderLoading } from "@lib/store";
import Link from "next/link";
import React from "react";
import { Mail } from "react-feather";

const Footer = () => {
	const { accountInfoLoading } = useAccounts();
	const { headerLoading } = useHeaderLoading();
	return (
		!accountInfoLoading &&
		!headerLoading && (
			<footer className="w-full mb-12 px-8">
				<hr className="border-2 border-teal-700 my-8 opacity-10" />{" "}
				<div className="flex justify-between text-gray-600 px-8">
					<p>
						Made with ❤️ by{" "}
						<a
							href="https://buidllabs.io"
							className="underline"
							target="_blank"
						>
							BUIDL Labs
						</a>
					</p>
					<div className="flex items-center flex-wrap">
						<div>
							<Link href="/privacy">
								<a className="mr-8">Privacy</a>
							</Link>
							<Link href="/terms">
								<a className="mr-8">Terms</a>
							</Link>
							<Link href="/disclaimer">
								<a className="mr-12">Disclaimer</a>
							</Link>
						</div>
						<div className="flex">
							<a
								target="_blank"
								href="https://discord.gg/5Dggqx8"
								className="mr-4"
							>
								<img src="/images/discord-logo.svg" alt="Discord Community" />
							</a>
							<a target="_blank" href="https://t.me/yieldscan" className="mr-4">
								<img src="/images/telegram-logo.svg" alt="Telegram Community" />
							</a>
							<a
								className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-900"
								href="mailto:karan@buidllabs.io"
								target="_blank"
							>
								<Mail size="1rem" />
							</a>
						</div>
					</div>
				</div>
			</footer>
		)
	);
};

export default Footer;
