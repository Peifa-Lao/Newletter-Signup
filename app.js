const express= require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app =express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});


//server pick up the information here
app.post("/",function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us11.api.mailchimp.com/3.0/lists/399b4ae5a5";
  
  //javascript object
  //in http options allow to add method and auth
  const options = {
    method:"POST",
    auth:""
  }
  
  //use node.js https model to send request 
  const request = https.request(url,options,function(response){
    
    //see what response we get after sending request
    if(response.statusCode == 200){
      
      //res to user with success.html
      res.sendFile(__dirname+"/success.html");
    }
    else{
      
      //res to user with failure.html
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })
  
  //pass the json data to mailchimp server
  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is listening on port 3000");
});


