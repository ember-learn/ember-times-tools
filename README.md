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
  - If there are bullets, delete the line between regular text and bulleted text (should look like the pink box in the Goodbits editor)
  <insert image here> <maybe insert gif here>
  - If there is ``` code text, manually delete in Goodbits editor and copy and paste from the blog webpage
  <insert gif here> <maybe also insert image here>
  - If there are buttons, delete in text and change to Content > Button in Goodbits (add manually)
  - If there are images, e.g. contributor interview images, change "Display as" dropdown to "Article" in Goodbits and manually upload the image 
- Getting a 500 on goodbits.io? It may be because of a double curly `{{` or `}}` in a "Title" field, which doesn't work.
- Goodbits creates "phantom" issues, so verify that the email subject matches the # of the issue we are sending
- schedule the newsletter for 2pm PST (https://everytimezone.com/#2018-12-21,600,b8jj) and celebrate your support for The Ember Times this week.✨ Thank you! ❤️
