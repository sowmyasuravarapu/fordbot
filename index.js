var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var demo = require('./demo-handler.js')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
    
}))
app.get('/',(req,res)=>{
 res.send("Sample API");
})
app.post('/ask', function(req, res){
 //console.log(req);
 demo.process(req,res);
 
});


app.listen(process.env.PORT || 3000,()=>{
    console.log("Running at 3000");
});