import { useState } from "react";
import {
	Modal,
	ModalBody,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalHeader,
	ModalFooter,
	List,
	ListItem,
	Text,
} from "@chakra-ui/core";

const TermsAndServicePopover = ({
	tcPopoverOpen,
	setTCPopoverOpen,
	onConfirm,
}) => {
	const [clickDisabled, setClickDisabled] = useState(true);

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
					<List as="ol" styleType="decimal">
						<ListItem>Lorem ipsum dolor sit amet</ListItem>
						<ListItem>Consectetur adipiscing elit</ListItem>
						<ListItem>Integer molestie lorem at massa</ListItem>
						<ListItem>Facilisis in pretium nisl aliquet</ListItem>
						<ListItem>Lorem ipsum dolor sit amet</ListItem>
						<ListItem>Consectetur adipiscing elit</ListItem>
						<ListItem>Integer molestie lorem at massa</ListItem>
						<ListItem>Facilisis in pretium nisl aliquet</ListItem>
						<ListItem>Lorem ipsum dolor sit amet</ListItem>
						<ListItem>Consectetur adipiscing elit</ListItem>
						<ListItem>Integer molestie lorem at massa</ListItem>
						<ListItem>Facilisis in pretium nisl aliquet</ListItem>
						<ListItem>Lorem ipsum dolor sit amet</ListItem>
						<ListItem>Consectetur adipiscing elit</ListItem>
						<ListItem>Integer molestie lorem at massa</ListItem>
						<ListItem>Facilisis in pretium nisl aliquet</ListItem>
						<ListItem>Lorem ipsum dolor sit amet</ListItem>
						<ListItem>Consectetur adipiscing elit</ListItem>
						<ListItem>Integer molestie lorem at massa</ListItem>
						<ListItem>Facilisis in pretium nisl aliquet</ListItem>
						<ListItem>Lorem ipsum dolor sit amet</ListItem>
						<ListItem>Consectetur adipiscing elit</ListItem>
						<ListItem>Integer molestie lorem at massa</ListItem>
						<ListItem>Facilisis in pretium nisl aliquet</ListItem>
						<ListItem>Lorem ipsum dolor sit amet</ListItem>
						<ListItem>Consectetur adipiscing elit</ListItem>
						<ListItem>Integer molestie lorem at massa</ListItem>
						<ListItem>Facilisis in pretium nisl aliquet</ListItem>
					</List>
				</ModalBody>
				<ModalFooter>
					<button
						className={`
						rounded-full font-semibold text-lg mt-5 px-8 py-3 bg-white text-teal-500
						${clickDisabled ? "opacity-75 cursor-not-allowed" : "opacity-100"}
					`}
						disabled={clickDisabled}
						onClick={onConfirm}
					>
						{clickDisabled ? "Scroll to the bottom" : "Agree"}
					</button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default TermsAndServicePopover;
