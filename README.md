# YieldScan

## Codebase Guide:

### Getting Started
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

