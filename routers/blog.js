const {Router, response} = require('express');
const multer = require('multer')
const router = Router();
const path = require('path');
const BLOG = require('../models/blog');
const COMMENT = require('../models/comment');

const storage = multer.diskStorage({
    destination: function (req,file,cb){
         cb(null,path.resolve(`./public/uploads`))
    },
    filename: function (req,file,cb){
         cb(null, `${Date.now()}-${file.originalname}`)
    },
})
const upload = multer({storage: storage})


router.get('/add-new', (req,res)=>{

    return res.render('addBLog',{
        user: req.user
    })
})

router.get('/:id', async (req,res)=>{

    const blog = await BLOG.findById(req.params.id).populate('createdBy')
    const comment = await COMMENT.find({blogId: req.params.id}).populate('createdBy')
    console.log(comment)
    return res.render('blog',{
        user: req.user,
        blog,
        comment
    })
})

router.post('/', upload.single("coverImage") , async (req,res)=>{

    const {title, body } = req.body;
   const blog =  await BLOG.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageUrl: `/uploads/${req.file.filename}`

    })
    return res.redirect(`/blog/${blog._id}`)
})


router.post('/comment/:blogId', async (req,res)=>{

    const comment = await COMMENT.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })
        return res.redirect(`/blog/${req.params.blogId}`)
})



module.exports = router;