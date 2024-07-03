require("dotenv").config();
const mongoose=require("mongoose");
const User=require("./models/user");
const express=require("express");
const path=require("path");
var methodOverride = require('method-override');
var jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser');
const app=express();

const port=9000;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,"/public")));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

async function main(){
    await mongoose.connect(process.env.MONGO_URI);
}

main()
.then((res)=>{
    console.log("connection succeded!")
}).catch((err)=> console.log(err));

function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/user/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.userId = decoded._id;
        next();
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
}

app.post("/admin/login", async(req,res)=>{
    let {username,password}=req.body;
    let admins= await User.find({
        username:username,
        pass:password,
        admin:true
    })
    const token=jwt.sign({_id: admins[0]._id},process.env.TOKEN_KEY);
    if(admins.length!=0){
        res
        .cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"})
        .redirect(`/admin/${admins[0]._id}`);
    }else{
        res.send("invalid admin");
    }
});

app.get("/admin/login",(req,res)=>{
    res.render("adminLog.ejs")
});

app.post("/user/login",async(req,res)=>{
    let {username,password}=req.body;
    let users= await User.find({
        username:username,
        pass:password
    });
    if(users.length!=0){
        const token=jwt.sign({_id: users[0]._id},process.env.TOKEN_KEY);
        res
        .cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"})
        .redirect(`/user/${users[0]._id}`);
    }else{
        res.send("invalid user")
    }
});

app.get("/user/login",(req,res)=>{
    res.render("userLog.ejs");
});

app.post("/user/signup",async(req,res)=>{
    let {username,password,name,email,skills}= req.body;
    let newUser= new User({
        username:username,
        pass:password,
        name: name,
        email:email,
        skills: skills
    });
    newUser.save()
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err));
    res.send("added user");
});

app.get("/user/signup",(req,res)=>{
    res.render("userSign.ejs");
});

app.get("/user/:id/profile",async(req,res)=>{
    let {id}=req.params;
    let user= await User.findById(id);
    res.render("profile.ejs",{user});
})

app.get("/user/:id",verifyToken,(req,res)=>{
    let {id}=req.params;
    res.render("userHome.ejs",{id});
});

app.get("/admin/:id",verifyToken,(req,res)=>{
    let {id}=req.params;
    res.send('adminHome.ejs',{id});
});

app.get("/check",(req,res)=>{
    let {identity}=req.query;
    if(identity=="user"){
        res.redirect("/user/login");
    }else{
        res.redirect("/admin/login");
    }
});

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.use("*",(req,res)=>{
    res.status(404).send("page not found");
})

app.listen(port,()=>{
    console.log("listening on port",port);
});