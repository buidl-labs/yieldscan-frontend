import withSlideIn from "@components/common/withSlideIn";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	Spinner,
	useToast,
	Input
} from "@chakra-ui/core";
import { CheckCircle, PlusCircle, MinusCircle } from "react-feather";
import useHover from "@components/common/hooks/useHover";
import { useState, useEffect } from "react";
import axios from "@lib/axios";
import RiskTag from "@components/reward-calculator/RiskTag";

const ValidatorCard = ({
	stashId,
	riskScore,
	stakedAmount,
	estimatedReward,
	isSelected = false,
}) => {
	const [ref, hovered] = useHover();
	return (
		<div ref={ref} className="relative bg-white flex justify-around items-center py-2 my-2 rounded-lg border border-gray-300">
			<img src="http://placehold.it/255" className="rounded-full w-10 h-10 mr-4" />
			<h3 className="text-gray-700 text-xs w-48 truncate">{stashId}</h3>
			<div className="flex flex-col">
				<span className="text-xs text-gray-500 font-semibold">Risk Score</span>
				<div className="rounded-full font-semibold"><RiskTag risk={Number(riskScore.toFixed(2))} /></div>
			</div>
			<div className="flex flex-col">
				<span className="text-xs text-gray-500 font-semibold">Staked Amount</span>
				<h3 className="text-lg">{stakedAmount.toFixed(1)} KSM</h3>
			</div>
			<div className="flex flex-col">
				<span className="text-xs text-gray-500 font-semibold">Estimated Reward</span>
				<h3 className="text-lg">{estimatedReward.toFixed(4)} KSM</h3>
			</div>
			<div hidden={!hovered} className="absolute bg-white bg-opacity-25 cursor-pointer right-0 px-4 py-2">
				{!isSelected && <PlusCircle size="2rem" fill="#2BCACA" className="text-white" />}
				{isSelected && <MinusCircle size="2rem" fill="#e53e3e" className="text-white" />}
			</div>
		</div>
	);
};

const EditValidators = withSlideIn(({ styles, close }) => {
	const [validators, setValidators] = useState([]);
	const [validatorsLoading, setValidatorsLoading] = useState(true);

	useEffect(() => {
		axios.get('/rewards/risk-set').then(({ data }) => {
			const validators = data.totalset;
			setValidators(validators);
			setValidatorsLoading(false);
		});
	}, []);

	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="90vw" height="84vh" {...styles}>
				<ModalHeader>
					<h1>Edit Validators</h1>
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody px="4rem">
					{validatorsLoading ? (
						<div className="flex flex-col items-center justify-center mt-40">
							<Spinner size="lg" />
							<span className="mt-5 text-sm text-gray-600">Quick deep breath...</span>
						</div>
					) : (
						<div className="flex justify-around">
							<div className="w-1/2 bg-gray-300 p-2 mr-2 rounded-lg">
								<div className="">
									<h3 className="font-semibold">CANDIDATE VALIDATORS</h3>
								</div>
								<div className="my-2 overflow-y-scroll validators-table">
									{validators.map(validator => (
										<ValidatorCard
											key={validator.stashId}
											stashId={validator.stashId}
											riskScore={validator.riskScore}
											estimatedReward={validator.estimatedPoolReward}
											stakedAmount={validator.totalStake}
											type='add'
										/>
									))}
								</div>
							</div>
							<div className="w-1/2 border border-gray-300 p-2 rounded-lg">
								<div className="flex justify-between items-center">
									<h3 className="font-semibold">
										SELECTED VALIDATORS
										<span className="p-1 ml-2 rounded-full bg-gray-300 text-gray-600 font-semibold">
											16
										</span>
									</h3>
									<div className="flex items-center text-sm">
										<span className="mr-2">Estimated Monthly Returns</span>
										<div className="w-32 border border-teal-500 text-teal-500 p-1 rounded-lg">
											450 KSM
										</div>
									</div>
								</div>
								<div>
									validators card here
								</div>
							</div>
						</div>
					)}
					<style jsx>{`
						.validators-table {
							height: 62vh;
						}
					`}</style>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditValidators;
