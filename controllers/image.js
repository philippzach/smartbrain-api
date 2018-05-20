const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'b79c7223ba4940b583ddce4661445a7f'
   });

const handleApiCall =  (req, res) => {
app.models
    .predict(Clarifai.DEMOGRAPHICS_MODEL, req.body.input)
    .then(data => response.json(data))
    .catch(err => res.status(400).json('Unabel to work with API'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(count => res.json(count))
    .catch(err => res.status(400).json('Unable to get Count'))
    /*
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.count++;
            return res.json(user.count);
        }
    })
    if (!found) {
        res.status(400).json("not found")
    }
    */
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}