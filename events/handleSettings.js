// Settings handler

const { Events, IntegrationApplication } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {

        console.log(interaction)
        if (!interaction.values) return
        if (interaction.values[0] === "hypesquad") {
            require("../base/interactions/hypesquad.js").handler(interaction);
        }

  }}