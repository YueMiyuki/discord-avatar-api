// Draws the presence of the user on the canvas.

module.exports = {
  drawPresence: async function (client, ctx, guildMember) {
    const db = client.db;
    let presence = "offline";
    const font = "Seto";
    const maxLength = 15;
    const maxLines = 2;
    let lines = [];

    if (guildMember.presence) {
      presence = guildMember.presence.status;
    }

    const presenceEnabled = await db.get("presence_enable_" + guildMember.id);
    if (!presenceEnabled) return;

    let state;
    const presenceSettings = await db.get("presence_" + guildMember.id);
    if (presenceSettings === "Default") {
      if (guildMember.presence.activities.length !== 0) {
        state = await guildMember.presence.activities[0].state;
      } else {
        state = "No status";
      }
    } else if (presenceSettings !== "Default") {
      state = await presenceSettings;
    }
    
    while (state.length > 0) {
      if (state.length > maxLength) {
        let splitPos = state.lastIndexOf(" ", maxLength);
        if (splitPos === -1 || splitPos > maxLength) {
          splitPos = maxLength;
        }
        lines.push(state.substring(0, splitPos).trim());
        state = state.substring(splitPos).trim();

        // If we have reached the maximum number of lines, add "..." and break
        if (lines.length === maxLines) {
          if (state.length > 0) {
            lines[maxLines - 1] =
              lines[maxLines - 1].substring(0, maxLength - 3) + "...";
          }
          break;
        }
      } else {
        lines.push(state);
        break;
      }
    }

    ctx.font = `bold 20px ${font}`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "start";
    ctx.strokeStyle = "#f5f5f5";

    // Ensure at least one line is added if the state is empty or fits within maxLength
    if (lines.length === 0) {
      lines.push(state);
    }
    lines.forEach((line, index) => {
      ctx.fillText(line, 245, 155 + index * 25); // Adjust the Y-coordinate for each line
    });

    if (presence === "idle") {
      ctx.shadowColor = "#F0B333";
      ctx.shadowBlur = 13;
      ctx.fillStyle = "#F0B333";
      ctx.beginPath();
      ctx.arc(185, 180, 15, 0, 2 * Math.PI, true);
      ctx.fill();
    }
    if (presence === "online") {
      ctx.shadowColor = "#22a45a";
      ctx.shadowBlur = 13;
      ctx.fillStyle = "#22a45a";
      ctx.beginPath();
      ctx.arc(185, 180, 15, 0, 2 * Math.PI, true);
      ctx.fill();
    }
    if (presence === "dnd") {
      ctx.shadowColor = "#f33f42";
      ctx.shadowBlur = 13;
      ctx.fillStyle = "#f33f42";
      ctx.beginPath();
      ctx.arc(185, 180, 15, 0, 2 * Math.PI, true);
      ctx.fill();
    }
    if (presence === "offline") {
      ctx.shadowColor = "#81858e";
      ctx.shadowBlur = 13;
      ctx.fillStyle = "#81858e";
      ctx.beginPath();
      ctx.arc(185, 180, 15, 0, 2 * Math.PI, true);
      ctx.fill();
    }
  },
};
