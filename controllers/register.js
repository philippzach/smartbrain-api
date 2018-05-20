const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    //BackEnd Validation - If Empty
    if (!email || !name || !password) {
        //return so the function stops running
       return res.status(400).json('incorrect from submit');
    }
    var hash = bcrypt.hashSync(password);
    //Just showing how the bcrypt hash function works
    //Asynchronous Way
    /* bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash)
    }); 
    //Database tryout with Variable in server.js
    database.users.push({
        id: '3',
        name: name,
        email: email,
        password: password,
        count: 0,
        joined: new Date()
    })
    //res.json(database.users[database.users.length-1])
    */
   //Changed to
   //1 Update Login Table
   //2 then use Email from Login and Update Users Table 
   //3 Everythign in one Transaction
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email,
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                db('users').returning('*').insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                }).then(responseUser => {
                    res.json(responseUser[0])
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })

        /* Copied Above to sync with Login Table
        db('users').returning('*').insert({
            email: email,
            name: name,
            joined: new Date()
        }).then(responseUser => {
            res.json(responseUser[0])
        })
        */
    .catch(err => {
        //res.status(400).json(err) THIS is Bad because giving potential Attacker info about Database
        res.status(400).json('Could not register, please try again or contact us')
        console.log(err)
    })
}

module.exports = {
    handleRegister: handleRegister
}