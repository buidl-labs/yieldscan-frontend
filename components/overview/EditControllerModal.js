import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	Spinner,
	useToast,
	Button,
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import { useAccounts, usePolkadotApi } from "@lib/store";
import { useState, useEffect } from "react";
import { CheckCircle, Circle } from "react-feather";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import editController from "@lib/polkadot/edit-controller";
import Identicon from "@components/common/Identicon";

const EditControllerModal = withSlideIn(({ styles, close, networkInfo }) => {
	const toast = useToast();
	const { apiInstance } = usePolkadotApi();
	const { stashAccount, accounts } = useAccounts();
	const [selectedAccount, setSelected] = useState();
	const [loadingAccount, setLoading] = useState(true);
	const [editLoading, setEditLoading] = useState(false);

	useEffect(() => {
		apiInstance.query.staking
			.bonded(stashAccount.address)
			.then((account) => {
				if (account.isSome) {
					const address = account.value.toString();
					const substrateAddress = encodeAddress(decodeAddress(address), 42);
					setSelected(substrateAddress);
				}
			})
			.catch((error) => {
				alert("Something went wrong, please reload!");
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		// setIsFilteringAccounts(true);
		if (accounts && accounts.length > 0) {
			const api = apiInstance;
			const queries = accounts.map((account) => [
				api.query.staking.ledger,
				account.address,
			]);

			api
				.queryMulti(queries, async (queryResults) => {
					const ledgerArray = await queryResults;
					const accountLedgers = accounts.map((account, index) => ({
						account,
						ledger: ledgerArray[index],
					}));
					const filteredAccounts = accountLedgers.filter(
						({ account: { address }, ledger }) => {
							const encodedAddress = encodeAddress(
								decodeAddress(address.toString()),
								networkInfo.addressPrefix
							);
							return (
								ledger &&
								((ledger.value.stash &&
									ledger.value.stash.toString() === encodedAddress) ||
									ledger.isNone)
							);
						}
					);
					const parsedFilteredAccounts = filteredAccounts.map(
						({ account }) => account
					);
					// setFilteredAccounts(parsedFilteredAccounts);
					// setIsFilteringAccounts(false);
				})

				.catch((err) => {
					throw err;
				});
		}
	}, [accounts]);

	const updateController = () => {
		setEditLoading(true);
		const stashId = stashAccount.address;
		const newControllerId = selectedAccount;
		editController(newControllerId, stashId, apiInstance, {
			onEvent: ({ message }) => {
				toast({
					title: "Info",
					description: message,
					status: "info",
					duration: 3000,
					position: "top-right",
					isClosable: true,
				});
			},
			onFinish: (failed, message) => {
				toast({
					title: failed ? "Failure" : "Success",
					description: message,
					status: failed ? "error" : "success",
					duration: 3000,
					position: "top-right",
					isClosable: true,
				});
				setEditLoading(false);
				close();
			},
		}).catch((error) => {
			setEditLoading(false);
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 3000,
				position: "top-right",
				isClosable: true,
			});
		});
	};

	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="40rem" {...styles} py={4}>
				<ModalHeader>
					<h3 className="px-3 text-2xl text-left self-start">
						Edit Controller
					</h3>
				</ModalHeader>
				<ModalCloseButton
					onClick={close}
					boxShadow="0 0 0 0 #fff"
					color="gray.400"
					backgroundColor="gray.100"
					rounded="1rem"
					mt={4}
					mr={4}
				/>
				<ModalBody>
					{loadingAccount ? (
						<div className="flex-center flex-col my-auto">
							<Spinner size="lg" />
							<span className="mt-8 text-sm text-gray-700">
								Fetching your current controller...
							</span>
						</div>
					) : (
						<div className="px-8 py-5">
							{/* <h3 className="text-xl">Select Controller Account</h3> */}
							<div className="mt-1 w-full px-5 py-2 overflow-y-scroll text-sm accounts-container">
								{accounts.map((account) => (
									<div
										key={account.address}
										className={`
											flex items-center rounded-lg border-1 border-gray-200 ${
												selectedAccount === account.address
													? "border-teal-500 border-2"
													: "border-2 transform hover:scale-105"
											} cursor-pointer px-3 py-3 mb-2 text-gray-600
								transition-all duration-300 ease-in-out
										`}
										onClick={() => setSelected(account.address)}
									>
										<Identicon address={account.address} size="3rem" />
										<div className="ml-2 flex flex-col">
											<p className="text-gray-800 text-base">
												{account.meta.name}
											</p>
											<p className="text-xs">{account.address}</p>
										</div>
									</div>
								))}
							</div>
							<div className="mt-5 flex-center">
								<Button
									px="8"
									py="2"
									mt="5"
									rounded="0.5rem"
									backgroundColor="teal.500"
									color="white"
									onClick={updateController}
									isLoading={editLoading}
								>
									Update Controller
								</Button>
							</div>
							<style jsx>{`
								.accounts-container {
									height: 20.5rem;
								}
							`}</style>
						</div>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditControllerModal;
