module.exports = {
  WebPToJPG: async function (uid, userAvatar) {
    const axios = require("axios");
    const sharp = require("sharp");
    const avatarURL = `https://cdn.discordapp.com/avatars/${uid}/${userAvatar}.webp`;

    try {
      // Fetch the WebP image from the URL
      const response = await axios.get(avatarURL, {
        responseType: "arraybuffer",
      });
      const webpBuffer = Buffer.from(response.data, "binary");

      // Convert the WebP image to JPEG using sharp
      const jpegBuffer = await sharp(webpBuffer)
        .jpeg({
          quality: 100, // Set quality to 100
          mozjpeg: true, // Use Mozilla JPEG encoder
          chromaSubsampling: "4:4:4", // Disable chroma subsampling for better color quality
        })
        .toBuffer();

      return jpegBuffer;
    } catch (error) {
      console.error("Error fetching and converting image:", error);
      throw error;
    }
  },
};
