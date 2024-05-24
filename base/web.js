module.exports = {
    request: async function (req, res, client) {
        const Canvas = require("canvas")
        const jimp = require("jimp");
        const path = require("path")

        try {
            const uid = req.query.userID
            const user = await client.users.fetch(uid, {withPresences: true})
            console.log(user)

            const avatar = user.avatar

            const canvas = Canvas.createCanvas(740, 259)
            const ctx = canvas.getContext('2d')

            const avatarJPG = await client.w2j(uid, avatar)
            const font = 'Seto';

            const bgPath = path.resolve(__dirname, '../assets/images/bg.png');
            const background = await Canvas.loadImage(bgPath);

            const mask = path.resolve(__dirname, '../assets/images/mask.png');

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            const image = await jimp.read(avatarJPG);
            const resizeAvatar = image.resize(512, 512);

            const maskImage = await jimp.read(mask);
            const newAvatar = resizeAvatar.mask(maskImage, 0, 0)

            const raw = await newAvatar.getBufferAsync("image/png");
            
            let name = user.globalName;
            let username = user.username;

            const profile = await Canvas.loadImage(raw);

            ctx.drawImage(profile, 44, 48, 155, 155);
            ctx.font = `bold 20px ${font}`;
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "start";
            ctx.strokeStyle = "#f5f5f5";

            ctx.font = `bold 50px ${font}`;
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "start";
            ctx.strokeStyle = "#f5f5f5";
            ctx.fillText(`${name}`, 240, 90);

            ctx.font = `bold 20px ${font}`;
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "start";
            ctx.strokeStyle = "#f5f5f5";
            ctx.fillText(`${username}`, 245, 120);

            res.setHeader('Content-Type', 'image/png');
            res.send(canvas.toBuffer());


        } catch (e) {
            console.log(e)
        }
    }
}
