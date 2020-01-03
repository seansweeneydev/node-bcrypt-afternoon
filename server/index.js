require('dotenv').config()
const express = require('express')
      session = require('express-session')
      massive = require('massive')
      authCtrl = require('./controllers/authController')
      treasureCtrl = require('./controllers/treasureController')
      auth = require('./middleware/authMiddleware')
const PORT = 4010
const {CONNECTION_STRING, SESSION_SECRET} = process.env

const app = express()

app.use(express.json())
app.use(
    session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false
    })
)

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)


massive(CONNECTION_STRING).then(db => {
    app.set('db', db)})

app.listen(PORT, () => console.log(`Server listening on port:${PORT}`));