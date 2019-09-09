# Goodbits Templating Bot

Helps you to get the Goodbits newsletter for [The Ember Times 🐹](https://twitter.com/embertimes) ready on a Friday afternoon 🌇 or night 🌙

## Setup

- Clone this repo
```
git clone git@github.com:ember-learn/emberjs-times-tools.git
``` 
- `cd emberjs-times-tools`
- `nvm use` if you want to use the LTS version of Node, that we have tested 
- `npm install`
- set the `GOODBITS_USER_EMAIL` and `GOODBITS_USER_PASSWORD` env variables in e.g. your `~/.bashrc` (ping @jessica on [the Ember Community Discord](https://discordapp.com/invite/zT3asNS) for the credentials):
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

```bash
node create-goodbits-template.js --botemail="$GOODBITS_USER_EMAIL" --botpassword="$GOODBITS_USER_PASSWORD" --botblogurl="https://www.emberjs.com/blog/2018/11/16/the-ember-times-issue-73.html"
```

- use the `--debug=true` for development and debugging 💛
- review 👀 and feel free to improve the template at [Goodbits](https://goodbits.io/c/7430/emails) - this tool isn't perfect (see Troubleshooting Goodbits below!), but tries its best to help with the mundane copy-pasta work ✍️
- Goodbits creates "phantom" issues, so verify that the email subject matches the # of the issue we are sending.
- Send a test email to yourself, and verify that emojis display correctly (there is a difference in Goodbits.io and your email, e.g. Gmail).
- schedule the newsletter for 2pm PST (https://everytimezone.com/#2018-12-21,600,b8jj) and celebrate your support for The Ember Times this week.✨ Thank you! ❤️

## Troubleshooting Goodbits

- If there are bullets, remove any blank line between regular non-bulleted text & first line of bulleted text
- If there is ``` code block text, consider manually deleting the copied over code block in the Goodbits editor. Instead, you can try simply copying and pasting the ``` code block from the blog URL.
- Should be covered by `ember-times-tools` bot, but if not do double curlies manually: `{{` must be written as `{{ opening_double_curly() }}`, and `}}` as `{{ closing_double_curly() }}`.
- No double curlies in Titles. Causes the word within double curlies to not appear at all.
- If there are buttons, add manually. Delete the button in text and change to Content > Button in Goodbits.
- If there are images, e.g. contributor interview images, change "Display as" dropdown to "Article" in Goodbits and manually upload the image 
- Getting a 500 on goodbits.io? It may be because of a rogue double curly `{{` or `}}`, which must be written as `{{ opening_double_curly() }}` or `{{ closing_double_curly() }}`.
