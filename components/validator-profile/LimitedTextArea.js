import React from "react";
export default function LimitedTextarea({
	rows,
	cols,
	value,
	limit,
	className,
    placeholder,
    setVision
}) {
	const [content, setContent] = React.useState(value);

	const setFormattedContent = (text) => {
		text.length > limit ? setContent(text.slice(0, limit)) : setContent(text);
	};

	React.useEffect(() => setVision(content), [content]);

	React.useEffect(() => {
		setFormattedContent(content);
	}, []);

	return (
		<div className="relative border border-gray-200 rounded-lg">
			<textarea
				rows={rows}
				cols={cols}
				onChange={(event) => setFormattedContent(event.target.value)}
				value={content}
				className={`${className} relative resize-none rounded-lg pr-16`}
				placeholder={placeholder}
			/>
			<p className="text-xs text-right text-gray-600 absolute right-0 bottom-0 w-full px-4 py-1 rounded-lg">
				{content.length}/{limit}
			</p>
		</div>
	);
}
