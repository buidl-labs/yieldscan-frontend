import dynamic from 'next/dynamic';

const Header = dynamic(
	() => import('@components/common/header').then(mod => mod.default),
	{ ssr: false },
);

const withBaseLayout = (children) => {
	return () => (
		<div>
			<Header isBase />
			<div className="flex">
				<div className="min-h-full h-fit-content w-full">
					{children()}
				</div>
			</div>
		</div>
	);
};

export default withBaseLayout;
