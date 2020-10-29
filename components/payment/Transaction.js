import { useState, useEffect } from "react";
import { get } from "lodash";
import { Circle, CheckCircle } from "react-feather";
import Identicon from "@components/common/Identicon";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
} from "@chakra-ui/core";
import formatCurrency from "@lib/format-currency";

const EditControllerModal = ({
	isOpen,
	onClose,
	accounts,
	selectedController,
	setSelectedController,
	setControllerEdited,
}) => {
	return (
		<React.Fragment>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent rounded="lg" maxWidth="40rem" py={4}>
					<ModalHeader>
						<h3 className="px-3 text-2xl text-left self-start">
							Edit Controller
						</h3>
					</ModalHeader>
					<ModalCloseButton
						onClick={onClose}
						boxShadow="0 0 0 0 #fff"
						color="gray.400"
						backgroundColor="gray.100"
						rounded="1rem"
						mt={4}
						mr={4}
					/>
					<ModalBody>
						{" "}
						<div className="pb-8 self-stretch rounded-lg">
							<div className="px-5 py-2 overflow-y-scroll text-sm accounts-container">
								{accounts.map((account) => (
									<div
										key={account.address}
										className={`
								flex items-center rounded-lg border-1 border-gray-200 ${
									selectedController === account
										? "border-teal-500 border-2"
										: "border-2 transform hover:scale-105"
								} cursor-pointer px-3 py-3 mb-2 text-gray-600
								transition-all duration-300 ease-in-out
							`}
										onClick={() => {
											setSelectedController(account);
											setControllerEdited(true);
											onClose();
										}}
									>
										<Identicon address={get(account, "address")} size="3rem" />
										<div className="ml-2 flex flex-col">
											<p className="text-gray-800 text-base">
												{account.meta.name}
											</p>
											<p className="text-xs">{account.address}</p>
										</div>
									</div>
								))}
							</div>
						</div>
						{/* <div className="flex justify-center">
						<button
							className={`
						flex items-center px-12 py-3 text-white rounded-lg
						${false ? "bg-teal-500" : "bg-gray-400 cursor-not-allowed"}
					`}
					// onClick={}
						>
							<span>Proceed</span>
						</button>
					</div> */}
					</ModalBody>
				</ModalContent>
			</Modal>
			<style jsx>{`
				.accounts-container {
					height: 23rem;
				}
			`}</style>
		</React.Fragment>
	);
};

const Transaction = ({
	accounts,
	stashAccount,
	stakingLoading,
	transactionState,
	setController,
	onConfirm,
	networkInfo,
}) => {
	const [editController, setEditController] = useState(false);
	const compounding = get(transactionState, "compounding", true);
	const [selectedController, setSelectedController] = useState(stashAccount);
	const [controllerEdited, setControllerEdited] = useState(false);

	useEffect(() => {
		setController(selectedController.address);
	}, [selectedController]);

	// TODO: stakingAmount subCurrency version
	const stakingAmount = get(transactionState, "stakingAmount", 0);

	return (
		<div className="mt-10">
			{/* <div className="text-2xl">Transaction</div>
			<h3 className="text-lg mt-10 mb-4 ml-2 font-semibold">
				{controllerEdited && "Stash "} Account
			</h3>
			<div className="w-full flex items-center rounded-lg bg-gray-100 px-4 py-4 border border-gray-200">
				<div className="mr-5">
					<Identicon address={get(stashAccount, "address")} size="3.25rem" />
				</div>
				<div className="flex flex-col text-gray-800">
					<div>
						<h3 className="font-semibold text-lg inline">
							{get(stashAccount, "meta.name")}
						</h3>
						{controllerEdited && (
							<span className="text-xs mx-4 p-1 px-2 font-bold bg-gray-300 text-gray-600 tracking-wide rounded-full">
								STASH
							</span>
						)}
					</div>

					<p className="text-xs text-gray-600 mt-1">
						{get(stashAccount, "address")}
					</p>
				</div>
			</div> */}

			<h3 className="text-lg mt-10 mb-4 ml-2 font-semibold">
				Controller Account
			</h3>
			<div className="w-full flex items-center rounded-lg bg-gray-100 px-4 py-4 border border-gray-200">
				<div className="mr-5">
					<Identicon
						address={get(selectedController, "address")}
						size="3.25rem"
					/>
				</div>
				<div className="flex flex-col text-gray-800">
					<div>
						<h3 className="font-semibold text-lg inline">
							{get(selectedController, "meta.name")}
						</h3>
						<span className="text-xs mx-4 p-1 px-2 font-bold bg-gray-300 text-gray-600 tracking-wide rounded-full">
							CONTROLLER
						</span>
					</div>
					<p className="text-xs text-gray-600 mt-1">
						{get(selectedController, "address")}
					</p>
				</div>
			</div>

			<button
				className={`
					mt-4 px-3 py-px text-gray-600 border border-gray-300 font-semibold rounded text-sm hover:bg-gray-200 transition duration-200
				`}
				hidden={editController}
				onClick={() => setEditController(true)}
			>
				Edit Controller
			</button>

			<EditControllerModal
				isOpen={editController}
				onClose={() => setEditController(false)}
				accounts={accounts}
				selectedController={selectedController}
				setSelectedController={setSelectedController}
				setControllerEdited={setControllerEdited}
			/>

			{/* <div className="flex flex-col w-48 border-2 border-gray-300 rounded-lg mt-12 px-4 py-2">
				<span className="text-teal-500">Amount</span>
				<span className="text-black text-xl">
					{formatCurrency.methods.formatAmount(
						Math.trunc(stakingAmount * 10 ** networkInfo.decimalPlaces),
						networkInfo
					)}
				</span>
			</div>
			<button
				hidden={stakingLoading}
				className="mt-12 px-12 py-2 shadow-lg rounded-lg text-white bg-teal-500"
				onClick={onConfirm}
			>
				Transact and Stake
			</button> */}
		</div>
	);
};

export default Transaction;
