import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { Circle, CheckCircle } from 'react-feather';

const Transaction = ({
	accounts,
	stashAccount,
	stakingLoading,
	transactionState,
	setController,
	onConfirm
}) => {
	const [editController, setEditController] = useState(false);
	const [selectedController, setSelectedController] = useState(stashAccount);
	const [controllerEdited, setControllerEdited] = useState(false);

	useEffect(() => {
		setController(selectedController.address);
	}, [selectedController]);

	// TODO: stakingAmount subCurrency version
	const stakingAmount = get(transactionState, 'stakingAmount', 0);

	const resetController = () => {
		setEditController(false);
		setSelectedController(stashAccount.address);
	};

	return (
		<div className="mt-10">
			<div className="text-2xl">Transaction</div>
			<div className="relative mt-10 w-4/5 flex items-center rounded-lg bg-gray-100 px-4 py-2">
				<img src="http://placehold.it/255" className="w-12 h-12 rounded-full mr-5" />
				<div className="flex flex-col text-gray-800">
					<span className="font-semibold">{get(stashAccount, 'meta.name')}</span>
					<p className="text-sm">{get(stashAccount, 'address')}</p>
				</div>
				<span className="text-sm absolute right-0 top-0 m-2 p-1 px-2 font-bold bg-gray-300 text-gray-800 rounded">Stash</span>
			</div>
			{controllerEdited && (
				<div className="relative mt-10 w-4/5 flex items-center rounded-lg bg-gray-100 px-4 py-2">
					<img src="http://placehold.it/255" className="w-12 h-12 rounded-full mr-5" />
					<div className="flex flex-col text-gray-800">
						<span className="font-semibold">{get(selectedController, 'meta.name')}</span>
						<p className="text-sm">{get(selectedController, 'address')}</p>
					</div>
					<span className="text-sm absolute right-0 top-0 m-2 p-1 px-2 font-bold bg-gray-300 text-gray-800 rounded">Controller</span>
				</div>
			)}
			<button
				className={`
					mt-4 px-3 py-px text-gray-700 font-semibold rounded text-sm
					hover:text-white hover:bg-teal-500 transition duration-200
				`}
				hidden={editController}
				onClick={() => setEditController(true)}
			>
				Edit Controller
			</button>

			<div className="mt-10" hidden={!editController}>
				<h3 className="text-lg text-gay-600">
					Edit Controller
					<button className="text-sm ml-4 font-semibold text-orange-500" onClick={resetController}>Cancel</button>
				</h3>
				<div className="mt-1 overflow-y-scroll text-sm h-40 w-4/5">
					{accounts.map(account => (
						<div
							key={account.address}
							className={`
								flex items-center rounded-lg border-2 border-teal-500 cursor-pointer px-3 py-2 mb-2
								${get(selectedController, 'address') === account.address ? 'text-white bg-teal-500' : 'text-gray-600'}
							`}
							onClick={() => {
								setSelectedController(account); // update controller
								setEditController(false); // close the edit inline modal
								setControllerEdited(true); // show the card
							}}
						>
							{get(selectedController, 'address') === account.address ? (
								<CheckCircle className="mr-2" />
							) : (
								<Circle className="mr-2" />
							)}
							<div className="flex flex-col">
								<span>{account.meta.name}</span>
								<p>{account.address}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="flex flex-col w-48 border-2 border-gray-300 rounded-lg mt-12 px-4 py-2">
				<span className="text-teal-500">Amount</span>
				<span className="text-black text-xl">{stakingAmount} KSM</span>
				<span className="text-gray-600 text-sm">${stakingAmount * 2}</span>
			</div>

			<button
				hidden={stakingLoading}
				className="mt-12 px-12 py-2 shadow-lg rounded-lg text-white bg-teal-500"
				onClick={onConfirm}
			>
				Transact and Stake
			</button>
		</div>
	);
};

export default Transaction;
