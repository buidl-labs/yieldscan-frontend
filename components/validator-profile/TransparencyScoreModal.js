import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Button
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import ProfileBadge from "@components/common/ProfileBadge";

const TransparencyScoreModal = withSlideIn(({ onClose, styles }) => {
  return (
		<Modal isOpen={true} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="70vw" height="85vh" {...styles}>
				<ModalHeader>
          <div className="flex justify-between items-center mr-20 select-none">
					  <h1 className="px-4 text-gray-700 text-4xl font-bold">Transparency Score</h1>
            <div className="flex items-center">
              <div className="mr-4"><ProfileBadge score={10} /></div>
              <div className="flex flex-col">
                <span className="text-gray-700 text-sm font-bold">GOOD TRANSPARENCY BADGE</span>
                <span className="text-gray-500 text-sm">Unlocks at 150 pts</span>
              </div>
            </div>
          </div>
				</ModalHeader>
				<ModalCloseButton onClick={onClose} />
				<ModalBody overflowY="scroll">
					<div className="px-4">
            <p className="text-gray-600">Completing the following tasks can boost your profile and increase your transparency score</p>
            <div>

            </div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
  );
});

export default TransparencyScoreModal;
