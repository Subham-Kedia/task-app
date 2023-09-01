const multer = require("multer")
const httpStatus = require("http-status")
const { BaseError } = require("./errorHandler")

const upload = multer({
  limits: {
    fileSize: 1000000,   // file size
  },
  fileFilter(req, file, cb) {
      if (!file.mimetype.includes("image")) {
        return cb(
          new BaseError(httpStatus.BAD_REQUEST, "Please upload a image")
        )
      }
      return cb(null, true)
  },
})

module.exports = upload 
