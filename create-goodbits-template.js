'use strict'

/* HOW TO USE:
- yarn install
- run `node create-goodbits-template.js --botemail="$GOODBITS_USER_EMAIL" --botpassword="$GOODBITS_USER_PASSWORD" --botblogurl="https://www.emberjs.com/blog/2018/11/16/the-ember-times-issue-73.html"
- use the `--debug=true` for development */
const puppeteer = require('puppeteer');
const argv = require('yargs').argv
const scripts = require('./lib/goodbits');

/* Script Arguments */
const botblogurl = argv.botblogurl;
const botemail = argv.botemail;
const botpassword = argv.botpassword;

puppeteer.launch({
	devtools: argv.debug,
	defaultViewport: {
		width: 1600,
		height: 950
	}
}).then(async (browser) => {
	const page = await browser.newPage();
	scripts.goodbits(page, { botblogurl, botemail, botpassword });
});
