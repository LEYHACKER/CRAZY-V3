/* by crazy dev
📥 dev fulstack
🏀 basket player 
❤️ i lovve my girl Friend
*/

const axios = require('axios');
const { cmd } = require('../command');

const nsfwMap = new Map([
  ['1', { label: '💦 Blowjob', url: 'https://api.waifu.pics/nsfw/blowjob' }],
  ['2', { label: '💋 Waifu', url: 'https://api.waifu.pics/nsfw/waifu' }],
  ['3', { label: '🏳️‍⚧️ Trap', url: 'https://api.waifu.pics/nsfw/trap' }],
  ['4', { label: '😼 Neko', url: 'https://api.waifu.pics/nsfw/neko' }],
  ['5', { label: '🍑 Pussy', url: 'https://api.waifu.pics/nsfw/pussy' }],
  ['6', { label: '📚 Hentai', url: 'https://api.waifu.pics/nsfw/hentai' }],
  ['7', { label: '🎀 Boobs', url: 'https://api.waifu.pics/nsfw/boobs' }],
  ['8', { label: '👓 Glasses', url: 'https://api.waifu.pics/nsfw/glasses' }],
  ['9', { label: '🎓 Uniform', url: 'https://api.waifu.pics/nsfw/uniform' }],
]);

const crazyImageUrl = 'https://files.catbox.moe/t5ej8e.jpg';

cmd({
  pattern: 'nsfwmenu',
  react: "🔞",
  desc: '🔞 Interactive NSFW menu (choose by number)',
  category: 'nsfw',
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const menuText = `━〔 *CRAZY-V3🕹️* 〕━━┈⊷  
┃◈╭─────────────·๏  
┃◈┃📸 *NSFW MENU* 🔞  
┃◈┃╭───❖  
┃◈┃│ 1. 💦  \`Blowjob\`  
┃◈┃│ 2. 💋 \`Waifu\`  
┃◈┃│ 3. 🏳️‍⚧️ \`Trap\`  
┃◈┃│ 4. 😼 \`Neko\`  
┃◈┃│ 5. 🍑 \`Pussy\`  
┃◈┃│ 6. 📚 \`Hentai\`  
┃◈┃│ 7. 🎀 \`Boobs\`  
┃◈┃│ 8. 👓 \`Glasses\`  
┃◈┃│ 9. 🎓 \`Uniform\`  
┃◈┃╰───❖  
┃◈┃Nsfw By Crazy Dev
┃◈┃• *Version*: 3.0.0 Beta  
┃◈└───────────┈⊷  
╰──────────────┈⊷  

➡️ Reply with a *number (1 to 9)* to get an image.`;

  const contextInfo = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363400129137847@newsletter',
      newsletterName: 'CRAZY TECH',
      serverMessageId: 143
    }
  };

  try {
    await conn.sendMessage(from, {
      image: { url: crazyImageUrl },
      caption: menuText,
      contextInfo
    }, { quoted: mek });
  } catch {
    await conn.sendMessage(from, { text: menuText, contextInfo }, { quoted: mek });
  }

  const responseHandler = async (upsert) => {
    if (!upsert.messages) return;
    const resMsg = upsert.messages[0];

    if (resMsg.key.remoteJid !== from) return;
    if (resMsg.key.fromMe) return;

    let text = '';
    if (resMsg.message?.conversation) {
      text = resMsg.message.conversation.trim();
    } else if (resMsg.message?.extendedTextMessage?.text) {
      text = resMsg.message.extendedTextMessage.text.trim();
    } else {
      return;
    }

    if (!nsfwMap.has(text)) return;

    const option = nsfwMap.get(text);

    try {
      const result = await axios.get(option.url);
      await conn.sendMessage(from, {
        image: { url: result.data.url },
        caption: `🔞 *NSFW – ${option.label}*`,
        contextInfo
      }, { quoted: resMsg });
    } catch {
      await conn.sendMessage(from, {
        text: `🚫 Error loading the image.`,
        contextInfo
      }, { quoted: resMsg });
    }
// handler de crazy ton (cul)
    conn.ev.off('messages.upsert', responseHandler);
  };

  conn.ev.on('messages.upsert', responseHandler);

  setTimeout(() => {
    conn.ev.off('messages.upsert', responseHandler);
  }, 20000);
});