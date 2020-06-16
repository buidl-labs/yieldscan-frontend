import { SlideIn } from '@chakra-ui/core';

const withSlideIn = (Component) => (props) => (
	<SlideIn in={props.isOpen} duration={200}>
		{(styles) => <Component {...props} styles={styles} />}
	</SlideIn>
);

export default withSlideIn;
