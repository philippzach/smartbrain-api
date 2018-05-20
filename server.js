const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const register =  require('./controllers/register');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'Philipp',
      password : '',
      database : 'smartbrain'
    }
  });

/*
db.select('*').from('users').then(data => {
    console.log(data)
});
*/

const app = express();

app.use(bodyParser.json());
app.use(cors());

/*
const database = {
    users: [
        {
            id: '1',
            name: 'John',
            email: 'email@john.com',
            password: 'cookies',
            count: 0,
            joined: new Date()
        },
        {
            id: '2',
            name: 'Sally',
            email: 'email@sally.com',
            password: 'grapes',
            count: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '123',
            hash: '',
            email: 'email@email.com'
        }

    ]
}
*/

app.get('/', (req, res ) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
        //res.json(data[0])
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            //Simple Error!!! Make sure you always return this
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(data => {
                res.json(data[0])
            })
            .catch(err => res.status(400).json('unable to get user').console.log(err))
        }
        else {
            res.status(400).json('Wrong credentials send')
        }
    })
    .catch(err => res.status(400).json('Wrong credentials'))
    //Just showing how the bcrypt hash function works
    //Asynchronous Way
/*
    bcrypt.compare("1234", '$2a$10$AUQq4EiIibvPM2k8iJfY9ekxBPMzOLWAYZfZVOnHoOLa8Px4JbNBi', function(err, res) {
        // res == true
        console.log('First Try', res)
    });
    bcrypt.compare("veggies", '$2a$10$AUQq4EiIibvPM2k8iJfY9ekxBPMzOLWAYZfZVOnHoOLa8Px4JbNBi', function(err, res) {
        // res = false
        console.log('Second Try', res)
    });
*/
    //
/*    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
*/
})

// Dependecies Injection - into register.js
//Requiere register.js on top
//Module export register.js 
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        //Checking against an empty Array in Javascript
        if (user.length) {
            res.json(user[0])
        }
        else {
            res.status(400).json('Not Found')
        }
        //console.log(user[0])
    }) //If Array is emty Error will not work
    .catch(err => res.status(400).json('Error getting User'))
    //Old Userbase Variable
    /*database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json("not found")
    }
    */    
})

app.put('/image', (req, res) => image.handleImage(req, res, db))
//API CALL
app.post('/imageurl', (req, res) => image.handleApiCall(req, res))


app.listen(3001, () => {
    console.log('Server is Running on Port 3001');
})

/*
/ --> res = this is working
/signin --> POST --> res = success or fail
/register --> POST --> res = user Object
/profile/:userId --> GET = user Object
/image --> PUT --> res = user.count
*/