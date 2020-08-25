import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverArrow,
	PopoverCloseButton,
} from "@chakra-ui/core";

const BADGE_STATIC_URL = "/images/badges/";

const BadgeInstance = (image, text) => ({ image, text });

const getBadge = (score) => {
	if (score > 0 && score <= 200) {
		return BadgeInstance("1.svg", "GOOD TRANSPARENCY");
	} else if (score > 200 && score <= 330) {
		return BadgeInstance("2.svg", "EXCELLENT TRANSPARENCY");
	} else if (score > 330) {
		return BadgeInstance("3.svg", "BEST TRANSPARENCY");
	} else {
		return null;
	}
};

const ProfileBadge = ({ score }) => {
	const badge = getBadge(score);

	return (badge) ? (
		<div>
			<Popover trigger="hover">
				<PopoverTrigger>
					<img
						alt="profile-badge"
						src={BADGE_STATIC_URL + badge.image}
						className="cursor-pointer"
					/>
				</PopoverTrigger>
				<PopoverContent
					zIndex={4}
					padding="0"
					rounded="10px"
					color="gray.200"
					textAlign="center"
					backgroundColor="#35475C"
					width="auto"
				>
					<PopoverArrow />
					<PopoverBody fontSize="sm">{badge.text}</PopoverBody>
				</PopoverContent>
			</Popover>
		</div>
	) : "";
};

export default ProfileBadge;
