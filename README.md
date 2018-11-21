# Goodbits Templating Bot

Helps you to get the Goodbits newsletter for [The Ember Times 🐹](https://twitter.com/embertimes) ready on a Friday afternoon 🌇 or night 🌙

## How To Use

- Clone this repo
```
git clone git@github.com:jessica-jordan/emberjs-times-tools.git
```
- Install the dependencies
```
yarn
```
- Install [CasperJS](casperjs.org) globally
```
yarn global add casperjs
```
- Install [SlimerJS](https://slimerjs.org/) globally
```
yarn global add slimerjs
```
- set the `GOODBITS_USER_EMAIL` and `GOODBITS_USER_PASSWORD` env variables in e.g. your `~/.bashrc` (ping @jessica on [the Ember Community Slack](https://discordapp.com/invite/zT3asNS) for the credentials):
```
// .bashrc
export GOODBITS_USER_EMAIL="goodbits-bot-email-address"
export GOODBITS_USER_PASSWORD="goodbits-bot-password"
```
- reload the settings in your current terminal tab
```
source ~/.bashrc
```
- this fine tool is built on top of excellent ✨, but a bit dated libraries. Please downgrade your Firefox browser to a version between 53 and 59 to make this script work. You can find a [download for Firefox v59 here](https://ftp.mozilla.org/pub/firefox/releases/59.0b9/)
- get a hold of the latest blog post url, e.g. `https://www.emberjs.com/blog/2018/11/16/the-ember-times-issue-73.html`
- finally run the script and pass in the url pointing to the latest blog post:
```
casperjs create-goodbits-template.js --botemail="$GOODBITS_USER_EMAIL" --botpassword="$GOODBITS_USER_PASSWORD" --engine="slimerjs" --botblogurl="https://www.emberjs.com/blog/2018/11/16/the-ember-times-issue-73.html"
```
- use the `--debug=true` for development and debugging 💛
- review 👀 and feel free to improve the template at [Goodbits](https://goodbits.io/c/7430/emails) - this tool isn't perfect, but tries its best to help with the mundane copy-pasta work ✍️
- schedule the newsletter and celebrate your support for The Ember Times this week.✨ Thank you! ❤️
