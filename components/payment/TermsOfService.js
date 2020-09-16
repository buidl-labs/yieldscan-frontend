import { useState } from "react";
import {
	Modal,
	ModalBody,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalHeader,
	ModalFooter,
	Text,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverBody,
} from "@chakra-ui/core";
import TermsComponent from "@components/policies/terms-component";

const TermsAndServicePopover = ({
	tcPopoverOpen,
	setTCPopoverOpen,
	setHasAgreed,
	onConfirm,
}) => {
	const [clickDisabled, setClickDisabled] = useState(true);
	const [showPopover, setShowPopover] = useState(false);

	const handlePopoverClose = () => {
		setTCPopoverOpen(false);
	};

	const handleScroll = (e) => {
		const bottom =
			e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
		if (bottom) {
			setClickDisabled(false);
		}
	};

	return (
		<Modal
			isOpen={tcPopoverOpen}
			onClose={handlePopoverClose}
			scrollBehavior="inside"
			isCentered
			size="xs"
		>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth={"40rem"} py={4}>
				<ModalHeader>
					<Text>Terms of Service</Text>
					<Text fontSize={12} fontStyle="italic" fontWeight="normal">
						Please ensure you understand the risks before proceeding
					</Text>
				</ModalHeader>
				<ModalCloseButton
					onClick={handlePopoverClose}
					boxShadow="0 0 0 0 #fff"
					color="gray.400"
					backgroundColor="gray.100"
					rounded="1rem"
					mt={4}
					mr={4}
				/>
				<ModalBody onScroll={(e) => handleScroll(e)}>
					<div className="documentation -p-8">
						<TermsComponent />
					</div>
				</ModalBody>
				<ModalFooter display="flex" justifyContent="center">
					<Popover isOpen={clickDisabled && showPopover} usePortal>
						<PopoverTrigger>
							<div
								onPointerLeave={() => setShowPopover(false)}
								onPointerEnter={() => setShowPopover(true)}
							>
								<button
									className={`
						flex items-center px-12 py-3 text-white rounded-full
						${!clickDisabled ? "bg-teal-500" : "bg-gray-400 cursor-default"}
					`}
									disabled={clickDisabled}
									onClick={() => {
										setHasAgreed(true);
										onConfirm();
									}}
								>
									Agree
								</button>
							</div>
						</PopoverTrigger>
						<PopoverContent
							zIndex={999999}
							_focus={{ outline: "none" }}
							bg="gray.700"
							border="none"
							color="white"
							textAlign="center"
							fontSize="sm"
						>
							<PopoverArrow />
							<PopoverBody>
								Please read the terms of service before proceeding
							</PopoverBody>
						</PopoverContent>
					</Popover>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default TermsAndServicePopover;
