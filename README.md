# YieldScan
Maximizing yield on staking. Starting with Kusama.

## Table of contents
  - [Currently supported networks](#supported_networks)
  - [Description](#description)
  - [Usage](#usage)
  - [Development](#development)
  - [Gratitude](#gratitude)

## Currently supported networks <a name = "supported_networks"></a>
- [Kusama Network](https://kusama.network/)

## Description <a name = "description"></a>
We aim to solve the problems of information asymmetry in identifying and optimizing returns on staking, reducing time and capital costs for stakers to make staking decisions.

This project is funded and supported by the [Web3 Foundation](https://web3.foundation/) - under [Wave 6](https://github.com/w3f/General-Grants-Program/blob/master/grants/accepted_grant_applications.md#wave-6).

## Usage <a name = "usage"></a>
For a usage guide see https://yieldscan.tawk.help/article/how-do-i-get-started

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
