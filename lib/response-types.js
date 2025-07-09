const axios = require('axios')
const Discord = require('discord.js');
const Url = require('urijs');

SCRYFALL_URL = 'https://api.scryfall.com/cards/named';
SCRYFALL_SEARCH_URL = 'https://api.scryfall.com/cards/search';

class TextResponse {
	constructor(cardName) {
		this.cardName = cardName;
	}

	async makeRequest() {
		const queryArgs = {
			fuzzy: this.cardName,
			format: 'text',
			utm_source: "discord",
		};
		const url = Url(SCRYFALL_URL).query(queryArgs).toString();
		const validateStatus = status => (status >= 200 && status < 300 || status == 404)
		return await axios.get(url, { validateStatus })
	}

	makeEmbed(response) {
		let parts = response.data.split('\n');
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

	async embed() {
		const response = await this.makeRequest()
		if (response.status == 404) {
			return {
				title: "Ambiguous Request",
				description: "Too many cards match that search. Please refine it!"
			}
		} else {
			return this.makeEmbed(response);
		}
	}
}


class ImageResponse extends TextResponse {
	makeEmbed(response) {
		let parts = response.data.split('\n');
		return {
			title: parts[0].match(/^([^{]+)/)[0].trim(),
			url: response.headers['x-scryfall-card'],
			image: {
				url: response.headers['x-scryfall-card-image']
			}
		};
	}
}


class SearchResponse {
	constructor(query, limit = 5) {
		this.query = query;
		this.limit = limit;
	}

	async makeRequest() {
		const queryArgs = {
			q: this.query,
			order: 'name',
			dir: 'asc',
			page: 1,
			utm_source: "discord",
		};
		const url = Url(SCRYFALL_SEARCH_URL).query(queryArgs).toString();
		const validateStatus = status => (status >= 200 && status < 300 || status == 404 || status == 400)
		return await axios.get(url, { validateStatus })
	}

	makeEmbed(response) {
		if (response.status == 404) {
			return {
				title: "No Results",
				description: "No cards found matching your search query.",
				color: 0xff0000
			};
		}

		if (response.status == 400) {
			return {
				title: "Invalid Search",
				description: "Your search query contains invalid syntax. Please check the Scryfall search reference.",
				color: 0xff0000
			};
		}

		const data = response.data;
		const cards = data.data.slice(0, this.limit);
		const totalCards = data.total_cards;

		let description = `Found ${totalCards} card${totalCards !== 1 ? 's' : ''}`;
		if (totalCards > this.limit) {
			description += ` (showing first ${this.limit})`;
		}
		description += ':\n\n';

		cards.forEach((card, index) => {
			const name = card.name;
			const manaCost = card.mana_cost || '';
			const typeLine = card.type_line;
			const setCode = card.set.toUpperCase();
			
			description += `**${index + 1}.** [${name}](${card.scryfall_uri}) ${manaCost}\n`;
			description += `${typeLine} • ${setCode}\n\n`;
		});

		if (totalCards > this.limit) {
			description += `*Use a more specific search to see fewer results*`;
		}

		const embed = {
			title: `Search Results: "${this.query}"`,
			description: description,
			color: 0x0099ff,
			footer: {
				text: `Powered by Scryfall`
			}
		};

		// Add the first card's image if available
		if (cards.length > 0 && cards[0].image_uris && cards[0].image_uris.normal) {
			embed.image = {
				url: cards[0].image_uris.normal
			};
		}

		return embed;
	}

	async embed() {
		const response = await this.makeRequest()
		return this.makeEmbed(response);
	}

	async embeds() {
		const response = await this.makeRequest()
		
		if (response.status == 404) {
			return [{
				title: "No Results",
				description: "No cards found matching your search query.",
				color: 0xff0000
			}];
		}

		if (response.status == 400) {
			return [{
				title: "Invalid Search",
				description: "Your search query contains invalid syntax. Please check the Scryfall search reference.",
				color: 0xff0000
			}];
		}

		const data = response.data;
		const cards = data.data.slice(0, this.limit);
		const totalCards = data.total_cards;

		let description = `Found ${totalCards} card${totalCards !== 1 ? 's' : ''}`;
		if (totalCards > this.limit) {
			description += ` (showing first ${this.limit})`;
		}
		description += ':\n\n';

		cards.forEach((card, index) => {
			const name = card.name;
			const manaCost = card.mana_cost || '';
			const typeLine = card.type_line;
			const setCode = card.set.toUpperCase();
			
			description += `**${index + 1}.** [${name}](${card.scryfall_uri}) ${manaCost}\n`;
			description += `${typeLine} • ${setCode}\n\n`;
		});

		if (totalCards > this.limit) {
			description += `*Use a more specific search to see fewer results*`;
		}

		const embeds = [];

		// First embed with text summary
		const summaryEmbed = {
			title: `Search Results: "${this.query}"`,
			description: description,
			color: 0x0099ff,
			footer: {
				text: `Powered by Scryfall`
			}
		};
		embeds.push(summaryEmbed);

		// Additional embeds for card images
		cards.forEach((card, index) => {
			if (card.image_uris && card.image_uris.normal) {
				const imageEmbed = {
					title: card.name,
					url: card.scryfall_uri,
					image: {
						url: card.image_uris.normal
					},
					color: 0x0099ff
				};
				embeds.push(imageEmbed);
			}
		});

		return embeds;
	}
}

module.exports = { TextResponse, ImageResponse, SearchResponse };
