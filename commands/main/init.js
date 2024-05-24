const discord = require("discord.js")

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('init')
        .setDescription('initiate'),
    category: 'main',
    async execute(interaction) {
        const client = interaction.client
        await interaction.reply("Please wait")
        try {
            // const user = await interaction.guild.members.fetch({ user: interaction.user.id, withPresences: true }) 
            // console.log(user.presence.status)

            const guild = await interaction.guild.fetch()
            const user = await guild.members.fetch(interaction.member.id)
            console.log(user.user.flags.toArray())

            const db = client.db
            const dbKey = interaction.member.id
            const dbValue = interaction.guild.id
            db.set(dbKey, dbValue)

            interaction.editReply({ content: 'Success!'})
        }
        catch (e) {
            client.log(e, 'error')
            await interaction.editReply({
                content: 'An error occur!',
                embeds: [],
                components: [],
                fetchReply: true
            })
        }
    }
}