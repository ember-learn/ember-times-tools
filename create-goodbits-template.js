/* HOW TO USE:
- install casperjs globally
- install slimejs globally,
- install a Firefox version between 53 and 59 (most likely have to downgrade)
- run `casperjs create-goodbits-template.js --engine=slimerjs --botemail=<botemail> --botpassword=<botpwd>` --botblogurl="https://www.emberjs.com/blog/2018/11/16/the-ember-times-issue-73.html" */
var casper = require('casper').create();
casper.options.viewportSize = {width: 1600, height: 950};

var blogPage = casper.cli.get('botblogurl');
var blogFullContent = [];

function collectContentFromBlog() {
  /* Collecting all paragraphs, titles and links from the blog post page */
  var contentCollection = [];

  var allHeaders = document.querySelectorAll('#toc-content .anchorable-toc');
  var numOfSections = allHeaders.length;

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
      var currentParagraphs = Array.prototype.slice.call(allParagraphs).filter((el) => Array.prototype.slice.call(secondParagraphs).indexOf(el) < 0);
    } else {
      var currentParagraphs = allParagraphs;
    }
    var sectionParts = [].map.call(currentParagraphs, function(para) {
      return para.innerHTML;
    });

    var sectionBody = sectionParts.join();
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
    console.log(blogFullContent.length);
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
var contentMainLink = '.js-fetch-link-data-field';
var contentBody = 'trix-editor';
var contentChoices = '.cb-tab-group_content-choices';

function contentItem(num) {
  return `.cb-actions-nav .cb-chip:nth-child(${num + 1}) .cb-icon-title_and_text_sm`;
}

var botId = casper.cli.get('botemail');
var botPwd = casper.cli.get('botpassword');

function createTemplate() {
  console.log(blogFullContent);
  console.log(blogFullContent.length);
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

  // routine for block adding here...
  blogFullContent.map(function(content, index) {
    addContentBlockRoutine(casper, content, index);
  });

  casper.waitForSelector(editEmail, function() {
    console.log("saved content");
  });

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

    casper.wait(3000, function() {
      console.log("edit emails...");
    });

    casper.thenEvaluate(function(goBack) {
      document.querySelector(goBack).click();
    }, goBackToMainView);

    casper.wait(10000, function() {
      console.log("edit emails...");
    });

    var contentItemSelector = contentItem(iteration);

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

/* casper.then(function() {
  createTemplate();
}); */

casper.run();
