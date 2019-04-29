# Goodbits Templating Bot

Helps you to get the Goodbits newsletter for [The Ember Times 🐹](https://twitter.com/embertimes) ready on a Friday afternoon 🌇 or night 🌙

## Setup

- Clone this repo
```
git clone git@github.com:jessica-jordan/emberjs-times-tools.git
``` 
- `cd emberjs-times-tools`
- `npm install`
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

## How to Use

- get a hold of the latest blog post url, e.g. `https://www.emberjs.com/blog/2018/11/16/the-ember-times-issue-73.html`
- finally run the script and pass in the url pointing to the latest blog post:
```
node create-goodbits-template.js --botemail="$GOODBITS_USER_EMAIL" --botpassword="$GOODBITS_USER_PASSWORD" --botblogurl="https://www.emberjs.com/blog/2018/11/16/the-ember-times-issue-73.html"
```
- use the `--debug=true` for development and debugging 💛
- review 👀 and feel free to improve the template at [Goodbits](https://goodbits.io/c/7430/emails) - this tool isn't perfect, but tries its best to help with the mundane copy-pasta work ✍️
  - Drag "Social Links" to the bottom (below "#embertimes", above "Footer")
  - Readers' Questions 
      - Change "Display as" dropdown to "Article" 
      - Delete broken image in text
      - Add line break before "Submit your own", should be new paragraph
      - Upload image https://emberjs.com/images/tomsters/officehours-42680347.png
  - Replace any double curlies
    - Opening double curlies `{{` should be `{{ opening_double_curly() }}` in Goodbits
    - Closing double curlies `}}` should be `{{ closing_double_curly() }}` in Goodbits
  - If there are buttons, delete in text and change to Content > Button in Goodbits (add manually)
  - If there are images, e.g. contributor interview images, change "Display as" dropdown to "Article" in Goodbits and manually upload the image 
- schedule the newsletter for 2pm PST (https://everytimezone.com/#2018-12-21,600,b8jj) and celebrate your support for The Ember Times this week.✨ Thank you! ❤️
