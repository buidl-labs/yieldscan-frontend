import { useState, useEffect, useRef } from 'react';

const useHover = () => {
	const [hovered, setHovered] = useState(false);

	const ref = useRef(null);

	const handleMouseOver = () => setHovered(true);
	const handleMouseOut = () => setHovered(false);

	useEffect(
		() => {
			const node = ref.current;
			if (node) {
				node.addEventListener('mouseover', handleMouseOver);
				node.addEventListener('mouseout', handleMouseOut);

				return () => {
					node.removeEventListener('mouseover', handleMouseOver);
					node.removeEventListener('mouseout', handleMouseOut);
				};
			}
		},
		[ref.current] // recall only if ref changes
	);

	return [ref, hovered];
}

export default useHover;