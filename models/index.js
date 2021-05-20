const User = require("./user");
const Post = require("./post.js");
const Comment = require("./comment.js");

// Relationships to create foreign key
User.hasMany(Post);
Post.belongsTo(User);
User.hasMany(Comment);
Comment.belonngsTo(User);
Post.hasMany(Comment);
Comment.belongsTo(Post);

module.exports = { User, Post, Comment };
