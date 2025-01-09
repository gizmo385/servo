const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const ResponseTypes = require('../../lib/response-types.js')

const data = new SlashCommandBuilder()
	.setName("card")
	.setDescription("Load information about a magic card")
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


function makeEmbed(response) {
	let parts = response.body.split('\n');
	const embedTitle = parts.shift();

	return {
		title: `${embedTitle}`,
		description: parts.join('\n'),
		url: response.headers['x-scryfall-card'],
		thumbnail: {
			url: response.headers['x-scryfall-card-image']
		}
	};
}

async function execute(interaction) {
	const card_name = interaction.options.getString("name");
	const only_send_image = interaction.options.getBoolean("image") ?? false;
	console.log(only_send_image)
	let response
	if(only_send_image) {
		response = new ResponseTypes.ImageResponse(card_name)
	}
	else { 
		response = new ResponseTypes.TextResponse(card_name)
	}
	const embed = await response.embed()
	interaction.reply({ embeds: [embed]})
}

module.exports = {data, execute}
