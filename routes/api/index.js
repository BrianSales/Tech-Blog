const router = require("express").Router();
const userRoutes = require("./userRoutes");
const recipeRoutes = require("./postRoutes");

router.use("/users", userRoutes);
router.use("/posts", recipeRoutes);

module.exports = router;
