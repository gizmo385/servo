const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const ResponseTypes = require('../../lib/response-types.js')

const data = new SlashCommandBuilder()
	.setName("card")
	.setDescription("Load information about a magic card")
	.setContexts([0, 1, 2])
	.addStringOption(option =>
		option
			.setName("name")
			.setDescription("The name of the magic card")
			.setRequired(true))
	.addBooleanOption(option =>
		option
			.setName("image")
			.setDescription("Whether to only fetch the image of the card")
			.setRequired(false))


async function execute(interaction) {
	const card_name = interaction.options.getString("name");
	const only_send_image = interaction.options.getBoolean("image") ?? false;
	const responseClass = only_send_image ? ResponseTypes.ImageResponse : ResponseTypes.TextResponse
	const response = new responseClass(card_name)

	try {
		const embed = await response.embed()
		await interaction.reply({ embeds: [embed]})
	} catch (error) {
		console.log(error)
		await interaction.reply("Error running the search")
	}
}

module.exports = {data, execute}
