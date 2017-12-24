# eventops-mobile
## Full Stack Web Development Specialization Capstone Project - Ionic mobile client

### Installing
Clone this repository and run `ionic serve` (you must have installed ionic CLI)
### Client salient features
- Security through [Basic HTTP Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)
- Add, update and delete public/private events
- List user created events
- Find nearby events in a map
- View event details
- Share event info with your contacts
- Send assistance requests to your contacts
- View sent/received assistance requests
- Change the state of an assistance request

**Known issues**
- When running the client in the browser , pressing F5 leads to an state where the factories lost the authentication parameters (just press F5 again and the app brings you again to the login page)
- The **share** button (both) always shows an error. This happens because the IBM cloud email service "Sendgrid" is a paid service, and my budget is too low :sweat_smile:
