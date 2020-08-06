import { useDisclosure } from "@chakra-ui/core";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/core";
import Identicon from "@components/common/Identicon";
import withSlideIn from "@components/common/withSlideIn";
import { ExternalLink } from "react-feather";
import Routes from "@lib/routes";

const LinkedValidatorsModal = withSlideIn(({ validators, styles, onClose, onProfile }) => (
	<Modal isOpen={true} onClose={onClose}>
		<ModalOverlay />
		<ModalContent {...styles} maxWidth="60vw" maxHeight="80vh" py="5px">
			<ModalHeader>Linked Validators</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				<div className="flex items-center flex-wrap">
					{validators.map(validator => (
						<div key={validator} className="flex items-center border border-gray-400 rounded-xl px-3 py-1 my-2 mr-4 w-64">
							<div className="mr-2">
								<Identicon address={validator.stashId} size="3rem" />
							</div>
							<div className="text-gray-700 cursor-pointer">
								<span className="font-semibold select-all">{validator.stashId.slice(0, 15) + '...'}</span>
								<div className="flex items-center" onClick={() => onProfile(validator.stashId)}>
									<span className="text-xs mr-2">View Profile</span>
									<ExternalLink size="12px" />
								</div>
							</div>
						</div>
					))}
				</div>
			</ModalBody>
		</ModalContent>
	</Modal>
));

const LinkedValidatorsGroup = ({ validators = [] }) => {
	const { onToggle, isOpen, onClose } = useDisclosure()
	
	const limitedValidators = validators.length > 5 ? validators.slice(0, 5) : validators;

	return (
		<div className="flex items-center">
			<span className="text-gray-700 text-xs mr-5 font-semibold">LINKED VALIDATORS</span>
			<LinkedValidatorsModal
				isOpen={isOpen}
				onClose={onClose}
				validators={validators.slice(10)}
				onProfile={(validatorId) => window.open(`${Routes.VALIDATOR_PROFILE}/${validatorId}`, '_blank')}
			/>
			<div className="flex items-center max-w-xs">
				{limitedValidators.map(validator => (
					<div style={{ marginLeft: -12 }}>
						<Identicon
							key={validator.stashId}
							address={validator.stashId}
							size="2.5rem"
						/>
					</div>
				))}
				{limitedValidators.length !== validators.length && (
					<div
						className="cursor-pointer bg-gray-800 text-white text-xs rounded-full p-2"
						onClick={onToggle}
					>
						+{validators.length - limitedValidators.length}
					</div>
				)}
			</div>
			{!validators.length && <span className="text-gray-700 text-xs mr-2 font-semibold">: 0</span>}
		</div>
	);
};

export default LinkedValidatorsGroup;
