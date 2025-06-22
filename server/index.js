const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require('cookie-parser')
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
const db = require('monk')('MONGODB_URI')
const CLIENT_ID = ""
const CLIENT_SECRET = ""
const REDIRECT_URL = ""
const MAIN_URL = ""
const refreshToken = db.get('refresh-token')

app.get("/", async (req,res) => res.send("Hello World"))

app.get("/callback", async (req,res) => { 
    var data;
    const code = req.query.code
    if(!code) return res.send("Unauthorize")
    try {
    const auth = (await axios.post(`https://www.strava.com/api/v3/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&grant_type=authorization_code`)).data
    await refreshToken.insert({ refreshToken: auth.refresh_token, accessToken: auth.access_token })
    res.redirect(`https://${MAIN_URL}/activity?accessToken=${auth.access_token}`)
    }catch(e) {
       res.redirect(`https://www.strava.com/oauth/mobile/authorize?client_id=${CLIENT_ID}&response_type=code&approval_prompt=auto&scope=read,activity:read,activity:read_all,read_all,profile:read_all&redirect_uri=${REDIRECT_URL}`)
    }
})

app.get("/data", async (req,res) => { 
    var data;
    const query = req.query.accessToken
    if(!query) return res.send("Unauthorize")
    var database = await refreshToken.findOne({ accessToken: query })
    try {
    data = (await axios('https://www.strava.com/api/v3/athlete/activitie?per_page=15', {
      headers: {
        authorization: `Bearer ${database.accessToken}`,
        accept: 'application/json'
      }
    })).data
    res.send(data)
    }catch(e) {
        const auth = (await axios.post(`https://www.strava.com/api/v3/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&refresh_token=${database.refreshToken}&grant_type=refresh_token`)).data
        refreshToken.remove({ accessToken: query }).then(async () => {
        await refreshToken.insert({ refreshToken: auth.refresh_token, accessToken: auth.access_token })
        })
        data = (await axios('https://www.strava.com/api/v3/athlete/activities?per_page=15', {
            headers: {
            authorization: `Bearer ${auth.access_token}`,
            accept: 'application/json'
        }
        })).data
        res.send(data)
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
