/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-console */

export const logger = {
	error: message => {
		console.log(`\x1b[31mLogger error: \x1b[0m  ${message}`);
	},
	warn: message => {
		console.log(`\x1b[33mLogger warn:  \x1b[0m  ${message}`);
	},
	log: message => {
		console.log(`\x1b[36mLogger log:  \x1b[0m   ${message}`);
	},
};
