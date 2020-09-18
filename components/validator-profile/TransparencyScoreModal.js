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

const TaskCard = ({ title = '', description = '', score = 0 }) => (
  <div className="p-5 px-10 my-5 flex items-center justify-between border border-gray-300 rounded-xl">
    <div>
      <h1 className="text-xl font-semibold">{title}</h1>
      <h3 className="text-lg text-gray-600">{description}</h3>
    </div>
    <div className="flex flex-col items-center">
      <span className="font-semibold text-3xl text-teal-500">{score}</span>
      <span className="font-semibold text-lg">PTS</span>
    </div>
  </div>
);

const TransparencyScoreModal = withSlideIn(({ onClose, styles }) => {
  return (
		<Modal isOpen={true} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="70vw" {...styles}>
				<ModalHeader>
          <div className="flex justify-between items-center mr-20 select-none">
					  <h1 className="px-10 text-gray-700 text-3xl font-bold">Transparency Score</h1>
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
					<div className="px-10 pb-16 pt-5">
            <p className="text-gray-600">Completing the following tasks can boost your profile and increase your transparency score:</p>
            <div className="mt-10 flex items-center justify-between">
              <h3 className="text-xl font-semibold">TASKS</h3>
              <div>
                <span className="font-semibold text-lg">0/7 Tasks Completed</span>
              </div>
            </div>

            <div className="overflow-y-scroll" style={{ maxHeight: 500 }}>
              <TaskCard
                title="Add your display name"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
                score={10}
              />
              <TaskCard
                title="Add your legal name"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
                score={10}
              />
              <TaskCard
                title="Add your e-mail"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
                score={10}
              />
            </div>

            <div className="mt-5 flex items-center justify-center">
              <Button
                size="lg"
                leftIcon="repeat"
                variantColor="teal"
              >
                Refresh
              </Button>
            </div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
  );
});

export default TransparencyScoreModal;
