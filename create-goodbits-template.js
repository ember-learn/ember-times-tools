'use strict'

/* HOW TO USE:
- npm install
- run `node create-goodbits-template.js --botemail="$GOODBITS_USER_EMAIL" --botpassword="$GOODBITS_USER_PASSWORD" --botblogurl="https://www.emberjs.com/blog/2018/11/16/the-ember-times-issue-73.html"
- use the `--debug=true` for development */
const puppeteer = require('puppeteer');
const argv = require('yargs').argv

puppeteer.launch({
	devtools: argv.debug,
	defaultViewport: {
		width: 1600,
		height: 950
	}
}).then((browser) => {
	goodbits(browser);
});

async function goodbits(browserInstance) {
	let content = await getContent(browserInstance);
	await createTemplate(content, browserInstance);
}

async function getContent(browser) {
	let blogPage = argv.botblogurl
	/* CONTENT COLLECTION FROM BLOG POST */
	const page = await browser.newPage();
	await page.goto(blogPage).then(() => {
		console.log(`Visiting ${blogPage} ...`);
	});

	const resultsSelector = `#toc-content`;

	return await page.evaluate((resultsSelector, blogPage) => {
		domNodesDiff = (fullList, excludedList) => {
			return [...fullList].slice().filter((el) => ![...excludedList].slice().includes(el));
		}

		getTextFromParagraphs = (paragraphs) => {
			if (paragraphs) {
				return [...paragraphs].map((para) => {
					return para.outerHTML;
				}).join("");
			}
			return "";
		}

		getParagraphs = (index) => {
			return document.querySelectorAll(
        `#toc-content > p,
				#toc-content .anchorable-toc:nth-of-type(${index}) ~ ul,
				#toc-content .anchorable-toc:nth-of-type(${index}) ~ .blog-row`
			);
		}

		/* Collecting all paragraphs, titles and links from the blog post page */
		let contentCollection = [];
		let currentParagraphs;

		let allHeaders = document.querySelectorAll('#toc-content .anchorable-toc');
		let numOfSections = allHeaders.length;

		/* Adding Intro Content */
		let introAndSectionParagraphs = document.querySelectorAll('#toc-content > p'); 
		let sectionParagraphs = document.querySelectorAll( // < get first 2 p tags before hr
			`#toc-content h2:nth-of-type(1) ~ p,
			#toc-content .anchorable-toc:nth-of-type(1) ~ ul,
			#toc-content .anchorable-toc:nth-of-type(1) ~ .blog-row`
		);
		let introParagraphs = domNodesDiff(introAndSectionParagraphs, sectionParagraphs);
		let editionNum = blogPage.match(/[0-9]*.html/)[0].match(/[0-9]*/)[0];
		let introTitle = `Issue #${editionNum}`;
		let sectionSubTitle = `The Ember Times - Issue #${editionNum}`;

		let introBody = getTextFromParagraphs(introParagraphs);

    contentCollection.push({
			sectionBody: introBody,
			sectionTitle: introTitle,
			sectionSubTitle
		});

		let index = 0;
		while (index < numOfSections) {
			let thisIndex = index + 1;
			let nextIndex = thisIndex < numOfSections ? thisIndex + 1 : null;
			let allParagraphs = getParagraphs(thisIndex)
			if (nextIndex) {
				let secondParagraphs = getParagraphs(nextIndex)
				currentParagraphs = domNodesDiff(allParagraphs, secondParagraphs);
			} else {
				currentParagraphs = allParagraphs;
			}

			let sectionBody = getTextFromParagraphs(currentParagraphs);
			let sectionTitle = document.querySelector(`#toc-content h2:nth-of-type(${thisIndex})`).textContent;
			let sectionLink = document.querySelector(`#toc-content h2:nth-of-type(${thisIndex}) a:nth-child(2)`).href;

			contentCollection.push({
				sectionTitle,
				sectionLink,
				sectionBody
			});
			index += 1
		}
		return contentCollection; /* works */

	}, resultsSelector, blogPage)
}





/* ------------------------------------------------------------------------------ */

/* GOODBITS TEMPLATING */
let homePage = 'https://goodbits.io/';
let signInPage = 'https://goodbits.io/users/login';
let emailPage = 'https://goodbits.io/c/7430/emails';
let signInButton = '#sign-in-button';
let signInForm = '#new_user';
let sidebar = '.sidebar-nav-items-wrapper';
let emailList = 'form[action="/c/7430/emails"]';
let addNewEmailTemplate = '.button-new-issue';
let editEmail = '.newsletter_emails_edit';
let addContent = '.js-add-content-btn';
let lastContentChoice = '.cb-tab-group_content-choices a:last-child';
let goBackToMainView = '.cb-nav__header-action[href$="edit"]';
let contentWindow = '.cb-details__container';
let contentTitle = 'input[id$="-title"][id^="content-block"]';
let contentSubTitle = 'input[id$="-preheader"][id^="content-block"]';
let contentMainLink = '.js-fetch-link-data-field';
let contentBody = 'trix-editor';
let contentChoices = '.cb-tab-group_content-choices';
let openDblCurliesRpl = '{{ opening_double_curly() }}'
let closeDblCurliesRpl = '{{ closing_double_curly() }}'

let contentItem = (num) => {
	return `.js-cb-sortable li[data-position="${parseInt(num + 2)}"] a`;
}

let botId = argv.botemail;
let botPwd = argv.botpassword;

async function createTemplate(blogFullContent, browser) {
	console.log(`Collected text content from ${blogFullContent.length} sections to copy.`);
	// signin to Goodbits


	let page = await browser.newPage();
	await page.goto(signInPage).then(() => {
		console.log(`Visiting ${signInPage} ...`);
	});
	await page.evaluate((botId, botPwd) => {
		let emailField = '#user_email';
		let pwdField = '#user_password';
		let signInFormSubmit = 'input[type="submit"]';
		document.querySelector(emailField).setAttribute('value', botId);
		document.querySelector(pwdField).click();
		document.querySelector(pwdField).value = botPwd;
		document.querySelector(signInFormSubmit).click();
	}, botId, botPwd);

	//wait for main view to load
	await page.waitForSelector(sidebar).then(() => {
		console.log("Logged in successfully ✨");
	})
	// go to emails and create a new empty template
	await page.goto(emailPage)
	await page.waitForSelector(emailList);
	await page.click(addNewEmailTemplate);

	// add the intro section
	let introContent = blogFullContent.shift();
	await addIntroBlock(page, introContent);


	let index = 0;
	for (let content of blogFullContent) {
		await addContentBlockRoutine(page, content, index, blogFullContent);
		index += 1;
		// if (index === 5) break; //for debugging Drang n Drop
	}

	await page.waitFor(1000).then(() => {
		console.log('Drag "Social Links" to the bottom (below "#embertimes", above "Footer")  🤖...');
	});

	let social = await page.$('.blank-list li[data-position="1"]');
	let box = await social.boundingBox();
	let boxCenterX = box.x + box.width / 2
	let boxCenterY =  box.y + box.height / 2
	await page.mouse.move(boxCenterX, boxCenterY);
	await page.mouse.down();
	let moveDown = ((index+1)*105);
	let movePixel =  boxCenterY
	while ( movePixel < moveDown ) {
		//slowly move the mouse so that ui-sortable can pickup the events.
		await page.waitFor(100);  
		await page.mouse.move(0, movePixel +=5 );
	}
	await page.mouse.up();

	// Save for later....
	// await page.evaluate((index) => {
	// 	debugger;
	// 	let dnd = $('.blank-list')
	// 	let social = $('.blank-list li[data-position="1"]')
	// 	let lastPos = $(`.blank-list li[data-position="${index+1}"]`);
	// 	social.insertAfter(lastPos);
	// 	dnd.trigger("sortupdate");
	// }, index);


	/*
	Readers' Questions
		Change to article
		Delete broken image in text
		Add line break before "Submit your own", should be new paragraph
		Upload image emberjs.com/images/tomsters/officehours-42680347.png
	*/
	await page.waitFor(2000);
	await page.evaluate(() => {
		$('.js-cb-sortable li a:contains("Readers\' Questions")')[0].click();
	});
	await page.waitFor(2000);

	await page.evaluate((contentBody) => {
		document.querySelector('.js-component-selector button').click();
		
		// Change to article
		document.querySelector('ul.dropdown-menu a[data-component-id="6"]').click();

		// Delete broken image in text
		let editor = document.querySelector(contentBody);
		// let editorImage = document.querySelector(`${contentBody} figure`);
		// editorImage.parentNode.removeChild(editorImage);

		// debugger;
		// Add line break before "Submit your own", should be new paragraph
		let lastDiv = editor.querySelector('div:last-child');
		lastDiv.innerHTML = `<br>${lastDiv.innerHTML}`;
	}, contentBody);

	await page.waitFor(3000).then(() => {
		console.log(`Finished Changing Readers' Questions`);
	});

	const input = await page.$('input[type="file"]')
	await input.uploadFile('./officehours-42680347.png')

	await page.waitForSelector(goBackToMainView);
	await page.evaluate(goBack => {
		document.querySelector(goBack).click();
	}, goBackToMainView);

	// wrapping up
	await page.waitForSelector(editEmail).then(() => {
		console.log("beep bop 🤖🐹...");
	});
	await page.waitFor(2000).then(() => {
		console.log("✨✨✨ The template is now ready for your review at https://goodbits.io/c/7430/emails ✨");
		console.log("If you had any issues running the script, feel free to report those or send bug fixes to https://github.com/jessica-jordan/emberjs-times-tools");
		console.log("Thank you for helping with The Ember Times today and see you again another time! 💖");
	});
	await browser.close();

};
async function addIntroBlock(page, content) {
	await page.waitFor(5000).then(() => {
		console.log("Adding intro....");
	});

	await page.waitForSelector(addContent);

	await page.evaluate(() => {
		document.querySelector('.js-cb-sortable li[data-position="0"] a').click();
	});

	await page.waitForSelector(contentWindow);
	await page.evaluate((contentSubTitle, contentBody, contentTitle, content, openDblCurliesRpl, closeDblCurliesRpl) => {
		let curlyRegex = /({{)((?:\s*[^\s{}]+\s*|{\s*[^\s{}]+\s*}|[&#^\/>!]\s*[^\s{}]+\s*))(}})/g;
		content.sectionBody = content.sectionBody.replace(curlyRegex, `${openDblCurliesRpl}$2${closeDblCurliesRpl}`);

		document.querySelector(contentTitle).setAttribute('value', content.sectionTitle); /* works */
		let editor = document.querySelector(contentBody);
		editor.value = content.sectionBody;
		let lastDiv = editor.querySelector('div:last-child');
		/* the last element in a content editor window might but doesn't need to be a div, but might also be an ul, etc. */
		if (lastDiv) {
		  const regex = /(\s*<br\s*\/?\s*>\s*)*\s*$/g;
		  lastDiv.innerHTML = lastDiv.innerHTML.replace(regex, '');
	  }
		document.querySelector(contentSubTitle).setAttribute('value', content.sectionSubTitle);
	}, contentSubTitle, contentBody, contentTitle, content, openDblCurliesRpl, closeDblCurliesRpl);

	await page.waitFor(3000).then(() => {
		console.log("Added intro. ✨");
	});

	await page.waitForSelector(goBackToMainView);
	await page.evaluate(goBack => {
		document.querySelector(goBack).click();
	}, goBackToMainView);
}

async function addContentBlockRoutine(page, content, iteration, blogFullContent) {
	/* Start Adding Content Block */
	await page.waitForSelector(editEmail);
	await page.evaluate(addContent => {
		document.querySelector(addContent).click();
	}, addContent);

	await page.waitForSelector(contentChoices);
	await page.evaluate(lastContentChoice => {
		document.querySelector(lastContentChoice).click();
	}, lastContentChoice);

	await page.waitForSelector('.cb-inline-list')
	await page.evaluate(() => {
		document.querySelector('.cb-inline-list a[href$="16"]').click();
	});

	await page.waitFor(2000).then(() => {
		console.log(`Editing content (${parseInt(iteration + 1)}/${blogFullContent.length})`);
	});

	await page.evaluate(goBack => {
		document.querySelector(goBack).click();
	}, goBackToMainView);

	let contentItemSelector = contentItem(iteration);

	await page.waitForSelector(addContent)
	await page.evaluate(contentItemSelector => {
		document.querySelector(contentItemSelector).click();
	}, contentItemSelector);

	await page.waitForSelector(contentWindow);
	await page.evaluate((contentMainLink, contentBody, contentTitle, content, openDblCurliesRpl, closeDblCurliesRpl) => {
		let curlyRegex = /({{)((?:\s*[^\s{}]+\s*|{\s*[^\s{}]+\s*}|[&#^\/>!]\s*[^\s{}]+\s*))(}})/g;
		let imgsRegex = /<img[^>]*?src\s*=\s*[""']?([^'"" >]+?)[ '""][^>]*?>/g;

		content.sectionBody = content.sectionBody.replace(curlyRegex, `${openDblCurliesRpl}$2${closeDblCurliesRpl}`);
		content.sectionBody = content.sectionBody.replace(imgsRegex, '');

		document.querySelector(contentMainLink).setAttribute('value', content.sectionLink);

		let editor = document.querySelector(contentBody);
		editor.value = content.sectionBody
		let lastDiv = editor.querySelector('div:last-child');
		/* only remove the whitespace if the last paragraph in the editor window is a div (and not e.g. an ul) */
		if (lastDiv) {
		  const regex = /(\s*<br\s*\/?\s*>\s*)*\s*$/g;
		  lastDiv.innerHTML = lastDiv.innerHTML.replace(regex, '');
	  }
		document.querySelector(contentTitle).setAttribute('value', content.sectionTitle);
	}, contentMainLink, contentBody, contentTitle, content, openDblCurliesRpl, closeDblCurliesRpl);

	await page.waitFor(3000).then(() => {
		console.log(`Finished editing content (${parseInt(iteration + 1)}/${blogFullContent.length})`);
	});

	await page.waitForSelector(goBackToMainView);
	await page.evaluate(goBack => {
		document.querySelector(goBack).click();
	}, goBackToMainView);
	/* Stop Adding Content Block */
}
