import { ChevronRight, Twitter, Link } from "react-feather";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import { get, noop } from "lodash";
import Identicon from "@components/common/Identicon";

const CouncilMemberInfoHeader = ({
	socialInfo,
	accountId,
	stashAccount,
	vision = '',
	toggleWalletConnect = noop,
	openEditProfile = noop,
}) => {
	const userStashId = get(stashAccount, 'address');
	let userStashKusamaId;
	if (userStashId) {
		userStashKusamaId = encodeAddress(decodeAddress(userStashId), 2);
	}

	const openWindow = (url) => {
		window.open(url, '_blank');
	};

	return (
		<div className="flex">
		<div className="mr-4">
			<Identicon address={accountId} size="4rem" />
		</div>
			<div className="flex flex-col w-full">
				<div className="flex justify-between items-center mb-2">
					<h3 className="text-2xl text-gray-700 font-semibold">{get(socialInfo, 'name') || '-'}</h3>
					<div className="flex items-center">
						{socialInfo.twitter && (
							<button
								className="mr-4 text-sm flex items-center hover:underline"
								style={{ color: '#1DA1F2' }}
								onClick={() => openWindow(`https://twitter.com/${socialInfo.twitter.slice(1)}`)}
							>
								<Twitter className="mr-1 mt-px" size="1rem" />
								<span>{get(socialInfo, 'twitter')}</span>
							</button>
						)}
						{socialInfo.web && (
							<button
								className="text-sm flex items-center hover:underline"
								onClick={() => openWindow(socialInfo.web)}
							>
								<Link className="mr-1 mt-px" size="1rem" />
								<span>{get(socialInfo, 'web')}</span>
							</button>
						)}
					</div>
				</div>
				<p className="text-gray-500 text-sm mb-2">
					{vision}
				</p>
				<div>
					{!get(stashAccount, 'address') && (
						<button
							className="flex items-center text-xs text-gray-700 hover:underline"
							onClick={toggleWalletConnect}
						>
							<span>Own this profile? Connect Wallet now to verify</span>
							<ChevronRight size="1rem" className="text-gray-700" />
						</button>
					)}
					{(true || userStashKusamaId === accountId) && (
						<button className="flex items-center text-xs text-gray-700 hover:underline" onClick={openEditProfile}>
							<span>Edit Profile</span>
							<ChevronRight size="1rem" className="text-gray-700" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default CouncilMemberInfoHeader;