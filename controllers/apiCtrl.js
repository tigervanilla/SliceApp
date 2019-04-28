module.exports={
    showHome:(req,res,next)=>{
        req.db.collection('users').findOne({name:'Jarvis'},(err,doc)=>{
            if(err) throw err
            res.json(doc)
        })
    }
}