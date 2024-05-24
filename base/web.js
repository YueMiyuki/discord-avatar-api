module.exports = {
    request: async function (req, res, client) {
        const Canvas = require("canvas")
        const jimp = require("jimp");
        const path = require("path")

        try {
            const db = client.db
            const guildID = db.get(req.query.userID)
            const guild = await client.guilds.fetch(guildID)

            const uid = req.query.userID
            const guildMember = await guild.members.fetch({ user: uid, withPresences: true })

            const user = await guildMember.user

            const avatar = user.avatar
            const presence = guildMember.presence.status
            const state = guildMember.presence.activities[0].state

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

            ctx.shadowColor = '#F0B333';
            ctx.shadowBlur = 13;
            ctx.fillStyle = "#F0B333";
            ctx.beginPath();
            ctx.arc(185, 180, 15, 0, 2 * Math.PI, true);
            ctx.fill()

            res.setHeader('Content-Type', 'image/png');
            res.send(canvas.toBuffer());


        } catch (e) {
            console.log(e)
        }
    }
}
