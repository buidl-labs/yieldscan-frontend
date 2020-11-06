import { useState, useEffect } from "react";
import { Edit2, AlertTriangle, ChevronRight } from "react-feather";
import OverviewCards from "./OverviewCards";
import NominationsTable from "./NominationsTable";
import ExpectedReturns from "./ExpectedReturns";
import { Spinner, useDisclosure, useToast, Collapse } from "@chakra-ui/core";
import axios from "@lib/axios";
import {
	useAccounts,
	usePolkadotApi,
	useSelectedNetwork,
	useOverviewData,
	useValidatorData,
} from "@lib/store";
import { useWalletConnect } from "@components/wallet-connect";
import { get, isNil, noop } from "lodash";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import RewardDestinationModal from "./RewardDestinationModal";
import EditControllerModal from "./EditControllerModal";
import FundsUpdate from "./FundsUpdate";
import EditValidators from "./EditValidators";
import ChillAlert from "./ChillAlert";
import Routes from "@lib/routes";
import { useRouter } from "next/router";
import AllNominations from "./AllNominations";
import { getNetworkInfo } from "yieldscan.config";
import EarningsOutput from "./EarningsOutput";

const Tabs = {
	ACTIVE_VALIDATORS: "validators",
	NOMINATIONS: "nominations",
};

const Overview = () => {
	const router = useRouter();
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const { toggle } = useWalletConnect();
	const { apiInstance } = usePolkadotApi();
	const {
		stashAccount,
		bondedAmount,
		activeStake,
		setFreeAmount,
		unlockingBalances,
		accountInfoLoading,
	} = useAccounts();
	const toast = useToast();
	const [loading, setLoading] = useState(true);
	const [nominationsLoading, setNominationsLoading] = useState(true); // work-around :(
	const [error, setError] = useState(false);
	const {
		userData,
		setUserData,
		allNominationsData,
		setAllNominations,
	} = useOverviewData();
	const { validators, setValidators } = useValidatorData();
	const [showValidators, setShowValidators] = useState(false);
	const [validatorsLoading, setValidatorsLoading] = useState(true);
	const [fundsUpdateModalType, setFundsUpdateModalType] = useState();
	const handleValToggle = () => setShowValidators(!showValidators);
	const [selectedTab, setSelectedTab] = useState(Tabs.NOMINATIONS);
	const {
		isOpen: isRewardDestinationModalOpen,
		onToggle: toggleRewardDestinationModal,
		onClose: closeRewardDestinationModal,
	} = useDisclosure();
	const {
		isOpen: editControllerModalOpen,
		onToggle: toggleEditControllerModal,
		onClose: closeEditControllerModal,
	} = useDisclosure();
	const {
		isOpen: fundsUpdateModalOpen,
		onToggle: toggleFundsUpdateModal,
		onClose: closeFundsUpdateModal,
	} = useDisclosure();
	const {
		isOpen: editValidatorModalOpen,
		onToggle: toggleEditValidatorsModal,
		onClose: closeEditValidatorsModal,
	} = useDisclosure();
	const {
		isOpen: chillAlertOpen,
		onToggle: toggleChillAlert,
		onClose: closeChillAlert,
	} = useDisclosure();

	useEffect(() => {
		setLoading(true);
		setError(false);
		setAllNominations(null);
		if (get(stashAccount, "address") && apiInstance) {
			const kusamaAddress = encodeAddress(
				decodeAddress(stashAccount.address),
				networkInfo.addressPrefix
			);
			axios
				.get(`/${networkInfo.coinGeckoDenom}/user/${kusamaAddress}`)
				.then(({ data }) => {
					if (data.message === "No data found!") setError(true);
					setUserData(data);
				})
				.catch(() => {
					setError(true);
				})
				.finally(() => {
					// setLoading(false);
				});

			let unsubscribe = noop;
			unsubscribe = apiInstance.query.staking
				.nominators(
					stashAccount.address,
					({ value: { targets: nominations } }) => {
						if (nominations) {
							const readableNominations = nominations.map((nomination) =>
								nomination.toString()
							);
							const multiQueryString = readableNominations.reduce(
								(acc, curr) => acc + `,${curr}`,
								""
							);
							axios
								.get(
									`/${networkInfo.coinGeckoDenom}/validator/multi?stashIds=${multiQueryString}`
								)
								.then(({ data }) => {
									setAllNominations(data);
								})
								.catch((err) => {
									toast({
										title: "Error",
										description: "Something went wrong!",
										position: "top-right",
										duration: 3000,
										status: "error",
									});
									close();
								})
								.finally(() => {
									setNominationsLoading(false);
								});
						} else {
							setError(true);
							setNominationsLoading(false);
						}
					}
				)
				.then((_unsubscribe) => {
					unsubscribe = _unsubscribe;
				})
				.finally(() => {
					setLoading(false);
				});

			return () => {
				unsubscribe;
			};
		}
	}, [stashAccount, apiInstance, selectedNetwork]);

	useEffect(() => {
		if (!validators) {
			axios
				.get(`/${networkInfo.coinGeckoDenom}/rewards/risk-set`)
				.then(({ data }) => {
					const validators = data.totalset;
					setValidators(validators);
					setSelectedValidatorsMap(allNominationsData);
				})
				.catch(() => {
					// toast({
					// 	title: "Error",
					// 	description: "Something went wrong!",
					// 	position: "top-right",
					// 	duration: 3000,
					// 	status: "error",
					// });
					close();
				})
				.finally(() => {
					setValidatorsLoading(false);
				});
		}
	}, [allNominationsData]);

	// if (loading || accountInfoLoading || nominationsLoading) {
	// 	return (
	// 		<div className="flex-center w-full h-full">
	// 			<div className="flex-center flex-col">
	// 				<Spinner size="xl" color="teal.500" thickness="4px" />
	// 				<span className="text-sm text-gray-600 mt-5">
	// 					Fetching your data...
	// 				</span>
	// 			</div>
	// 		</div>
	// 	);
	// }

	// if (error) {
	// 	return (
	// 		<div className="flex-center w-full h-full">
	// 			<div className="flex-center flex-col">
	// 				<AlertTriangle size="2rem" className="text-orange-500" />
	// 				<span className="font-semibold text-red-600 text-lg mb-10">
	// 					Sorry, no data for your account since you don't have active
	// 					nominations! :(
	// 				</span>
	// 				<span
	// 					onClick={() => router.replace(Routes.CALCULATOR)}
	// 					className="text-sm text-gray-600 mt-5 hover:underline cursor-pointer"
	// 				>
	// 					Use Reward Calculator to bond more funds and nominate.
	// 				</span>
	// 			</div>
	// 		</div>
	// 	);
	// }

	const onEditController = () => {
		closeRewardDestinationModal();
		toggleEditControllerModal();
	};

	const openFundsUpdateModal = (type) => {
		setFundsUpdateModalType(type);
		toggleFundsUpdateModal();
	};

	return !stashAccount ? (
		<div className="flex-center w-full h-full">
			<div className="flex-center flex-col">
				<AlertTriangle size="2rem" className="text-orange-500" />
				<span className="text-gray-600 text-lg mb-10">
					No account connected!
				</span>
				<button
					className="border border-teal-500 text-teal-500 px-3 py-2 rounded-full"
					onClick={toggle}
				>
					Connect Wallet
				</button>
			</div>
		</div>
	) : loading || nominationsLoading ? (
		<div className="flex-center w-full h-full">
			<div className="flex-center flex-col">
				<Spinner size="xl" color="teal.500" thickness="4px" />
				<span className="text-sm text-gray-600 mt-5">
					Fetching your data...
				</span>
			</div>
		</div>
	) : (
		<div className="px-10 py-10 w-full h-full">
			<RewardDestinationModal
				isOpen={isRewardDestinationModalOpen}
				close={closeRewardDestinationModal}
				onEditController={onEditController}
			/>
			<EditControllerModal
				isOpen={editControllerModalOpen}
				close={closeEditControllerModal}
				networkInfo={networkInfo}
			/>
			<FundsUpdate
				isOpen={fundsUpdateModalOpen}
				close={closeFundsUpdateModal}
				type={fundsUpdateModalType}
				nominations={allNominationsData}
				bondedAmount={bondedAmount}
				networkInfo={networkInfo}
			/>
			<EditValidators
				isOpen={editValidatorModalOpen}
				close={closeEditValidatorsModal}
				validators={validators}
				validatorsLoading={validatorsLoading}
				currentValidators={allNominationsData}
				onChill={() => {
					closeEditValidatorsModal();
					setTimeout(() => toggleChillAlert(), 500);
				}}
				networkInfo={networkInfo}
			/>
			<ChillAlert isOpen={chillAlertOpen} close={closeChillAlert} />
			<div className="flex-col">
				<div className="flex">
					<div className="flex w-1/2 mr-8">
						<div className="w-full">
							<OverviewCards
								stats={isNil(userData) ? null : userData.stats}
								bondedAmount={bondedAmount}
								address={stashAccount.address}
								activeStake={activeStake}
								validators={isNil(userData) ? null : userData.validatorsInfo}
								unlockingBalances={unlockingBalances}
								bondFunds={() => openFundsUpdateModal("bond")}
								unbondFunds={() => openFundsUpdateModal("unbond")}
								openRewardDestinationModal={toggleRewardDestinationModal}
								networkInfo={networkInfo}
							/>
						</div>
					</div>
					<div className="flex ml-8 w-1/2">
						{activeStake && validators && (
							<EarningsOutput
								networkDenom={networkInfo.denom}
								networkUrl={networkInfo.coinGeckoDenom}
								networkInfo={networkInfo}
								validators={
									isNil(userData)
										? []
										: userData.validatorsInfo.filter(
												(validator) => validator.isElected
										  )
								}
								inputValue={activeStake}
								apiInstance={apiInstance}
								address={stashAccount.address}
							/>
						)}
					</div>
				</div>
				<div className="w-full">
					<div className="flex flex-col h-full mb-2">
						<button
							onClick={handleValToggle}
							className="flex text-gray-600 text-xs mt-4"
						>
							<ChevronRight
								size={16}
								className={`transition ease-in-out duration-500 mr-2 ${
									showValidators && "transform rotate-90"
								}`}
							/>
							{showValidators ? "Hide" : "See your"} validators
						</button>
						<Collapse isOpen={showValidators}>
							<div className="flex justify-between items-center">
								{/* <div className="flex items-center">
									<h3 className="text-2xl">
										My validators
									</h3>
									{selectedTab === Tabs.NOMINATIONS && (
										<button
											className="flex items-center text-gray-600 mr-5 p-1"
											onClick={toggleEditValidatorsModal}
										>
											<Edit2 size="20px" className="ml-2" />
										</button>
									)}
								</div> */}
								<div className="flex items-center">
									<button
										className={
											selectedTab === Tabs.NOMINATIONS
												? "text-gray-900 mx-2"
												: "text-gray-500 mx-2"
										}
										onClick={() => setSelectedTab(Tabs.NOMINATIONS)}
									>
										Selected
									</button>
									<button
										className={
											selectedTab === Tabs.ACTIVE_VALIDATORS
												? "text-gray-900 mx-2"
												: "text-gray-500 mx-2"
										}
										onClick={() => setSelectedTab(Tabs.ACTIVE_VALIDATORS)}
									>
										Active
									</button>
								</div>
							</div>
							{selectedTab === Tabs.ACTIVE_VALIDATORS ? (
								<NominationsTable
									validators={isNil(userData) ? [] : userData.validatorsInfo}
									networkInfo={networkInfo}
								/>
							) : (
								allNominationsData && (
									<AllNominations
										nominations={allNominationsData}
										networkInfo={networkInfo}
									/>
								)
							)}
						</Collapse>
					</div>
					{/* <div className="w-4/12">
						<ExpectedReturns
							stats={userData.stats}
							validators={userData.validatorsInfo}
							networkInfo={networkInfo}
						/>
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default Overview;
