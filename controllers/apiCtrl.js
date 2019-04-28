module.exports = {
    showHome: (req, res, next) => {
        req.db.collection('users').findOne({
            name: 'Jarvis'
        }, (err, doc) => {
            if (err) throw err
            res.json(doc)
        })
    },

    // This service should take the ticker symbol and should return all the price points in time of that ticker.
    tickerSearch: (req, res, next) => {
        var ticker = req.params.ticker
        var filter = {
            symbol: ticker
        }
        var columns = {
            _id: 0,
            date: 1,
            open: 1,
            close: 1,
            low: 1,
            high: 1
        }
        req.db.collection('prices').find(filter, {
            projection: columns
        }).toArray((err, pricePointsList) => {
            if (err) throw err
            console.log(`FOUND ${pricePointsList.length} DOCUMENTS`)
            res.send(pricePointsList)
        })
    },

    // This service should take a company name and returns all the price points of that company over the entire duration.
    companySearch: (req, res, next) => {
        var companyName = req.params.companyName
        console.log(companyName)
        req.db.collection('stocks').aggregate([{
                $match: {
                    Name: companyName
                }
            },
            {
                $lookup: {
                    from: "prices",
                    localField: "Symbol",
                    foreignField: "symbol",
                    as: "price_points"
                }
            },
            {
                $project: {
                    Symbol: 1,
                    Name: 1,
                    price_points: {
                        date: 1,
                        open: 1,
                        close: 1,
                        low: 1,
                        high: 1
                    }
                }
            }
        ]).toArray((err, docs) => {
            if (err) throw err
            // console.log(docs)
            res.send(docs[0])
        })
    },

    // This service should accept two parameters, “any number of stock tickers in a list” and “two dates”. This will return all the highs, lows and closes of these stocks in the desired time frame.
    stocksInTime: (req, res, next) => {
        console.log(req.body)
        var startDate = req.body.startDate
        var endDate = req.body.endDate
        var tickerList = req.body.tickerList
        var filter = {
            'date': {
                $gte: startDate
            },
            'date': {
                $lte: endDate
            },
            'symbol': {
                $in: tickerList
            }
        }
        req.db.collection('prices').find(filter, {
            projection: {
                _id: 0,
                volume: 0
            }
        }).sort({
            'symbol': 1
        }).toArray((err, docs) => {
            if (err) throw err
            console.log(`FOUND ${docs.length} DOCUMENTS`)
            res.send(docs)
        })
    },

    // This service should take two dates as input and should return 10 best performing and 10 least performing stocks in that time frame.
    timeFrame: (req, res, next) => {
        var startDate = req.params.startDate
        var endDate = req.params.endDate
        req.db.collection('prices').aggregate([{
                $match: {
                    date: {
                        $gte: startDate
                    },
                    date: {
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$symbol",
                    fluctuation: {
                        $avg: {
                            $subtract: ["$open", "$close"]
                        }
                    }
                }
            },
            {
                $sort: {
                    fluctuation: -1
                }
            }
        ]).toArray((err, docs) => {
            if (err) throw err
            var bestPerforming = docs.slice(0, 10)
            var worstPerforming = docs.slice(docs.length - 10)
            res.json({
                'bestPerforming': bestPerforming,
                'worstPerforming': worstPerforming
            })
        })
    }
}