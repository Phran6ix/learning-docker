const router = require("express").Router();
const { protect } = require("../middleware/authMiddle");

const postController = require("../controller/postcontroller");

router.use(protect);

router
  .route("/post")
  .get(postController.getAllPosts)
  .post(postController.createPost);
router
  .route("/post/:id")
  .get(postController.getOnePost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
