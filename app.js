require('dotenv').config()
const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const UserRoute = require('./routers/user')
const {connectionMongodb} = require('./connectionDB')
const cookiePaser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authentication');
const blogRouter = require('./routers/blog');


const Blog = require('./models/blog')

const app = express();
// for deploy
const port = process.env.PORT || 3106;

console.log(process.env.name)

app.use(express.urlencoded({extended: false}))
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))
 

connectionMongodb(process.env.MONGO_URL).then(()=>console.log("Mongo Connected"));



app.set("view engine", "ejs")
app.set("views", path.resolve("./views"));





app.get('/', async (req,res)=>{
    const allBlogs = await Blog.find({})
    return res.render("home",{
        user : req.user,
        blogs: allBlogs
    })
})

app.use('/user',UserRoute),
app.use('/blog', blogRouter)






app.listen(port,()=>console.log("server start"))