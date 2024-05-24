const e = require("express");

module.exports = {
    request: async function (req, res, client) {
        const Canvas = require("canvas");
        const jimp = require("jimp");
        const path = require("path");

        function colorToHexString(dColor) {
            return '#' + ("000000" + (((dColor & 0xFF) << 16) + (dColor & 0xFF00) + ((dColor >> 16) & 0xFF)).toString(16)).slice(-6);
        }

        try {
            if (!req.query.userID) {
                res.status(400)
                res.send("400 Bad request")
                return;
            }
            const db = client.db
            const guildID = db.get(req.query.userID)

            if (!guildID) {
                res.status(404)
                res.send("404 Not found\nYou may use /init command to set guild first!")
                return;
            }
            const guild = await client.guilds.fetch(guildID)

            const uid = req.query.userID
            const guildMember = await guild.members.fetch(uid, { withPresences: true })

            const user = guildMember.user
            // console.log(guildMember)

            const user_ff = await client.users.fetch(uid, { force: true })
            const acolor = await colorToHexString(user_ff.accentColor)
            console.log(acolor)

            let presence = "offline"
            let state = "No status"
            const avatar = user.avatar
            if (guildMember.presence) {
                presence = guildMember.presence.status
                state = guildMember.presence.activities[0].state
            }

            let hypesquadA = null
            let hypesquad;
            if (user.flags.toArray()) {
                hypesquadA = user.flags.toArray()[0]
                if (hypesquadA === "HypeSquadOnlineHouse2") {
                    hypesquad = "brilliance.png"
                } else if (hypesquadA === "HypeSquadOnlineHouse3") {
                    hypesquad = "balance.png"
                } else if (hypesquadA === "HypeSquadOnlineHouse1") { hypesquad === "bravery.png" }
            }


            const maxLength = 15;
            const maxLines = 2;
            let lines = [];

            // Split the text into lines
            while (state.length > 0) {
                if (state.length > maxLength) {
                    let splitPos = state.lastIndexOf(' ', maxLength);
                    if (splitPos === -1 || splitPos > maxLength) {
                        splitPos = maxLength;
                    }
                    lines.push(state.substring(0, splitPos).trim());
                    state = state.substring(splitPos).trim();

                    // If we have reached the maximum number of lines, add "..." and break
                    if (lines.length === maxLines) {
                        if (state.length > 0) {
                            lines[maxLines - 1] = lines[maxLines - 1].substring(0, maxLength - 3) + '...';
                        }
                        break;
                    }
                } else {
                    lines.push(state);
                    break;
                }
            }

            // Ensure at least one line is added if the state is empty or fits within maxLength
            if (lines.length === 0) {
                lines.push(state);
            }

            const canvas = Canvas.createCanvas(740, 259)
            const ctx = canvas.getContext('2d')

            const avatarJPG = await client.w2j(uid, avatar)
            const font = 'Seto';

            const bgPath = path.resolve(__dirname, '../assets/images/bg.png');
            const background = await Canvas.loadImage(bgPath);

            const mask = path.resolve(__dirname, '../assets/images/mask.png');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            // Draw border around the entire canvas
            const borderWidth = 5; // Example border width, adjust as needed
            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = 'red'; // Example border color, adjust as needed

            // Draw the border around the entire canvas
            ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);

            const image = await jimp.read(avatarJPG);
            const resizeAvatar = image.resize(512, 512);

            const maskImage = await jimp.read(mask);
            const newAvatar = resizeAvatar.mask(maskImage, 0, 0)

            const raw = await newAvatar.getBufferAsync("image/png");

            let name = user.globalName;
            let username = user.username;

            const profile = await Canvas.loadImage(raw);

            ctx.drawImage(profile, 44, 48, 155, 155);

            ctx.font = `bold 50px ${font}`;
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "start";
            ctx.strokeStyle = "#f5f5f5";
            ctx.fillText(`${name}`, 240, 90);

            ctx.font = `bold 20px ${font}`;
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "start";
            ctx.strokeStyle = "#f5f5f5";
            ctx.fillText(`${username}`, 245, 118);

            ctx.font = `bold 20px ${font}`;
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "start";
            ctx.strokeStyle = "#f5f5f5";

            const hypesquadImgDir = path.resolve(__dirname, '../assets/images/', `${hypesquad}`)
            const hypesquadImg = await jimp.read(hypesquadImgDir)
            const resizeHypesquad = hypesquadImg.resize(48, 48)

            const hypesquadImgRaw = await resizeHypesquad.getBufferAsync("image/png")

            const hypesquadBadge = await Canvas.loadImage(hypesquadImgRaw)
            ctx.drawImage(hypesquadBadge, 365, 55, 32, 32)

            // Draw each line of the state text
            lines.forEach((line, index) => {
                ctx.fillText(line, 245, 155 + index * 25); // Adjust the Y-coordinate for each line
            });

            if (presence === "idle") {
                ctx.shadowColor = '#F0B333';
                ctx.shadowBlur = 13;
                ctx.fillStyle = "#F0B333";
                ctx.beginPath();
                ctx.arc(185, 180, 15, 0, 2 * Math.PI, true);
                ctx.fill()
            }
            if (presence === "online") {
                ctx.shadowColor = '#22a45a';
                ctx.shadowBlur = 13;
                ctx.fillStyle = "#22a45a";
                ctx.beginPath();
                ctx.arc(185, 180, 15, 0, 2 * Math.PI, true);
                ctx.fill()
            }
            if (presence === "dnd") {
                ctx.shadowColor = '#f33f42';
                ctx.shadowBlur = 13;
                ctx.fillStyle = "#f33f42";
                ctx.beginPath();
                ctx.arc(185, 180, 15, 0, 2 * Math.PI, true);
                ctx.fill()
            }
            if (presence === "offline") {
                ctx.shadowColor = '#81858e';
                ctx.shadowBlur = 13;
                ctx.fillStyle = "#81858e";
                ctx.beginPath();
                ctx.arc(185, 180, 15, 0, 2 * Math.PI, true);
                ctx.fill()
            }

            res.setHeader('Content-Type', 'image/png');
            res.send(canvas.toBuffer());

        } catch (e) {
            console.log(e)
        }
    }
}