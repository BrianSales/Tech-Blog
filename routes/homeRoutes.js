const router = require("express").Router();
const { User, Comment, Post } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    let posts = await Post.findAll({
      include: [User],
    });

    posts = posts.map((post) =>{
      let value = post.dataValues
      value.user = value.user.dataValues
     
      return value
    })

    console.log(posts)

    res.render("homepage", { posts });
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    let post = await Post.findByPk(req.params.id,{
      // include: [User, Comment]
      include: {all: true, nested: true} 
    });

    

    
      post = post.dataValues
      post.user = post.user.dataValues
      post.user.comments = null
      post.comments = post.comments.map((comment)=>{
        let value = comment.dataValues
        value.user = value.user.dataValues
        return value

      })
      console.log(post)
     
      
    

    

    res.render("postInfo", { post });
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.get("/dashboard", async (req, res) => {
  res.render("dashboard");
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/post/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [User, Comment],
    });

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json(err);
  }

  res.render("blog", { post });
});

module.exports = router;
