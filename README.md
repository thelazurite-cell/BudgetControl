# BudgetControl
A web application for controlling budgeting 
* Angular frontend 
* NodeJS - TypeScript backend 
* MongoDB - For Storage

### Getting started
This demo app has a user of "Administrator" and a password of "foobar" that is created on first launch. 
You will need to modify the configuration of the backend to point to your internal IP, and make sure your env config on the frontend is pointing to it, too. 

### Known Issues
* After logging in you will need to refresh the page to get your authorized token.
* If you haven't previously visited the configuration page / had a term selected from the expenditures page, if you attempt to create a new term it may not always copy over your expected outgoings. Fix coming soon
