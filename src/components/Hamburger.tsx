import { useEffect, useRef } from 'react';

export const Hamburger = ({ isOpen }: { isOpen: boolean }) => {
	const hasAnimated = useRef(false);

	useEffect(() => {
		hasAnimated.current = true;
	}, []);

	return (
		<svg
			className="hb"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 10 10"
			stroke="currentColor"
			strokeWidth=".6"
			fill="rgba(0,0,0,0)"
			strokeLinecap="round"
			style={{ cursor: 'pointer' }}
			width="100%"
			height="100%"
			key={hasAnimated.current ? (isOpen ? 'open' : 'closed') : 'initial'}
		>
			<path
				d={
					isOpen
						? 'M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7'
						: 'M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7'
				}
			>
				{hasAnimated.current && (
					<animate
						dur="0.2s"
						attributeName="d"
						values={
							isOpen
								? 'M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7;M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7'
								: 'M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7;M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7'
						}
						fill="freeze"
						begin="0s"
					/>
				)}
			</path>
		</svg>
	);
};
