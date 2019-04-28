var express=require('express')
var router=express.Router()
var apiCtrl=require('./../controllers/apiCtrl')

router.get('/',apiCtrl.showHome)
router.get('/ticker-search/:ticker',apiCtrl.tickerSearch)
router.get('/company-search/:companyName',apiCtrl.companySearch)

module.exports=router