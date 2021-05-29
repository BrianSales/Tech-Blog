const router = require("express").Router();
const { User, Comment, Post } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    let posts = await Post.findAll({
      include: [User],
      raw: true,
      nest: true,
    });
    res.render("homepage", { posts, user_id: req.session.user_id });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get("/create", async (req, res) => {
  if (req.session.logged_in) {
    res.render("createPost", { user_id: req.session.user_id });
  } else {
    res.render("login");
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    let post = await Post.findByPk(req.params.id, {
      // include: [User, Comment]
      include: { all: true, nested: true },
    });

    post = post.dataValues;
    post.user = post.user.dataValues;
    post.user.comments = null;
    post.comments = post.comments.map((comment) => {
      let value = comment.dataValues;
      value.user = value.user.dataValues;
      return value;
    });

    res.render("postInfo", { post, user_id: req.session.user_id });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});
router.get("/post/details/:id", async (req, res) => {
  try {
    let post = await Post.findOne({
      include: [{ all: true }],
      raw: true,
      nest: true,
      where: {
        id: req.params.id,
      },
    });
    console.log("FOUND POST", post.comments);

    // post = post.dataValues;
    // post.user = post.user.dataValues;
    // post.user.comments = null;
    // post.comments = post.comments.map((comment) => {
    //   let value = comment.dataValues;
    //   value.user = value.user.dataValues;
    //   return value;
    // });

    res.render("postInfoWithComments", { post, user_id: req.session.user_id });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get("/dashboard", async (req, res) => {
  if (req.session.logged_in) {
    console.log("User ID: ", req.session.user_id);
    // Grab all the posts for this user
    let posts = await Post.findAll({
      include: [User],
      raw: true,
      nest: true,
      where: {
        user_id: req.session.user_id,
      },
    });
    console.log("Posts", posts);

    res.render("dashboard", { posts, user_id: req.session.user_id });
  } else {
    res.render("login");
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login", { user_id: req.session.user_id });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
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

  res.render("blog", { post, user_id: req.session.user_id });
});

module.exports = router;
