const {Router, response} = require('express');
const USER = require('../models/user')
const router = Router();



router.get('/signin', (req,res)=>{
    return res.render('signin');
})

router.get('/signup', (req,res)=>{
    return res.render('signup');
})

router.post('/signin', async (req,res)=>{
    const {email , password } = req.body;

    try
    {
        const token = await USER.matchPasswordAndGenerateToken(email, password);
        return res.cookie('token',token).redirect('/')

    }catch(error)
    {
        return res.status(401).render('signin',{error: "Incorrect Email or Password"})
    }
    
       
    
})

router.post('/signup', async (req,res)=>{

    const {fullName, email , password } = req.body;

    console
    .log(fullName,email, password)
    await USER.create({

        fullName,
        email,
        password
    })

    return res.redirect("/")
})



router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/')
})


module.exports = router