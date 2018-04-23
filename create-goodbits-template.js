const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true });
const goodbitsPwd = process.env.GOODBITS_USER_PASSWORD.trim();
console.log("start creating template...");

async function login() {
  return nightmare
    .goto('https://goodbits.io/')
    .click('#sign-in-button')
    .type('#user_email', process.env.GOODBITS_USER_EMAIL)
    .type('#user_password', goodbitsPwd)
    .type('input[type="submit"]', '\u000d')
    //.click('input[type="submit"]')
    .wait('.sidebar-nav-items-wrapper')
    //.evaluate(() => document.querySelector('#r1-0 a.result__a').href)
    //.end()
    .then(console.log)
    .catch(error => {
      console.error('Login failed:', error)
    })
}

async function addNewTemplate() {
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
  await login();
  await addNewTemplate();
  await addContent();
}

createTemplate();
