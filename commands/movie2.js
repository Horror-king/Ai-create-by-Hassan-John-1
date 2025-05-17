const axios = require("axios");

module.exports = {
  config: {
    name: "movie2",
    aliases: ["movieinfo2", "film2"],
    version: "1.1",
    author: "Hassan",
    countDown: 5,
    role: 0,
    shortDescription: "Get movie information",
    longDescription: "Fetch details such as plot, rating, and poster for a specified movie from OMDB.",
    category: "utility",
    guide: {
      en: "{pn} <movie title> - fetch info about a movie"
    }
  },

  onStart: async function ({ args, message }) {
    try {
      const query = args.join(" ");
      if (!query) {
        return message.reply("🎬 | Please provide a movie title.\nExample: /movie Inception");
      }

      const apiKey = '435fb551';
      const url = `http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`;

      await message.reply("🔍 Searching for movie info...");

      const response = await axios.get(url, { timeout: 10000 });
      const data = response.data;

      if (data.Response === "False") {
        return message.reply(`❌ | No movie found for "${query}". Try another title.`);
      }

      const { Title, Year, Plot, imdbRating, Poster } = data;

      let replyText = `🎬 Movie: ${Title} (${Year})\n⭐ IMDB Rating: ${imdbRating}\n📖 Plot: ${Plot}`;
      if (Poster && Poster !== "N/A") {
        replyText += `\n\n🖼️ Poster: ${Poster}`;
      }

      return message.reply(replyText);

    } catch (error) {
      console.error("[Movie Command Error]", error);

      if (error.code === 'ECONNABORTED') {
        return message.reply("⏳ | OMDB API is taking too long to respond. Please try again later.");
      } else if (error.response?.status === 429) {
        return message.reply("🔄 | Rate limited by OMDB API. Please wait a moment and try again.");
      } else {
        return message.reply("❌ | Failed to fetch movie information. Try a different title.");
      }
    }
  },

  onChat: async function ({ message, args }) {
    return this.onStart({ message, args });
  }
};
