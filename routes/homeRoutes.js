const router = require("express").Router();
const { User, Comment, Post } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [User],
    });

    res.render("homepage", { posts });
  } catch (err) {
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
