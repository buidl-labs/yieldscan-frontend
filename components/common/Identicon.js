import { noop } from "lodash";
import { useToast } from "@chakra-ui/core";
import BaseIdenticon from "@polkadot/react-identicon";

const Identicon = ({
	address,
	size = "40",
	onClick = noop,
	showToast = true,
}) => {
	const toast = useToast();
	const onCopy = () => {
		if (showToast) {
			toast({
				duration: 2000,
				status: "success",
				position: "top-right",
				description: "Address copied",
			});
		}

		onClick(address);
	};

	return (
		<div onClick={(ev) => ev.stopPropagation()} className="-mb-1">
			<BaseIdenticon
				size={size}
				value={address}
				onCopy={onCopy}
				theme="polkadot"
			/>
		</div>
	);
};

export default Identicon;
