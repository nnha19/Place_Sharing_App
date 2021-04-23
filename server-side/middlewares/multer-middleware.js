const multer =require("multer")
const storage =multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imgs')
      },
    filename: function (req, file, cb) {
        cb(null,  '-' + Date.now()+file.fieldname)
      }
})
const upload =multer({storage})

module.exports =upload
