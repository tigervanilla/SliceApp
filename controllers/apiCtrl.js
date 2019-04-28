module.exports={
    showHome:(req,res,next)=>{
        req.db.collection('users').findOne({name:'Jarvis'},(err,doc)=>{
            if(err) throw err
            res.json(doc)
        })
    },

    // This service should take the ticker symbol and should return all the price points in time of that ticker.
    tickerSearch:(req,res,next)=>{
        var ticker=req.params.ticker
        var filter={symbol:ticker}
        var columns={_id:0,open:1,close:1,low:1,high:1}
        req.db.collection('prices').find(filter,{projection:columns}).toArray((err,pricePointsList)=>{
            if(err) throw err
            console.log(`FOUND ${pricePointsList.length} DOCUMENTS`)
            res.send(pricePointsList)
        })
    }
}