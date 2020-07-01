import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	Spinner,
	useToast
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import { useAccounts, usePolkadotApi } from "@lib/store";
import { useState, useEffect } from "react";
import { CheckCircle, Circle } from "react-feather";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import { web3FromAddress } from "@polkadot/extension-dapp";

const EditControllerModal = withSlideIn(({ styles, close }) => {
	const toast = useToast();
	const { apiInstance } = usePolkadotApi();
	const { stashAccount, accounts } = useAccounts();
	const [selectedAccount, setSelected] = useState();
	const [loadingAccount, setLoading] = useState(true);

	useEffect(() => {
		apiInstance.query.staking.bonded(stashAccount.address).then(account => {
			const address = account.value.toString();
			const substrateAddress = encodeAddress(decodeAddress(address), 42);
			setSelected(substrateAddress);
		}).catch((error) => {
			console.log(error);
			alert('Something went wrong, please reload!');
		}).finally(() => {
			setLoading(false);
		});
	}, []);

	const updateController = () => {
		const stashId = stashAccount.address;
		const newControllerId = selectedAccount;
		web3FromAddress(stashId).then(injector => {
			apiInstance.setSigner(injector.signer);
			apiInstance.tx.staking
				.setController(newControllerId)
				.signAndSend(stashId)
				.then(({ events = [], status }) => {
					toast({
						title: 'Success',
						description: 'Controller account updated.',
						status: 'success',
						position: 'top-right',
						duration: 3000
					});
					close();
				}).catch(error => {
					toast({
						title: 'Failure',
						description: error.message,
						status: 'error',
						position: 'top-right',
						duration: 3000
					});
				});
			});
	}

	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="40rem" height="36rem" {...styles}>
				<ModalHeader>
				<h1>Edit Controller</h1>
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody>
					{loadingAccount ? (
						<div className="flex-center flex-col my-auto">
							<Spinner size="lg" />
							<span className="mt-5 text-sm text-gray-700">Fetching your current controller...</span>
						</div>
					) : (
						<div className="px-20 py-5">
							<h3 className="text-xl">Select Controller Account</h3>
							<div className="mt-4 overflow-y-scroll text-sm accounts-container">
								{accounts.map(account => (
									<div
										key={account.address}
										className={`
											flex items-center rounded-lg border-2 border-teal-500 cursor-pointer px-3 py-2 mb-2
											${selectedAccount === account.address ? 'text-white bg-teal-500' : 'text-gray-600'}
										`}
										onClick={() => setSelected(account.address)}
									>
										{selectedAccount === account.address ? (
											<CheckCircle className="mr-2" />
										) : (
											<Circle className="mr-2" />
										)}
										<div className="flex flex-col">
											<span>{account.meta.name}</span>
											<p className="text-xs">{account.address}</p>
										</div>
									</div>
								))}
							</div>
							<div className="mt-5 flex-center">
								<button
									className="rounded-lg bg-teal-500 text-white px-5 py-2"
									onClick={updateController}
								>
									Update Controller
								</button>
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
