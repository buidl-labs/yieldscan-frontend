import withSlideIn from "@components/common/withSlideIn";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader
} from "@chakra-ui/core";
import CompoundRewardSlider from "@components/reward-calculator/CompoundRewardSlider";
import { useAccounts, usePolkadotApi } from "@lib/store";
import { useState } from "react";
import { Circle, CheckCircle } from "react-feather";
import { web3FromAddress } from "@polkadot/extension-dapp";

const RewardDestinationModal = withSlideIn(({ close, styles, onEditController }) => {
	const { apiInstance } = usePolkadotApi();
	const { stashAccount } = useAccounts();
	const [destination, setDestination] = useState('');
	const [compounding, setCompounding] = useState(false);

	const accounts = ['Stash'];
	if (!compounding) accounts.push('Controller');

	const updatePayee = () => {
		const payee = compounding ? 0 : destination === 'Stash' ? 1 : 2;
		const stashId = stashAccount.address;
		web3FromAddress(stashId).then(injector => {
			apiInstance.setSigner(injector.signer);
			apiInstance._extrinsics.staking
				.setPayee(payee)
				.signAndSend(stashId)
				.then(() => {
					// handle 
				}).catch(error => {

				});
		});
	};

	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="40rem" height="36rem" {...styles}>
				<ModalHeader>
				<h1>Payment Destination</h1>
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody>
					<div className="px-20 py-5">
						<h1 className="text-xl">Compound Rewards</h1>
						<span className="text-gray-600 text-sm">Your rewards will be locked for staking over the specified time period</span>
						<div className="mt-5">
							<CompoundRewardSlider
								checked={compounding}
								setChecked={setCompounding}
							/>
						</div>
						<div className="mt-8">
							<h1 className="text-lg">Selected Account</h1>
							<div className="mt-4">
								{accounts.length > 1 ? accounts.map(accountType => (
									<div
										key={accountType}
										className={`
											w-full flex items-center rounded-lg border-2 border-teal-500 cursor-pointer px-3 py-2 mb-2
											${accountType === destination ? 'text-white bg-teal-500' : 'text-gray-600'}
										`}
										onClick={() => setDestination(accountType)}
									>
										{destination === accountType ? (
											<CheckCircle className="mr-2" />
										) : (
											<Circle className="mr-2" />
										)}
										<div className="flex flex-col">
											<span>{accountType}</span>
										</div>
									</div>
								)) : (
									<div className="h-24">
										<span className="text-orange-500 text-sm font-semibold">
											When compounding is enabled, reward destination can only be stash account.
										</span>
										<div className="mt-2 flex items-center rounded-lg text-white bg-teal-500 cursor-pointer px-3 py-2 mb-2">
											<div className="flex flex-col">
												<h3>{stashAccount.meta.name}</h3>
												<span className="text-sm">{stashAccount.address}</span>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
						<button
							className="text-sm text-gray-600 hover:underline"
							onClick={onEditController}
						>
							Edit Controller
						</button>
						<div className="mt-24 flex-center">
							<button
								className="rounded py-2 px-10 bg-teal-500 text-white"
								onClick={updatePayee}
							>
								Update
							</button>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default RewardDestinationModal;
