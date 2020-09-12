import { useRef, useState } from "react";
import withSlideIn from "@components/common/withSlideIn";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogCloseButton,
	Button,
	useToast,
} from "@chakra-ui/core";
import chill from "@lib/polkadot/chill";
import { useAccounts, usePolkadotApi } from "@lib/store";

const ChillAlert = withSlideIn(({ styles, close }) => {
	const toast = useToast();
	const cancelRef = useRef();
	const { stashAccount } = useAccounts();
	const { apiInstance } = usePolkadotApi();
	const [chilling, setChilling] = useState(false);
	const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);

	const onConfirm = () => {
		setChilling(true);
		setCloseOnOverlayClick(false);
		chill(stashAccount.address, apiInstance, {
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
				setChilling(false);
				setCloseOnOverlayClick(true);
				close();
			},
		}).catch((error) => {
			setChilling(false);
			setCloseOnOverlayClick(true);
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
		<AlertDialog
			leastDestructiveRef={cancelRef}
			onClose={close}
			closeOnOverlayClick={closeOnOverlayClick}
			closeOnEsc={closeOnOverlayClick}
			isOpen={true}
		>
			<AlertDialogOverlay opacity={styles.opacity} />
			<AlertDialogContent {...styles}>
				<AlertDialogHeader>Stop All Nominations?</AlertDialogHeader>
				{closeOnOverlayClick && <AlertDialogCloseButton hidden={chilling} />}
				<AlertDialogBody>
					Are you sure you want to stop all of your current nominations? This
					will keep your amount bonded in your account.
				</AlertDialogBody>
				<AlertDialogFooter>
					<Button ref={cancelRef} onClick={close} isDisabled={chilling}>
						No, Cancel
					</Button>
					<Button
						variantColor="red"
						ml={3}
						onClick={onConfirm}
						isLoading={chilling}
					>
						Yes, Confirm
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
});

export default ChillAlert;
