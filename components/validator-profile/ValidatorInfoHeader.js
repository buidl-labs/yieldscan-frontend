import { Twitter, Link, ChevronRight, Mail } from "react-feather";
import { get, noop } from "lodash";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import Identicon from "@components/common/Identicon";
import ProfileBadge from "@components/common/ProfileBadge";

const ValidatorInfoHeader = ({
	stashId,
	vision = "",
	socialInfo,
	transparencyScore,
	stashAccount,
	openEditProfile = noop,
	toggleWalletConnect = noop,
}) => {
	const userStashId = get(stashAccount, "address");
	let userStashKusamaId;
	if (userStashId) {
		userStashKusamaId = encodeAddress(decodeAddress(userStashId), 2);
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
							<h3 className="mr-4 text-2xl text-gray-700 font-semibold">
								{get(socialInfo, "name") ||
									stashId.slice(0, 6) + "..." + stashId.slice(-6) ||
									"-"}
							</h3>
							{socialInfo.legal && <p className="text-gray-600">{get(socialInfo, "legal")}</p>}
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
					{!get(stashAccount, "address") && (
						<button
							className="flex items-center text-xs text-gray-700 hover:underline"
							onClick={toggleWalletConnect}
						>
							<span>Own this profile?</span>
							<ChevronRight size="1rem" className="text-gray-700" />
						</button>
					)}
					{userStashKusamaId === stashId && (
						<button
							className="flex items-center text-xs text-gray-700 hover:underline"
							onClick={openEditProfile}
						>
							<span>Edit Profile</span>
							<ChevronRight size="1rem" className="text-gray-700" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ValidatorInfoHeader;
