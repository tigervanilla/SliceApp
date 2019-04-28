var express=require('express')
var router=express.Router()
var apiCtrl=require('./../controllers/apiCtrl')

router.get('/',apiCtrl.showHome)
router.get('/ticker-search/:ticker',apiCtrl.tickerSearch)

module.exports=router