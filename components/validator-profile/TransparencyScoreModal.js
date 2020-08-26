import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Button,
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import ProfileBadge from "@components/common/ProfileBadge";
import { Lock, Check } from "react-feather";

const TaskCard = ({ title = "", description = "", score = 0, isDone }) => (
	<div
		className={`p-5 px-10 my-5 flex items-center justify-between border-2 ${
			isDone ? "border-teal-500" : "border-gray-200"
		} rounded-xl`}
	>
		<div>
			<h1 className="text-lg font-medium">{title}</h1>
			<h3 className="text-gray-600">{description}</h3>
		</div>
		<div className="flex w-24 justify-between">
			<span className={`text-teal-500 self-center ${!isDone && "opacity-0"}`}>
				<Check />
			</span>
			<div className="flex flex-col items-center">
				<span className="font-medium text-3xl text-teal-500">{score}</span>
				<span className="font-medium text-lg">PTS</span>
			</div>
		</div>
	</div>
);

const TransparencyScoreModal = withSlideIn(
	({ transparencyScore, onClose, styles }) => {
		const numOfTasksDone = Math.max(
			Object.values(transparencyScore).filter((score) => score !== 0).length -
				1,
			0
		);
		const [nextScore, setNextScore] = React.useState(10);

		const getNextScore = (currentScore) => {
			if (currentScore === 0) {
				return 10;
			} else if (currentScore > 0 && currentScore < 200) {
				return 200;
			} else if (currentScore >= 200 && currentScore < 330) {
				return 400;
			} else if (currentScore >= 330) {
				return 400;
			} else {
				return null;
			}
		};

		React.useEffect(() => {
			const score = transparencyScore.total;
			const _nextScore = getNextScore(score);
			setNextScore(_nextScore);
		}, [transparencyScore]);

		return (
			<Modal isOpen={true} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent rounded="lg" maxWidth="70vw" {...styles}>
					<ModalHeader>
						<div className="flex justify-between items-center mr-20 select-none">
							<h1 className="px-10 text-gray-900 text-2xl font-medium">
								Transparency Score
							</h1>
							<div className="flex items-center">
								{transparencyScore.total !== 400 && (
									<>
										<div className="mr-2 -mb-3 relative">
											<div className="absolute w-full h-full flex items-center justify-center">
												<span className="-mt-4 h-6 w-6 text-white bg-gray-700 rounded-full flex items-center justify-center opacity-90">
													<Lock size="0.75rem" />
												</span>
											</div>
											<ProfileBadge score={nextScore} />
										</div>

										<div className="flex flex-col -mb-1">
											<span className="text-gray-900 text-xs font-semibold">
												{nextScore === 10
													? "BASIC"
													: nextScore === 200
													? "EXCELLENT"
													: "SUPREME"}{" "}
												TRANSPARENCY
											</span>
											<span className="text-gray-600 text-xs font-normal -mt-1">
												Unlocks at {nextScore} PTS
											</span>
										</div>
									</>
								)}
								<div className="border border-gray-200 rounded-lg ml-2 py-2 pl-2 pr-4 items-center flex">
									{transparencyScore.total !== 0 ? (
										<span className="-mb-3">
											<ProfileBadge score={transparencyScore.total} />
										</span>
									) : (
										<img
											alt="profile-badge"
											src="/images/badges/gray-badge.svg"
											className="cursor-pointer"
										/>
									)}
									{transparencyScore.total} PTS
								</div>
							</div>
						</div>
					</ModalHeader>
					<ModalCloseButton onClick={onClose} />
					<ModalBody overflowY="scroll">
						<div className="px-10 pb-16">
							<p className="text-gray-600">
								Completing the following tasks can boost your profile and
								increase your transparency score:
							</p>
							<div className="mt-10 flex items-center justify-between">
								<h3 className="font-medium tracking-wider">TASKS</h3>
								<div>
									<span className="font-medium">
										{numOfTasksDone === 6 ? 7 : numOfTasksDone}
										/7 Tasks Completed
									</span>
								</div>
							</div>

							<div className="overflow-y-scroll" style={{ maxHeight: 350 }}>
								<TaskCard
									title="Add your display name"
									description="The name that will be displayed in your accounts list."
									score={20}
									isDone={transparencyScore.name > 0}
								/>
								<TaskCard
									title="Add your legal name"
									description="The legal name for this identity."
									score={100}
									isDone={transparencyScore.legal > 0}
								/>
								<TaskCard
									title="Add your e-mail"
									description="The email address associated with this identity."
									score={50}
									isDone={transparencyScore.email > 0}
								/>
								<TaskCard
									title="Add your web link"
									description="A URL that is linked to this identity."
									score={70}
									isDone={transparencyScore.web > 0}
								/>
								<TaskCard
									title="Add your twitter"
									description="The twitter name for this identity."
									score={40}
									isDone={transparencyScore.twitter > 0}
								/>
								<TaskCard
									title="Add your riot"
									description="A riot name linked to this identity"
									score={50}
									isDone={transparencyScore.riot > 0}
								/>
								<TaskCard
									title="BONUS: Complete all of the above"
									description="On completion of all of the tasks mentioned above, this bonus is unlocked."
									score={70}
									isDone={transparencyScore.total === 400}
								/>
							</div>

							<div className="mt-8 flex items-center justify-between">
								{/* <Button
									size="lg"
									leftIcon="repeat"
									variantColor="teal"
									fontWeight="normal"
								>
									Refresh
								</Button> */}
								<a
									className="text-teal-500 px-4 py-2 border border-teal-500 rounded-full hover:bg-teal-500 hover:text-white"
									href="https://polkadot.js.org/apps/#/accounts"
								>
									Edit on PolkadotJS
								</a>
								<a
									className="text-gray-600"
									href="https://wiki.polkadot.network/docs/en/learn-identity#setting-an-identity"
								>
									How to set an identity?
								</a>
							</div>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	}
);

export default TransparencyScoreModal;
