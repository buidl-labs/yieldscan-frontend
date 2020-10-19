import { Twitter, Link, ChevronRight, Mail, Eye } from "react-feather";
import { get, noop } from "lodash";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import Identicon from "@components/common/Identicon";
import ProfileBadge from "@components/common/ProfileBadge";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverBody,
} from "@chakra-ui/core";

const ValidatorInfoHeader = ({
	stashId,
	vision = "",
	socialInfo,
	transparencyScore,
	stashAccount,
	openEditProfile = noop,
	toggleWalletConnect = noop,
	networkInfo,
}) => {
	const userStashId = get(stashAccount, "address");
	let userStashKusamaId;
	if (userStashId) {
		userStashKusamaId = encodeAddress(
			decodeAddress(userStashId),
			networkInfo.addressPrefix
		);
	}

	const openWindow = (url) => {
		window.open(url, "_blank");
	};

	return (
		<div className="flex">
			<div className="mr-4">
				<Identicon address={stashId} size="4rem" />
			</div>
			<div className="flex flex-col w-full">
				<div className="flex justify-between items-center mb-2">
					<div className="flex items-center">
						<div>
							<h3 className="mr-4 text-xl text-gray-700 font-semibold">
								{get(socialInfo, "name") ||
									stashId.slice(0, 6) + "..." + stashId.slice(-6) ||
									"-"}
							</h3>
							{socialInfo.legal && (
								<p className="text-gray-600 text-sm">
									{get(socialInfo, "legal")}
								</p>
							)}
						</div>
						<ProfileBadge score={transparencyScore.total} />
					</div>
					<div className="flex items-center">
						{socialInfo.twitter && (
							<button
								className="mr-4 text-sm flex items-center hover:underline"
								style={{ color: "#1DA1F2" }}
								onClick={() =>
									openWindow(
										`https://twitter.com/${socialInfo.twitter.slice(1)}`
									)
								}
							>
								<Twitter className="mr-1 mt-px" size="1rem" />
								<span>{get(socialInfo, "twitter")}</span>
							</button>
						)}
						{socialInfo.riot && (
							<button
								className="mr-4 text-sm flex items-center hover:underline"
								style={{ color: "#0dbd8b" }}
								onClick={() =>
									openWindow(`https://app.element.io/#/user/${socialInfo.riot}`)
								}
							>
								<img
									src="/images/riot-logo.svg"
									alt="riot-logo"
									className="h-4 w-4 mr-1"
								/>
								<span>{get(socialInfo, "riot")}</span>
							</button>
						)}
						{socialInfo.web && (
							<button
								className="mr-4 text-sm flex items-center hover:underline"
								onClick={() => openWindow(socialInfo.web)}
							>
								<Link className="mr-1 mt-px" size="1rem" />
								<span>{get(socialInfo, "web")}</span>
							</button>
						)}
						{socialInfo.email && (
							<a
								className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
								href={`mailto:${get(socialInfo, "email")}`}
								target="_blank"
							>
								<Mail size="1rem" />
								{/* <span>{get(socialInfo, "email")}</span> */}
							</a>
						)}
					</div>
				</div>
				<p className="text-gray-500 text-sm mb-2">{vision}</p>
				<div>
					{get(stashAccount, "address") ? (
						userStashKusamaId === stashId ? (
							<button
								className="flex items-center text-xs text-gray-700 hover:underline"
								onClick={openEditProfile}
							>
								<span>Edit Profile</span>
								<ChevronRight size="1rem" className="text-gray-700" />
							</button>
						) : (
							<Popover trigger="hover">
								<PopoverTrigger>
									<span className="text-gray-900 text-xs flex items-center cursor-help w-fit-content">
										<Eye size="0.75rem" />{" "}
										<span className="ml-1">View Only</span>
									</span>
								</PopoverTrigger>
								<PopoverContent
									zIndex={4}
									padding="0"
									rounded="10px"
									color="gray.200"
									textAlign="center"
									backgroundColor="#35475C"
									border="none"
									width="auto"
								>
									<PopoverArrow />
									<PopoverBody fontSize="sm">
										Your selected address does not match this validator’s
										address. If you own this profile, then select the same
										address from the navbar.
									</PopoverBody>
								</PopoverContent>
							</Popover>
						)
					) : (
						<button
							className="flex items-center text-xs text-gray-700 hover:underline"
							onClick={toggleWalletConnect}
						>
							<span>Own this profile?</span>
							<ChevronRight size="1rem" className="text-gray-700" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ValidatorInfoHeader;
