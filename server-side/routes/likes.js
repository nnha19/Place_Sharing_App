const route  =require("express").Router({mergeParams :true})
const likesController =require("../controllers/LikesController")

route.post("/",likesController.likePost)
route.delete("/:uid",likesController.unlikePost)

module.exports =route