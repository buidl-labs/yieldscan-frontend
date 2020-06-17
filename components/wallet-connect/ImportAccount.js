const ImportAccount = ({ onPrevious, onNext }) => (
	<div className="mx-10 my-10 flex flex-col items-start">
		<h3 className="my-4 text-2xl">Import an account</h3>
		<div className="rounded-lg h-48 w-full bg-gray-300"></div>
		<div>
			<h3 className="my-4 text-xl">Step 1 Title</h3>
			<p className="text-sm text-gray-600 text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
		</div>
		<div className="w-full mt-16 flex justify-end">
			<button className="px-6 py-3 mr-4 bg-white text-teal-500 rounded-lg border border-teal-500" onClick={onPrevious}>Previous</button>
			<button className="px-12 py-3 bg-teal-500 text-white rounded-lg" onClick={onNext}>Next</button>
		</div>
	</div>
);

export default ImportAccount;
