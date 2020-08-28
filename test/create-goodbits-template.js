var assert = require('assert');
var script = require('../lib/goodbits.js');
var getContent = require('../lib/get-content');
var mocker = require('puppeteer-request-mocker');
const puppeteer = require('puppeteer');

describe('Create Goodbits Templates', function() {
  describe('getContent util', function() {
    it('it extracts the intro section', async function() {
      let browser = await puppeteer.launch({
        devtools: false,
        defaultViewport: {
          width: 1600,
          height: 950
        }
      });
      const page = await browser.newPage();
      let content = await getContent(page, { botblogurl: 'http://localhost:8080/ember-times-example-post-999.html' });

      assert.equal(content[0].sectionTitle, 'Issue #999');
      assert.equal(content[0].sectionSubTitle, 'The Ember Times - Issue No. 999');
      assert.equal(content[0].sectionBody.trim(), `<p data-embertimes-intro-fragment="true">Hello again!</p><p data-embertimes-intro-fragment="true">Some text, some emojis 💝🎉💯🆙🤖, some <code>here</code>.</p>`);

      await browser.close();
    });

    it('it extracts a paragraph only section', async function() {
      let browser = await puppeteer.launch();
      const page = await browser.newPage();
      let content = await getContent(page, { botblogurl: 'http://localhost:8080/ember-times-example-post-999.html' });

      assert.ok(content[1], 'a section separate from the intro exists');
      assert.equal(content[1].sectionTitle, 'Interview with Ember Core Team Member Jen Weber 💝');
      assert.equal(content[1].sectionLink, 'https://jenweber.github.io/portfolio/');
      assert.equal(content[1].sectionBody.trim(), `<p data-embertimes-section-fragment="0">Jen Weber builds Ember apps and is <a href="https://emberjs.com/team/">part of the Ember Framework team ✨</a>.</p><p data-embertimes-section-fragment="0">There is more to the <a href="https://github.com/jenweber">story</a>.</p><p data-embertimes-section-fragment="0">Questions? Read the full article.</p><p data-embertimes-section-fragment="0"><a href="#">Learn more</a>!</p>`);

      await browser.close();
    });

    it('it extracts a section with quotes', async function() {
      let browser = await puppeteer.launch();
      const page = await browser.newPage();
      let content = await getContent(page, { botblogurl: 'http://localhost:8080/ember-times-example-post-999.html' });

      assert.ok(content[2].sectionBody.includes(`blockquote`), 'a section containing quotes was extracted');

      await browser.close();
    });

    it('it extracts a section with lists', async function() {
      let browser = await puppeteer.launch();
      const page = await browser.newPage();
      let content = await getContent(page, { botblogurl: 'http://localhost:8080/ember-times-example-post-999.html' });

      assert.ok(content[2].sectionBody.includes(`ul`), 'a section containing lists was extracted');
      assert.ok(content[2].sectionBody.includes(`li`), 'a section containing lists was extracted');

      await browser.close();
    });

    it('it extracts all paragraphs', async function() {
      let browser = await puppeteer.launch();
      const page = await browser.newPage();
      let content = await getContent(page, { botblogurl: 'http://localhost:8080/ember-times-example-post-999.html' });
      assert.equal(content.length, 4);

      await browser.close();
    });
  });
});
