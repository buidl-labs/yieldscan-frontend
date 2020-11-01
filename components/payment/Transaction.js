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
	useDisclosure,
} from "@chakra-ui/core";
import formatCurrency from "@lib/format-currency";
import { GlossaryModal, HelpPopover } from "@components/reward-calculator";

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
											<p className="text-gray-700 font-medium">
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
	const {isOpen, onClose, onOpen} = useDisclosure()

	useEffect(() => {
		setController(selectedController.address);
	}, [selectedController]);

	// TODO: stakingAmount subCurrency version
	const stakingAmount = get(transactionState, "stakingAmount", 0);

	return (
		<React.Fragment>
			<GlossaryModal
				isOpen={isOpen}
				onClose={onClose}
				header="Stash Account"
				content={
					<p className="text-sm px-8">
						This account holds funds bonded for staking, but delegates some
						functions to a Controller. As a result, you may actively participate
						with a Stash key kept in a cold wallet, meaning it stays offline all
						the time.
					</p>
				}
			/>
			<div className="flex items-center">
				<h3 className="text-xl font-semibold">Controller</h3>
				<HelpPopover
					content={
						<p className="text-white text-xs">
							This account acts on behalf of the{" "}
							<span className="underline cursor-pointer" onClick={onOpen}>stash account</span>, signalling decisions
							about nominating and validating and also sets preferences like
							payout account. It only needs enough funds to pay transaction
							fees.
						</p>
					}
				/>
			</div>
			<div className="mr-2 flex items-center rounded-lg bg-gray-100 border border-gray-200 px-3 py-2 mb-2 w-full mt-4">
				<Identicon address={get(selectedController, "address")} size="3rem" />
				<div className="ml-2 flex flex-col">
					<h3 className="font-medium">
						{get(selectedController, "meta.name")}
					</h3>
					<p className="text-xs text-gray-600">
						{get(selectedController, "address")}
					</p>
				</div>
			</div>

			<button
				className={`
					mt-2 px-3 py-px text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-200 transition duration-200
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
		</React.Fragment>
	);
};

export default Transaction;
