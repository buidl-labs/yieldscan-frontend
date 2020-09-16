# YieldScan
Maximizing yield on staking. Starting with Kusama.

## Table of contents
  - [Currently supported networks](#supported_networks)
  - [Description](#description)
  - [Usage](#usage)
      - [Pre-requisites](#usage-pre-requisites)
      - [Usage Instructions](#usage-instructions)
  - [Development](#development)
      - [Pre-requisites](#development-pre-requisites)
      - [Installation Instructions](#installation)
      - [Dependencies](#dependencies)
  - [Gratitude](#gratitude)

## Currently supported networks <a name = "supported_networks"></a>
- [Kusama Network](https://kusama.network/)

## Description <a name = "description"></a>
We aim to solve the problems of information asymmetry in identifying and optimizing returns on staking, reducing time and capital costs for stakers to make staking decisions.

This project is funded and supported by the [Web3 Foundation](https://web3.foundation/) - under [Wave 6](https://github.com/w3f/General-Grants-Program/blob/master/grants/accepted_grant_applications.md#wave-6).

## Usage <a name = "usage"></a>

### Pre-requisites <a name = "usage-pre-requisites"></a>
- PolkadotJS browser extension
- At least one account on Kusama with enough balance to pay for transaction fees and bond funds.

Currently, the app can be used on https://yieldscan.onrender.com/, but the domain is likely to change and shall be updated here.

> :warning: **IMPORTANT:** Please note that this project is in early beta stage and bugs and issues are to be expected.
>
> Borrowing from Kusama's tagline - "**Expect Chaos**"

### Usage Instructions <a name = "usage-instructions"></a>

1. Go to [YieldScan](https://yieldscan.onrender.com/). You will be greeted with the following page:
![YieldScan Landing Page](https://i.imgur.com/5ZJtyL7.png)

2. Enter your budget and click "Calculate Returns". You will be redirected to the returns calculator, which will show you your potential earnings and allow you to tweak your staking preferences to get varied results:
![Return Calculator - Wallet Not Connected](https://i.imgur.com/dFEWJ7f.png)

3. Once you're satisfied with your preferences and inputs, simply connect your PolkadotJS wallet by clicking either the "Connect wallet" button on the header or by clicking the "Connect wallet to stake" button in returns card. This will prompt you connect your wallet:
![Wallet Connection Popup](https://i.imgur.com/jSDenwQ.png)

Click on "Connect my wallet". You will be prompted by PolkadotJS to authorize YieldScan - this authorization is needed for us to prompt you to sign transactions - this keeps your keys safe and allows you to be in control of whether or not you want any transaction to be sent to the chain.

4. Once you've authorized the app, simply select an account for staking and you'll be ready to proceed forward from the return calculator.

5. Simply click the "Stake" button on the returns calculator and you'll be redirected to the payment confirmation page:
![Payment Confirmation](https://i.imgur.com/6GvJhYJ.png)

6. Once you're satisfied with the selected preferences, click on confirm and read the terms of service - please make sure you understand the risks before you proceed any further. Once you understand the risks and agree to the terms, you'll be taken to the reward destination selection step. If you have decided to compound your rewards on the calculator, you can simply proceed forward. If you decided to not compound your rewards and plan to use a separate controller for staking, then select the reward destination of your choice (i.e. stash or controller) where you would like for you rewards to be awarded and then proceed.
![Reward Destination](https://i.imgur.com/Lj4flVB.png)

7. Finally, you'll be asked to confirm the staking amount and the account(s) being used for nomination. You can edit the controller here if you like or use the default selection - i.e. same account for stash as well as controller.
![Account confirmation](https://i.imgur.com/kiUYhJs.png)

8. Click on "Transact and Stake" and you'll be prompted by the PolkadotJS extension to sign the transaction:
![Transaction Signing](https://i.imgur.com/iqZKkSl.png)

9. Congratulations! You're now a nominator:

![Success](https://i.imgur.com/diqTjkr.png)

10. On clicking proceed, you'll be redirected to your staking dashboard where you can see your expected returns, manage your nominations, unbond or bond more funds and change the payment destination:

![Dashboard](https://i.imgur.com/b66gDfq.png)

## Development <a name = "development"></a>

### Getting Started
- Clone the repository:
	```bash
	git clone https://github.com/buidl-labs/yieldscan-frontend
	```
- Install the dependencies:
	```bash
	npm install
	# or
	yarn
	```
- Add environment variables in `.env.local`
	```env
	# Main API endpoint
	NEXT_PUBLIC_API_BASE_URL=<base-url-of-deployed/local-api>

	# Tracking
	NEXT_PUBLIC_AMPLITUDE_API_TOKEN=<your-amplitude-api-token> # For development you can pass a string like "none" - to prevent unnecessary data from being logged
	NEXT_PUBLIC_METOMIC_PROJECT_ID=<your-metomic-project-id>

	# Sentry (optional)
	NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>

	# Only required to upload sourcemaps

	SENTRY_ORG=<your-sentry-org>
	SENTRY_PROJECT=<your-sentry-project>
	SENTRY_AUTH_TOKEN=<your-sentry-auth-token>
	```
	Note: You can checkout the backend codebase [here](https://github.com/buidl-labs/yieldscan-backend-ts).
	
	Useful resources:
	
	- [Amplitude](https://amplitude.com/)
	- [Metomic](https://metomic.io/)
	- [Sentry](https://sentry.io/)

- Run the development server:

	```bash
	npm run dev
	# or
	yarn dev
	```

	Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

	You can start editing any page by modifying `pages/<page>.js`. The page auto-updates as you edit the file.

- Creating a new user flow?
		
	- Create a new page in `pages/<page>.js`
	- Create a layout if needed in `components/common/layouts` else use `components/common/layouts/base.js`
	- Create the page's root component in `components/<page>/index.js`
		 
### Git commit
  Run `npm run git:commit` for commiting your code and follow the process

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.


## Gratitude <a name = "gratitude"></a>

![](https://github.com/buidl-labs/polkadot-chains-indexer/blob/master/.github/web3%20foundation_grants_badge_black.png)
