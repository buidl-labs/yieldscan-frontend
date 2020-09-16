import React from 'react'
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="w-full relative h-screen flex items-center justify-center px-8">
			<div className="flex flex-col justify-center max-w-md relative -mt-16">
				<h1 className="text-6xl font-bold">404</h1>
				<h3 className="text-xl font-semibold">
					You seem to be lost...
				</h3>
				<p className="text-gray-600">
					Either the internet has broken or we couldn't find the file that you
					were looking for.
				</p>
				<Link href="/overview">
					<a className="rounded-full bg-teal-500 text-white px-10 py-2 mt-8 shadow-teal self-start">
						Take me back
					</a>
				</Link>
			</div>
			<img src="images/404.svg" className="-ml-16 w-5/12 opacity-50"></img>
		</div>
	);
}
