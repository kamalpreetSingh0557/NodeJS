// Envrionment variables
https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html
https://www.thirdrocktechkno.com/blog/how-to-set-environment-variable-in-node-js/

// Advance NodeJS

I've forwarded the suggestion to Jonas :) I can provide some guidance now though if you want to try to implement these yourself:

1. Blacklisting is done simply by creating another collection of blacklisted tokens. Each time a token comes in, you check it against the blacklist unless the token has expired. In order to clean the blacklist collection periodically, you can use MongoDB's TTL feature:

https://docs.mongodb.com/manual/tutorial/expire-data/

You just set the TTL for the document to be as long as the blacklisted token's expiration and it'll be removed automatically over time.

2. This is probably the easiest feature.

a) Create a JWT token.

b) Attach it to a URL and send it to the newly registered user in an email.

c) Once the user clicks the URL, extract the JWT from the URL and use it to find and activate the user in the database.

3. There's a good tutorial for this here:

https://www.youtube.com/watch?v=Yv5tZu5wAU0