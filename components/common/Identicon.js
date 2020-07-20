import { useToast } from "@chakra-ui/core";
import BaseIdenticon from '@polkadot/react-identicon';

const Identicon = ({ address, size = '2.5rem' }) => {
	const toast = useToast();
	const onCopy = () => {
		toast({
			description: 'Address copied',
			status: 'success',
			duration: 2000,
			position: 'top-right',
		});
	};

	return (
		<div onClick={ev => ev.stopPropagation()}>
			<BaseIdenticon
				value={address}
				size={size}
				onCopy={onCopy}
				theme="polkadot"
			/>
		</div>
	);
};

export default Identicon;
