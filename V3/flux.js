const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "flux",
    react: "⭐",
    alias: ["generate", "texttoimage"],
    desc: "Generate an image from text using Flux Schnell AI",
    category: "media",
    filename: __filename,
    use: '<prompt> | <reply/forward text>'
}, async (conn, mek, m, { from, quoted, text, reply }) => {
    // Extraire le prompt pour le forwaded mais flemme 
    const prompt = quoted?.text || text;
    if (!prompt) return reply("❌ *Usage:* `.flux <prompt>` or reply/forward text");

    try {
        reply("🔄 Generating image...");
        
        const apiUrl = `https://api.rynn-archive.biz.id/ai/flux-schnell?text=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        if (!response.data) throw new Error("No image data returned");

        // 'envoyer l'image comme xeon😂
        await conn.sendMessage(
            from,
            { 
                image: response.data, 
                caption: `🎨 *Flux AI* generated this for:\n"${prompt}"`,
                mentions: [m.sender] 
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("[FLUX ERROR]", error);
        reply("❌ Failed to generate image. The API might be down or invalid.");
    }
});

// crazy