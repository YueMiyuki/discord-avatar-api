// Web handler

module.exports = {
  request: async function (req, res, client) {
    const Canvas = require("canvas");
    const path = require("path");

    try {
      const db = client.db;
      const guildID = db.get(req.query.userID);

      if (!req.query.userID) {
        res.status(400);
        res.send("400 Bad request");
        return;
      }

      if (!guildID) {
        res.status(404);
        res.send(
          "404 Not found\nYou may use /init command to set guild first!",
        );
        return;
      }

      const guild = await client.guilds.fetch(guildID);
      const uid = req.query.userID;

      const guildMember = await guild.members.fetch(uid, {
        withPresences: true,
      });
      const user = guildMember.user;

      // Force fetched user
      const user_ff = await client.users.fetch(uid, { force: true });

      const canvas = Canvas.createCanvas(740, 259);
      const ctx = canvas.getContext("2d");

      const bgPath = path.resolve(__dirname, "../assets/images/bg.png");
      const background = await Canvas.loadImage(bgPath);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Draw border around the entire canvas
      await require("../canvas/drawBorder").drawBorder(
        client,
        ctx,
        user_ff,
        canvas,
      );
      await require("../canvas/drawAvatar").drawAvatar(client, ctx, user);
      await require("../canvas/drawUser").drawUser(client, ctx, user);
      await require("../canvas/drawPresence").drawPresence(
        client,
        ctx,
        guildMember,
      );

      res.setHeader("Content-Type", "image/png");
      res.send(canvas.toBuffer());
    } catch (e) {
      console.log(e);
      client.log(e, "error");
    }
  },
};
