import { useRef } from "react";
import withSlideIn from "@components/common/withSlideIn";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogCloseButton,
	Button
} from "@chakra-ui/core";

const ChillAlert = withSlideIn(({ styles, close }) => {
	const cancelRef = useRef();

	return (
		<AlertDialog
			leastDestructiveRef={cancelRef}
			onClose={close}
			isOpen={true}
		>
			<AlertDialogOverlay opacity={styles.opacity} />
			<AlertDialogContent {...styles}>
				<AlertDialogHeader>Stop All Nominations?</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>
					Are you sure you want to stop all of your current nominations? This will keep your amount bonded in your account.
				</AlertDialogBody>
				<AlertDialogFooter>
					<Button ref={cancelRef} onClick={close}>
						No, Cancel
					</Button>
					<Button variantColor="red" ml={3}>
						Yes, Confirm
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
});

export default ChillAlert;
