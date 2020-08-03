import { ExternalLink } from 'react-feather';
import Identicon from '@components/common/Identicon';
import Routes from '@lib/routes';

const AllNominations = ({ nominations = [], }) => {
	const onProfile = (validatorId) => window.open(`${Routes.VALIDATOR_PROFILE}/${validatorId}`, '_blank');

	return (
		<div className="py-2 flex items-center flex-wrap">
			{nominations.map(nomination => (
				<div key={nomination} className="flex items-center border border-gray-400 rounded-xl px-3 py-1 my-2 mr-4 w-64">
					<div className="mr-2">
						<Identicon address={nomination} size="3rem" />
					</div>
					<div className="text-gray-700 cursor-pointer">
						<span className="font-semibold select-all">{nomination.slice(0, 15) + '...'}</span>
						<div className="flex items-center" onClick={() => onProfile(nomination)}>
							<span className="text-xs mr-2">View Profile</span>
							<ExternalLink size="12px" />
						</div>
					</div>
				</div>
			))}
			{!nominations.length && (
				<div className="mt-5">
					<span className="text-xl font-thin text-gray-700">No Nominations!</span>
				</div>
			)}
		</div>
	);
};

export default AllNominations;
