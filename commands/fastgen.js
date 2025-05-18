const axios = require("axios");

module.exports = {
  config: {
    name: "fastgen",
    aliases: ["fg", "fastgenerate"],
    version: "2.1",
    author: "Allou Mohamed & ChatGPT",
    countDown: 8,
    role: 0,
    shortDescription: "Fast AI image generation",
    longDescription: "Generate up to 4 fast AI images using a prompt and optional aspect ratio (--ar).",
    category: "ai",
    guide: {
      en: "{pn} <prompt> [--ar 16:9] - quickly generate AI images"
    }
  },

  onStart: async function ({ message, args }) {
    let prompt = args.join(" ").trim();
    if (!prompt) {
      return message.reply("⚠️ | Please provide a prompt.\nExample: /fastgen a futuristic city --ar 1:1");
    }

    // Handle optional aspect ratio
    let aspectRatio = "16:9";
    const match = prompt.match(/--ar\s*(\d+:\d+)/);
    if (match) {
      aspectRatio = match[1];
      prompt = prompt.replace(/--ar\s*\d+:\d+/, "").trim();
    }

    try {
      const imageLinks = [];

      for (let i = 0; i < 4; i++) {
        const res = await axios.get(`https://www.ai4chat.co/api/image/generate?prompt=${encodeURIComponent(prompt)}&aspect_ratio=${encodeURIComponent(aspectRatio)}`);
        if (res.data.image_link) {
          imageLinks.push(res.data.image_link);
        }
      }

      if (!imageLinks.length) {
        return message.reply("❌ | Image generation failed. Try again later.");
      }

      // Notify about success
      await message.reply(`🧠 Prompt: "${prompt}"\n🖼️ Aspect Ratio: ${aspectRatio}\nSending ${imageLinks.length} image(s)...`);

      // Convert image links to stream attachments and send
      const attachments = await Promise.all(
        imageLinks.map(link => global.utils.getStreamFromURL(link))
      );

      await message.reply({
        body: "",
        attachment: attachments
      });

    } catch (err) {
      console.error("[FastGen Error]", err.message);
      return message.reply("❌ | Something went wrong while generating the image.");
    }
  },

  onChat: async function ({ message, args }) {
    return this.onStart({ message, args });
  }
};
