const multer =require("multer")

const fileExtention ={
  "image/png" :".png",
  "image/jpeg" :".jpeg",
}

const storage =multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imgs')
      },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + fileExtention[file.mimetype])
      }
})
const upload =multer({storage})

module.exports =upload
