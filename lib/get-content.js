module.exports = async function getContent(page, args) {
	let blogPage = args.botblogurl;
	/* CONTENT COLLECTION FROM BLOG POST */
	await page.goto(blogPage);

	console.log(`Visiting ${blogPage} ...`);

	return await page.evaluate((blogPage) => {
		getTextFromParagraphs = (paragraphs) => {
			if (paragraphs) {
				return [...paragraphs].map((para) => {
					return para.outerHTML;
				}).join("");
			}
			return "";
		}

		getParagraphs = (index) => {
			return document.querySelectorAll(`[data-embertimes-section-fragment="${index}"]`);
		}

		/* Collecting all paragraphs, titles and links from the blog post page */
		let contentCollection = [];
		let currentParagraphs;
		let numberOfSections = document.querySelectorAll('[data-embertimes-section-title]').length;

		/* Collecting Intro Content */
		let introParagraphs = document.querySelectorAll('[data-embertimes-intro-fragment]');
    let introBody = getTextFromParagraphs(introParagraphs);

		let introSubTitle = document.querySelector('[data-embertimes-title]').textContent;

    let editionNum = blogPage.match(/[0-9]*.html/)[0].match(/[0-9]*/)[0];
    let introTitle = `Issue #${editionNum}`;

    /* adding intro to the content list */
		contentCollection.push({
			sectionBody: introBody,
			sectionTitle: introTitle,
			sectionSubTitle: introSubTitle,
		});

		let index = 0;

    /* Collecting Main Content */
		while (index < numberOfSections) {
      currentParagraphs = getParagraphs(index);

			let sectionBody = getTextFromParagraphs(currentParagraphs);
			let sectionTitle = document.querySelector(`[data-embertimes-section-title="${index}"]`).textContent;
			let sectionLink = document.querySelector(`[data-embertimes-section-title="${index}"] a`).href;

      /* adding section to the content list */
			contentCollection.push({
				sectionTitle,
				sectionLink,
				sectionBody
			});
			index += 1
		}

		return contentCollection; /* works */

	}, blogPage)
}
