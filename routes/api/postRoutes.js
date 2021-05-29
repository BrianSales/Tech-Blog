const router = require("express").Router();
const { Comment, User, Post } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
  try {
    const Posts = await Post.findAll({
      include: [User],
    });

    res.status(200).json(Posts);
  } catch (err) {
    res.status(400).json(err);
  }
}),
  router.get("/byUser", async (req, res) => {
    try {
      const Posts = await Post.findAll(
        {
          include: [User],
        },
        {
          where: { id: req.session.user_id },
        }
      );

      res.status(200).json(Posts);
    } catch (err) {
      res.status(400).json(err);
    }
  }),
  router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id, {
        include: [User],
      });

      res.status(200).json(Posts);
    } catch (err) {
      res.status(400).json(err);
    }
  });
router.post("/", async (req, res) => {
  console.log("we hit the route :)");
  try {
    const newPost = await Post.create({
      title: req.body.title,
      body: req.body.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log("error: ", err);
    res.status(400).json(err);
  }
});
router.put("/:id", async (req, res) => {
  console.log("we hit the route :)");
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        body: req.body.body,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log("error: ", err);
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const PostData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!PostData) {
      res.status(404).json({ message: "No Post found with this id!" });
      return;
    }

    res.status(200).json(PostData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/comment/:id", async (req, res) => {
  console.log("we hit the route :)");
  if (!req.session.user_id) {
    res.status(401).json({ message: "You must login to comment!" });
  }
  try {
    const newComment = await Comment.create({
      body: req.body.body,
      user_id: req.session.user_id,
      post_id: req.params.id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    console.log("error: ", err);
    res.status(400).json(err);
  }
});

module.exports = router;
