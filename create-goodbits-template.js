/* HOW TO USE:
- install casperjs globally
- install slimejs globally,
- install a Firefox version between 53 and 59 (most likely have to downgrade)
- run `casperjs create-goodbits-template.js --botemail="$GOODBITS_USER_EMAIL" --botpassword="$GOODBITS_USER_PASSWORD" --engine="slimerjs" --botblogurl="https://www.emberjs.com/blog/2018/11/16/the-ember-times-issue-73.html
- use the `--debug=true` for development */
var casper = require('casper').create();
casper.options.viewportSize = {width: 1600, height: 950};

var blogPage = casper.cli.get('botblogurl');
var blogFullContent = [];

function domNodesDiff(fullList, excludedList) {
  return Array.prototype.slice.call(fullList).filter((el) => Array.prototype.slice.call(excludedList).indexOf(el) < 0);
}

function getTextFromParagraphs(paragraphs) {
  return [].map.call(paragraphs, function(para) {
    return para.innerHTML;
  }).join();
}

function collectContentFromBlog() {
  /* Collecting all paragraphs, titles and links from the blog post page */
  var contentCollection = [];

  var allHeaders = document.querySelectorAll('#toc-content .anchorable-toc');
  var numOfSections = allHeaders.length;

  var introAndSectionParagraphs = document.querySelectorAll('#toc-content p');
  var sectionParagraphs = document.querySelectorAll('#toc-content .anchorable-toc:nth-of-type(1) ~ p');
  var introParagraphs = domNodesDiff(introAndSectionParagraphs, sectionParagraphs);
  var editionNum = blogPage.match(/[0-9]*.html/)[0].match(/[0-9]*/)[0];;
  var introTitle = `Issue #${editionNum}`;
  var sectionSubTitle = `The Ember Times - Issue #${editionNum}`;

  contentCollection.push({ sectionBody: introParagraphs, sectionTitle: introTitle, sectionSubTitle });

  for (var index = 0; index < numOfSections; index += 1) {
    var thisIndex = index + 1;
    var nextIndex = thisIndex < numOfSections ? thisIndex + 1 : null;
    var allParagraphs = document.querySelectorAll(
      '#toc-content .anchorable-toc:nth-of-type(' + thisIndex + ') ~ p, #toc-content .anchorable-toc:nth-of-type(' + thisIndex + ') ~ ul, #toc-content .anchorable-toc:nth-of-type(' + thisIndex + ') ~ .blog-row'
    );
    if (nextIndex) {
      var secondParagraphs = document.querySelectorAll(
        `#toc-content .anchorable-toc:nth-of-type(${nextIndex}) ~ p,
        #toc-content .anchorable-toc:nth-of-type(${nextIndex}) ~ ul,
        #toc-content .anchorable-toc:nth-of-type(${nextIndex}) ~ .blog-row`
      );
      var currentParagraphs = domNodesDiff(allParagraphs, secondParagraphs);
    } else {
      var currentParagraphs = allParagraphs;
    }

    var sectionBody = getTextFromParagraphs(currentParagraphs);
    var sectionTitle = document.querySelector(`#toc-content .anchorable-toc:nth-of-type(${thisIndex})`).textContent;
    var sectionLink = document.querySelector(`#toc-content .anchorable-toc:nth-of-type(${thisIndex}) a:nth-child(2)`).href;

    contentCollection.push({ sectionTitle, sectionLink, sectionBody });
  }

  return contentCollection; /* works */
}

function getContent() {
  /* CONTENT COLLECTION FROM BLOG POST */

  casper.start(blogPage).thenEvaluate(function() {
    console.log("visiting " + blogPage + "...");
  });

  casper.wait(5000, function() {
    console.log("preparing content collection...");
  });

  casper.then(function() {
    // aggregate results from the post
    blogFullContent = this.evaluate(collectContentFromBlog);
  });

  casper.then(function() {
    this.wait(2000, function() {
      console.log("results...");
    });
  });

  casper.then(function() {
    console.log("Collected " + blogFullContent.length + " sections for the newsletter...");
  });

  casper.then(function() {
    this.wait(2000, function() {
      console.log("collected content.");
    });
  });

  casper.then(function() {
    blogFullContent = this.evaluate(collectContentFromBlog);
  });


  casper.then(function() {
    this.wait(2000, function() {
      console.log("Ready for template creation ✨");
    });
  });
}


/* ------------------------------------------------------------------------------ */

/* GOODBITS TEMPLATING */
var homePage = 'https://goodbits.io/';
var signInPage = 'https://goodbits.io/users/sign_in';
var emailPage = 'https://goodbits.io/c/7430/emails';
var signInButton = '#sign-in-button';
var signInForm = '#new_user';
var sidebar = '.sidebar-nav-items-wrapper';
var emailList = 'form[action="/c/7430/emails"]';
var addNewEmailTemplate = '.button-new-issue';
var editEmail = '.newsletter_emails_edit';
var addContent = '.js-add-content-btn';
var lastContentChoice = '.cb-tab-group_content-choices a:last-child';
var goBackToMainView = '.cb-nav__header-action[href$="edit"]';
var contentWindow = '.cb-details__container';
var contentTitle = 'input[id$="-title"][id^="content-block"]';
var contentSubTitle = 'input[id$="-preheader"][id^="content-block"]';
var contentMainLink = '.js-fetch-link-data-field';
var contentBody = 'trix-editor';
var contentChoices = '.cb-tab-group_content-choices';

function contentItem(num) {
  return '.js-cb-sortable li[data-position="' + parseInt(num + 2) + '"] a';
}

var botId = casper.cli.get('botemail');
var botPwd = casper.cli.get('botpassword');

function createTemplate() {
  casper.start(signInPage).thenEvaluate(function(botId, botPwd) {
      var emailField = '#user_email';
      var pwdField = '#user_password';
      var signInFormSubmit = 'input[type="submit"]';
      document.querySelector(emailField).setAttribute('value', botId);
      document.querySelector(pwdField).click();
      document.querySelector(pwdField).value = botPwd;
      document.querySelector(signInFormSubmit).click();
  }, botId, botPwd);

  casper.then(function() {
    this.waitForSelector(sidebar, function() {
      console.log("Logged in successfully ✨");
    });
  });

  casper.thenOpen(emailPage, function() {
    this.waitForSelector(emailList, function() {
      this.click(addNewEmailTemplate);
    });
  });

  var introContent = blogFullContent.shift();
  addIntroBlock(casper, introContent);

  // routine for block adding here...
  /* blogFullContent.map(function(content, index) {
    addContentBlockRoutine(casper, content, index);
  }); */

  casper.waitForSelector(editEmail, function() {
    console.log("saved content");
  });

  function addIntroBlock(casper, content) {
    /* Start Adding Content Block */
    var introItem = document.querySelector('.js-cb-sortable li[data-position="0"] a');

    casper.then(function() {
      this.wait(5000, function() {
        console.log("Adding intro, using selector " + introItem);
      });
    });

    casper.waitForSelector(addContent).thenEvaluate(function(contentItemSelector) {
      document.querySelector(contentItemSelector).click();
    }, introItem);

    casper.waitForSelector(contentWindow).thenEvaluate(function(contentSubTitle, contentBody, contentTitle, content) {
      document.querySelector(contentTitle).setAttribute('value', content.sectionTitle); /* works */
      document.querySelector(contentBody).value = content.sectionBody;
      document.querySelector(contentSubTitle).setAttribute('value', content.sectionLink);
    }, contentSubTitle, contentBody, contentTitle, content);

    casper.wait(3000, function() {
      console.log("Added intro. ✨");
    });

    casper.waitForSelector(goBackToMainView).thenEvaluate(function(goBack) {
      document.querySelector(goBack).click();
    }, goBackToMainView);
    /* Stop Adding Intro */
  }

  function addContentBlockRoutine(casper, content, iteration) {
    /* Start Adding Content Block */
    casper.waitForSelector(editEmail).thenEvaluate(function(addContent) {
      document.querySelector(addContent).click();
    }, addContent);

    casper.waitForSelector(contentChoices).thenEvaluate(function(lastContentChoice) {
      document.querySelector(lastContentChoice).click();
    }, lastContentChoice);

    casper.waitForSelector('.cb-inline-list').thenEvaluate(function() {
      document.querySelector('.cb-inline-list a[href$="16"]').click();
    });

    casper.then(function() {
      this.wait(2000, function() {
        console.log("editing...");
      });
    });

    casper.thenEvaluate(function(goBack) {
      document.querySelector(goBack).click();
    }, goBackToMainView);

    casper.then(function() {
      this.wait(2000, function() {
        console.log("still editing..");
      });
    });

    var contentItemSelector = contentItem(iteration);

    casper.then(function() {
      this.wait(2000, function() {
        console.log("using selector " + contentItemSelector);
      });
    });

    casper.waitForSelector(addContent).thenEvaluate(function(contentItemSelector) {
      document.querySelector(contentItemSelector).click();
    }, contentItemSelector);

    casper.waitForSelector(contentWindow).thenEvaluate(function(contentMainLink, contentBody, contentTitle, content) {
      document.querySelector(contentMainLink).setAttribute('value', content.sectionLink);
      document.querySelector(contentBody).value = content.sectionBody;
      document.querySelector(contentTitle).setAttribute('value', content.sectionTitle);
    }, contentMainLink, contentBody, contentTitle, content);

    casper.wait(3000, function() {
      console.log("edited first content");
    });

    casper.waitForSelector(goBackToMainView).thenEvaluate(function(goBack) {
      document.querySelector(goBack).click();
    }, goBackToMainView);
    /* Stop Adding Content Block */
  }
}

getContent();

casper.then(function() {
  createTemplate();
});

casper.run();
