/* HOW TO USE:
- install casperjs globally
- install slimejs globally,
- install a Firefox version between 53 and 59 (most likely have to downgrade)
- run `casperjs create-goodbits-template.js --engine=slimerjs --botemail=<botemail> --botpassword=<botpwd>` */
var casper = require('casper').create();
casper.options.viewportSize = {width: 1600, height: 950};

var homePage = 'https://goodbits.io/';
var signInPage = 'https://goodbits.io/users/sign_in';
var emailPage = 'https://goodbits.io/c/7430/emails';
var signInButton = '#sign-in-button';
var signInForm = '#new_user';
var sidebar = '.sidebar-nav-items-wrapper';
var emailList = 'form[action="/c/7430/emails"]';
var addNewEmailTemplate = '.button-new-issue';
var editEmail = '.newsletter_emails_edit';
var contentChoices = '.cb-tab-group_content-choices';
var lastContentChoice = '.cb-tab-group_content-choices a:last-child';
var contentItem = '.cb-actions-nav .cb-chip .cb-icon-title_and_text_sm';

var addContent = '.js-add-content-btn';

var botId = casper.cli.get('botemail');
var botPwd = casper.cli.get('botpassword');

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

casper.thenEvaluate(function() {
  document.querySelector('.cb-nav__header-action[href$="edit"]').click();
});

casper.wait(10000, function() {
  console.log("edit emails...");
});

casper.waitForSelector('.js-add-content-btn').thenEvaluate(function(contentItem) {
  document.querySelector(contentItem).click();
}, contentItem);

casper.waitForSelector('.cb-details__container').thenEvaluate(function() {
  document.querySelector('.js-fetch-link-data-field').setAttribute('value', 'my-link.com');
  document.querySelector('trix-editor').value = 'my content';
  document.querySelector('input[id$="-title"][id^="content-block"').setAttribute('value', 'MY TITLE');
});

casper.wait(3000, function() {
  console.log("edited first content");
});

casper.thenEvaluate(function() {
  document.querySelector('.cb-nav__header-action[href$="edit"]').click();
});

casper.wait(3000, function() {
  console.log("saved first content");
});

casper.run();


/* async function addContent() {
  let elementIndex = 1;
  return nightmare
  .evaluate(elementIndex => {
    var el = document.querySelector('.js-cb-sortable li');
    elementIndex = el.length;
  }, elementIndex)
  .click('.js-add-content-btn')
  .wait('.cb-tab-group_content-choices')
  .click('.cb-tab-group_content-choices a:last-child')
  .wait('.cb-inline-list')
  .click('.cb-inline-list a[href$="16"]')
  .wait(1000)
  .click('.cb-nav__header-action[href$="edit"]')
  .wait('.js-add-content-btn')
  .click(`.js-cb-sortable li:nth-child(${elementIndex}) a`)
  .type('.js-fetch-link-data-field', 'my-link.com')
  .type('trix-editor', 'my content')
  .type('.cb-form-group input[type="text"]', 'MY TITLE')
  .click('.cb-nav__header-action[href$="edit"]')
  .wait(3000)
  .end()
  .then(console.log)
  .catch(error => {
    console.error('Login failed:', error)
  })
}

async function createTemplate() {
  console.log("start login...");
  await login();
  console.log("logged in");
  // await addNewTemplate();
//   await addContent();
}

createTemplate(); */
