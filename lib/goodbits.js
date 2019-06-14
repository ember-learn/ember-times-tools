'use strict'

const getContent = require('./get-content.js');
const createTemplate = require('./create-template.js');

module.exports.goodbits = async function(page, scriptArgs) {
	let content = await getContent(page, scriptArgs);
  await createTemplate(content, page, scriptArgs);
}

module.exports.getContent = getContent;
module.exports.createTemplate = createTemplate;
