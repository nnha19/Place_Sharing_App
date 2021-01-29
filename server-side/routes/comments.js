const router =require("express").Router({mergeParams :true })

const commentsController =require("../controllers/commentsController")

router.post("/",commentsController.createComments)
router.put("/:cid",commentsController.editComment)
router.delete("/:cid",commentsController.deleteComment)

module.exports =router