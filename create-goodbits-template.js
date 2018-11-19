/* HOW TO USE:
- install casperjs globally
- install slimejs globally,
- install a Firefox version between 53 and 59 (most likely have to downgrade)
- run `casperjs create-goodbits-template.js --engine=slimerjs --botemail=<botemail> --botpassword=<botpwd>` */
var casper = require('casper').create();

var homePage = 'https://goodbits.io/';
var signInPage = 'https://goodbits.io/users/sign_in';
var signInButton = '#sign-in-button';
var signInForm = '#new_user';
var sidebar = '.sidebar-nav-items-wrapper';

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
    this.wait(5000, function() {
      console.log("done");
    });
  });
});

casper.run();

  /* return nightmare
    .goto('https://goodbits.io/')
/*    .click('#sign-in-button')
    .type('#user_email', process.env.GOODBITS_USER_EMAIL)
    .type('#user_password', goodbitsPwd)
    .type('input[type="submit"]', '\u000d')
    .click('input[type="submit"]')
    .wait('.sidebar-nav-items-wrapper')
    .evaluate(() => document.querySelector('#r1-0 a.result__a').href)
    .end()
    .then(console.log)
    .catch(error => {
      console.error('Login failed:', error)
    }) */

/* async function addNewTemplate() {
  return nightmare
    .goto('https://goodbits.io/c/7430/emails')
    .wait('form[action="/c/7430/emails"]')
    .click('.button-new-issue')
    .wait('.newsletter_emails_edit')
    .then(console.log)
  //  .end()
    .catch(error => {
      console.error('Login failed:', error)
    })
}

async function addContent() {
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
