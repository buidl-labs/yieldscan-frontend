import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton
} from "@chakra-ui/core";

const BADGE_STATIC_URL = '/images/badges/';

const BadgeInstance = (image, text) => ({ image, text });

const getBadge = (score) => {
  if (score < 10) {
    return BadgeInstance('1.svg', 'GOOD TRANSPARENCY');
  } else if (score > 10 && score < 100) {
    return BadgeInstance('2.svg', 'BEST TRANSPARENCY');
  } else if (score >= 100 && score <= 300) {
    return BadgeInstance('3.svg', 'EXCELLENT TRANSPARENCY');
  } else {
    return BadgeInstance('4.svg', 'SUPREME TRANSPARENCY');
  }
};

const ProfileBadge = ({ score }) => {
  const badge = getBadge(score);
  
  return (
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
  );
};

export default ProfileBadge;
