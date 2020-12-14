import { ArrowRight } from "react-feather";
import { Divider, Spinner } from "@chakra-ui/core";
import formatCurrency from "@lib/format-currency";
import convertCurrency from "@lib/convert-currency";
import { useEffect, useState } from "react";
import getUpdateFundsTransactionFee from "@lib/getUpdateFundsTransactionFee";
const AmountConfirmation = ({
	stashId,
	amount,
	subCurrency,
	type,
	close,
	nominations,
	handlePopoverClose,
	api,
	bondedAmount,
	networkInfo,
	onConfirm,
}) => {
	const [transactionFee, setTransactionFee] = useState(0);
	const [subFeeCurrency, setSubFeeCurrency] = useState(0);
	const [totalAmount, setTotalAmount] = useState(0);
	const [totalAmountFiat, setTotalAmountFiat] = useState(0);
	useEffect(() => {
		if (!transactionFee) {
			getUpdateFundsTransactionFee(
				stashId,
				amount,
				type,
				bondedAmount.currency,
				api,
				networkInfo
			).then((data) => {
				if (type == "unbond") {
					data.partialFee !== undefined
						? setTransactionFee(data.partialFee.toNumber())
						: setTransactionFee(0);
				} else setTransactionFee(data);
			});
		}
	}, [amount, stashId, networkInfo, type]);

	useEffect(() => {
		if (transactionFee) {
			convertCurrency(
				transactionFee / Math.pow(10, networkInfo.decimalPlaces),
				networkInfo.denom
			).then((data) => setSubFeeCurrency(data));
		}
	}, [transactionFee]);

	useEffect(() => {
		if (totalAmount) {
			convertCurrency(totalAmount, networkInfo.denom).then((data) =>
				setTotalAmountFiat(data)
			);
		}
	}, [totalAmount]);

	useEffect(() => {
		if (!totalAmount) {
			type === "bond"
				? setTotalAmount(amount + bondedAmount.currency)
				: setTotalAmount(bondedAmount.currency - amount);
		}
	}, [amount, bondedAmount]);

	return (
		<div className="flex flex-col">
			<div className="flex flex-col">
				<h3 className="mt-4 text-2xl">Confirmation</h3>
				<div className="mt-2 mb-8 rounded text-gray-900 flex items-center justify-between">
					<div className="rounded-lg flex-col ml-2">
						<span className="text-gray-500 white-space-nowrap text-xs">
							Current Investment Value
						</span>
						<h3 className="text-2xl white-space-nowrap">
							{formatCurrency.methods.formatAmount(
								Math.trunc(
									bondedAmount.currency *
										Math.pow(10, networkInfo.decimalPlaces)
								),
								networkInfo
							)}
						</h3>
						<span className="text-sm font-medium text-teal-500">
							${bondedAmount.subCurrency.toFixed(2)}
						</span>
					</div>
					<div>
						<ArrowRight size="2rem" />
					</div>
					<div className="rounded-lg flex-col mr-2 ">
						<span className="text-gray-500 white-space-nowrap  text-xs">
							Final Investment Value
						</span>
						<h3 className="text-2xl white-space-nowrap">
							{formatCurrency.methods.formatAmount(
								Math.trunc(
									totalAmount * Math.pow(10, networkInfo.decimalPlaces)
								),
								networkInfo
							)}
						</h3>
						<span className="text-sm font-medium text-teal-500">
							${totalAmountFiat.toFixed(2)}
						</span>
					</div>
				</div>
			</div>
			{/* <button
				className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
				onClick={handlePopoverClose}
			>
				Back to Dashboard
			</button> */}
			<div className="w-full mt-8">
				<div className="flex justify-between">
					<p className="text-gray-700 text-xs">Additional Investment Amount</p>
					<div className="flex flex-col">
						<p className="text-sm text-right">
							{type === "bond"
								? formatCurrency.methods.formatAmount(
										Math.trunc(amount * 10 ** networkInfo.decimalPlaces),
										networkInfo
								  )
								: formatCurrency.methods.formatAmount(0, networkInfo)}
						</p>
						<p className="text-xs text-right text-gray-600">
							${Number(0).toFixed(2)}
						</p>
					</div>
				</div>
				<div className="flex justify-between mt-4">
					<p className="text-gray-700 text-xs">Transaction Fee</p>

					<div className="flex flex-col">
						{transactionFee !== 0 ? (
							<div>
								<p className="text-sm text-right">
									{formatCurrency.methods.formatAmount(
										Math.trunc(transactionFee),
										networkInfo
									)}
								</p>
								<p className="text-xs text-right text-gray-600">
									${subFeeCurrency.toFixed(2)}
								</p>
							</div>
						) : (
							<Spinner />
						)}
					</div>
				</div>
				<Divider my={6} />
				<div className="flex justify-between">
					<p className="text-gray-700 text-sm font-semibold">Total Amount</p>
					<div className="flex flex-col">
						<p className="text-lg text-right font-bold">
							{type === "bond"
								? formatCurrency.methods.formatAmount(
										Math.trunc(amount * 10 ** networkInfo.decimalPlaces) +
											transactionFee,
										networkInfo
								  )
								: formatCurrency.methods.formatAmount(
										Math.trunc(transactionFee),
										networkInfo
								  )}
						</p>
						<p className="text-sm text-right text-gray-600 font-medium">
							$
							{type === "bond"
								? (subCurrency + subFeeCurrency).toFixed(2)
								: subFeeCurrency.toFixed(2)}
						</p>
					</div>
				</div>
			</div>
			<div className="w-full flex-center">
				<button
					className="rounded-full font-medium px-12 py-3 bg-teal-500 mt-40 mb-40 text-white"
					onClick={onConfirm}
				>
					Confirm
				</button>
			</div>
		</div>
	);
};
export default AmountConfirmation;
