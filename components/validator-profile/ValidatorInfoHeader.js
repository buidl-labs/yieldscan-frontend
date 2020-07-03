import { Twitter, Link, ChevronRight } from "react-feather";
import { get } from "lodash";

const ValidatorInfoHeader = ({ stashId, socialInfo }) => {
	const openWindow = (url) => {
		window.open(url, '_blank');
	};
	
	return (
		<div className="flex">
			<img src="http://placehold.it/300" className="w-24 h-24 mr-5 rounded-full" />
			<div className="flex flex-col">
				<div className="flex justify-between items-center mb-2">
					<h3 className="text-2xl text-gray-700 font-semibold">{get(socialInfo, 'name', stashId)}</h3>
					<div className="flex items-center">
						<button
							className="mr-4 text-sm flex items-center hover:underline"
							style={{ color: '#1DA1F2' }}
							onClick={() => openWindow(`https://twitter.com/${socialInfo.twitter.slice(1)}`)}
						>
							<Twitter className="mr-1 mt-px" size="1rem" />
							<span>{get(socialInfo, 'twitter')}</span>
						</button>
						<button
							className="text-sm flex items-center hover:underline"
							onClick={() => openWindow(socialInfo.web)}
						>
							<Link className="mr-1 mt-px" size="1rem" />
							<span>{get(socialInfo, 'web')}</span>
						</button>
					</div>
				</div>
				<p className="text-gray-500 text-sm mb-2">
					Staked runs the most reliable and secure validation services for crypto investors. The smartest investors in crypto choose Staked because of our secure technology and offerings that encompass the most proof-of-stake chains.
				</p>
				<div>
					<button className="flex items-center text-xs text-gray-700 hover:underline">
						<span>Own this profile? Connect Wallet now to verify</span>
						<ChevronRight size="1rem" className="text-gray-700" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default ValidatorInfoHeader;
