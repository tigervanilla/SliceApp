module.exports = {
    clientApiKeyValidation: (req, res, next) => {
        let clientApiKey = req.get('apiKey')
        if (!clientApiKey) {
            return res.status(400).send({
                status: false,
                response: 'Missing Api Key'
            })
        } else {
            req.db.collection('users').findOne({
                'apiKey': clientApiKey
            }, (err, doc) => {
                if (err) throw err
                if (doc) {
                    next()
                } else {
                    return res.status(400).send({
                        status: false,
                        response: 'Invalid Api Key'
                    })
                }
            })
        }
    }
}