
> ### React + Redux codebase containing project examples (auth, admin-panel, etc)

## Getting started

To get the frontend running locally:

- Clone this repo
- `npm install` to install all req'd dependencies
- `npm start` to start the local server (this project uses create-react-app)

Local web server will use port 3000. You can configure port in scripts section of `package.json`: we use [cross-env](https://github.com/kentcdodds/cross-env) to set environment variable PORT for React scripts, this is Windows-compatible way of setting environment variables.
 
Alternatively, you can add `.env` file in the root folder of project to set environment variables (use PORT to change webserver's port). This file will be ignored by git, so it is suitable for API keys and other sensitive stuff. Refer to [dotenv](https://github.com/motdotla/dotenv) and [React](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-development-environment-variables-in-env) documentation for more details. Also, please remove setting variable via script section of `package.json` - `dotenv` never override variables if they are already set.  

### Making requests to the backend API

For convenience, we have a live API server running at http://frontend.interview.dingi.work/user/login/ for the application to Login the application

## Functionality overview

This is a sample application for Sales of product in different area.

**General functionality:**

- Authenticate users via JWT (login pages + logout button on settings page)
- User Signin
- Dashboard
- Sales Dashboard
- Customer Dashboard
- Item List
- Display data by using [Bar Chart](https://react-google-charts.com/bar-chart) & [Pie Chart](https://react-google-charts.com/pie-chart)

**The general page breakdown looks like this:**

- Sign in pages (URL: #/login )
    - Use JWT (store the token in localStorage)
- Dashboard (URL: #/)
    - Blank Page
- Sales page (URL: #/sales-dashboard )
    - Sales Dashboard
    - Date wise product quantity
    - Month wise product sale
- Customer page (URL: #/customer-dashboard )
    - Customer Dashboard
    - District wise coustomer
    - Area wise coustomer
- Item List page (URL: #/sales-item-list )
    - Sales data list with product list

<br />
