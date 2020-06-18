import { useState } from 'react';
import { get } from 'lodash';

const Transaction = ({ stashAccount, onConfirm }) => {
	const [editController, setEditController] = useState(false);
	// TODO: edit controller functionality

	return (
		<div className="mt-10">
			<div className="text-2xl">Transaction</div>
			<div className="relative mt-10 w-4/5 flex items-center rounded-lg bg-gray-100 px-4 py-2">
				<img src="http://placehold.it/255" className="w-12 h-12 rounded-full mr-5" />
				<div className="flex flex-col text-gray-800">
					<span className="font-semibold">{get(stashAccount, 'meta.name', 'Akshat Bhargava')}</span>
					<p className="text-sm">{get(stashAccount, 'address', 'DasX1jVCRMe5e2DN8XJjGQrWFkBkNvtRDRf5dkb6iUUGFfz')}</p>
				</div>
				<span className="absolute right-0 top-0 m-2 p-1 px-2 font-bold bg-gray-300 text-gray-800 rounded">Stash</span>
			</div>
			<button
				className={`
					mt-4 px-3 py-px text-gray-700 font-semibold rounded text-sm
					hover:text-white hover:bg-teal-500 transition duration-200
				`}
				onClick={() => setEditController(true)}
			>
				Edit Controller
			</button>
			<div className="flex flex-col w-48 border-2 border-gray-300 rounded-lg mt-16 px-4 py-2">
				<span className="text-teal-500">Amount</span>
				<span className="text-black text-xl">200 KSM</span>
				<span className="text-gray-600 text-sm">$100</span>
			</div>

			<button
				className="mt-12 px-12 py-2 shadow-lg rounded-lg text-white bg-teal-500"
				onClick={onConfirm}
			>
				Transact and Stake
			</button>
		</div>
	);
};

export default Transaction;
