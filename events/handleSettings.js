// Settings handler

const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.values) return;
    if (interaction.values[0] === "hypesquad") {
      require("../base/interactions/hypesquad.js").handler(interaction);
    }
    if (interaction.values[0] === "font") {
      require("../base/interactions/font.js").handler(interaction);
    }
    if (interaction.values[0] === "presence") {
      require("../base/interactions/presence.js").handler(interaction);
    }
    if (interaction.values[0] === "username") {
      require("../base/interactions/username.js").handler(interaction);
    }
    if (interaction.values[0] === "banner") {
      require("../base/interactions/banner.js").handler(interaction);
    }
    if (interaction.values[0] === "online") {
      require("../base/interactions/online.js").handler(interaction);
    }
  },
};
