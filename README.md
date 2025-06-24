<img src="/public/logo.png" width="60">

# Athenaly
Strava Route Visualization

## About
- Unlock paid features from Strava
- Drawing speed adjustment
- Toggle between satellite and non satellite view
- Mobile, tablet and desktop friendly
- Created using Vue, Vite & Tailwindcss

> [!NOTE]  
> The entire project must be self-hosted for now as Strava [doesn't allow multiple account authorization](https://communityhub.strava.com/developers-api-7/strava-api-multiple-account-authorization-1729) for third-party apps created by its users. Try out the [Demo](https://athenaly.vercel.app/demo) to see how it works !

## Setup
- This project consist of the frontend (Vue) & backend (Express.js server)
- A [Strava App](https://developers.strava.com) & [MongoDB](https://www.mongodb.com/) URI will be required for this to function
- Copy and paste the `CLIENT_ID` & `CLIENT_SECRET` from the Strava App Dashboard into the [backend](/server) index.js file
- `MAIN_URL` refers to the URL hosting the frontend
- `REDIRECT_URL` refers to the URL where the backend is hosted

## License
This project is available as an open source under the terms of the [MIT License](/LICENSE)
