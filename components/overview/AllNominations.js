import Identicon from '@components/common/Identicon';
import { ExternalLink } from 'react-feather';

const AllNominations = ({ nominations, onProfile }) => {
	return (
		<div className="py-2 flex items-center flex-wrap">
			{nominations.map(nomination => (
				<div key={nomination} className="flex items-center border border-gray-400 rounded-xl px-3 py-1 my-2 mr-4 w-64">
					<div className="mr-2">
						<Identicon address={nomination} size="3rem" />
					</div>
					<div className="text-gray-700 cursor-pointer">
						<span className="font-semibold select-all">{nomination.slice(0, 15) + '...'}</span>
						<div className="flex items-center">
							<span className="text-xs mr-2">View Profile</span>
							<ExternalLink size="12px" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default AllNominations;
