var ImageKit = require("imagekit");
const createId = require("../utils/utils");

var imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.END_POINT_URL,
});

async function uploadImage(file) {
  const result = await imagekit.upload({
    file,
    fileName: createId(),
    folder: "Kodr_Images",
  });
  return result;
}

module.exports = uploadImage;
