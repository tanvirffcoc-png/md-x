
require('./setting')
const { 
default: baileys, 
proto, 
getContentType, 
generateWAMessage, 
generateWAMessageFromContent, 
generateWAMessageContent,
prepareWAMessageMedia, 
downloadContentFromMessage,
areJidsSameUser
} = require("@whiskeysockets/baileys");
const axios = require('axios');
const fs = require('fs-extra')
const crypto = require("crypto")
const util = require('util')
const chalk = require('chalk')
const FormData = require('form-data');
const { addPremiumUser, delPremiumUser } = require("./lib/premiun");
const { getBuffer, getGroupAdmins, getSizeMedia, fetchJson, sleep, isUrl, runtime } = require('./lib/myfunction');
//===============
module.exports = jean = async (jean, m, chatUpdate, store) => {
try {
const body = (
m.mtype === "conversation" ? m.message.conversation :
m.mtype === "imageMessage" ? m.message.imageMessage.caption :
m.mtype === "videoMessage" ? m.message.videoMessage.caption :
m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
m.mtype === "interactiveResponseMessage" ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
m.mtype === "messageContextInfo" ?
m.message.buttonsResponseMessage?.selectedButtonId ||
m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
m.text : "");
const prefix = (typeof body === "string" ? global.prefix.find(p => body.startsWith(p)) : null) || "";  
const isCmd = !!prefix;  
const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : []; 
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase() : "";
const text = args.join(" "); 
const fatkuns = m.quoted || m;
const quoted = ["buttonsMessage", "templateMessage", "product"].includes(fatkuns.mtype)
? fatkuns[Object.keys(fatkuns)[1] || Object.keys(fatkuns)[0]]
: fatkuns;
//======================
const botNumber = await jean.decodeJid(jean.user.id);
const premuser = JSON.parse(fs.readFileSync("./system/database/premium.json"));

const isCreator = global.owner
    .map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
    .includes(m.sender);

const isOwner = [botNumber, ...global.owner]
    .map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
    .includes(m.sender);
const isPremium = [botNumber, ...global.owner, ...premuser.map(user => user.id.replace(/[^0-9]/g, "") + "@s.whatsapp.net")].includes(m.sender);
if (!jean.public && !isOwner) return;
//======================
const isGroup = m.chat.endsWith("@g.us");
const groupMetadata = m.isGroup ? await jean.groupMetadata(m.chat) : {};
const participants = groupMetadata.participants || [];
const sender = m.key.fromMe ? (jean.user.id.split(':')[0]+'@s.whatsapp.net' || jean.user.id) : (m.key.participant || m.key.remoteJid)
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
const groupName = groupMetadata.subject || "";
let example = (teks) => {
return `\n\`ᴡʀᴏɴɢ ᴄᴏᴍᴍᴀɴᴅ\` \n *ᴇxᴀᴍᴘʟᴇ ᴏғ ᴜsᴀɢᴇ* :*\nᴛʏᴘᴇ *cmd*${cmd}* ${teks}\n`
}

const thumbnailUrl = 'https://files.lordobitotech.xyz/mediafiles/jean.jpg'
const MY_CHANNEL = "120363402881295184@newsletter"; 

const fkatalog = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    id: "Katalog"
  },
  message: {
    productMessage: {
      product: {
        productImage: {
          mimetype: "image/jpeg",
          jpegThumbnail: thumbnailUrl
        },
        title: "JEAN STEPH MD-X",
        description: `IDR: 999999\nυρтιмє: ${runtime(process.uptime())}\n\nWhatsApp Business - Verified Account`,
        currencyCode: "IDR",
        priceAmount1000: 999999000,
        productImageCount: 1
      },
      businessOwnerJid: "123456789@whatsapp.net"
    }
  }
};

    const from = m.key.remoteJid || "";
const fakeOrder = {
  key: {
    remoteJid: "status@broadcast",
    participant: "0@s.whatsapp.net",
    fromMe: false
  },
  message: {
    orderMessage: {
      orderId: "594071395007984",
      itemCount: 12345678,
      status: "INQUIRY",
      surface: "CATALOG",
      message: `ᴄᴏᴍᴍᴀɴᴅ: ${prefix + command}`,
      orderTitle: "JEAN STEPH MD-X",
      sellerJid: "2250712668494@s.whatsapp.net",
      token: "AR40+xXRlWKpdJ2ILEqtgoUFd45C8rc1CMYdYG/R2KXrSg==",
      totalAmount1000: "500000000000",
      totalCurrencyCode: "IDR"
    }
  }
};
    
const reply = (teks) => jean.sendMessage(m.chat, { text: teks }, { quoted: fakeOrder });

switch (command) {

case 'public': {
  if (!isCreator && !isOwner) return m.reply(mess.owner);
  if (jean.public === true) return m.reply("𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚");

  jean.public = true;

  await jean.sendMessage(m.chat, {
    text: "SUCCESS PUBLIC BOT 🔓!",
    contextInfo: {
      externalAdReply: {
        title: "JEAN STEPH MD-X",
        body: "null",
        mediaType: 1,
        thumbnailUrl: thumbnailUrl,
        sourceUrl: null,
      }
    },
    buttons: [
      {
        buttonId: ".self",
        buttonText: { displayText: "🔒 Self" },
        type: 1
      },
      {
        buttonId: ".menu",
        buttonText: { displayText: "𝐁𝐀𝐂𝐊" },
        type: 1
      }
    ],
    footer: "JEAN STEPH MD-X"
  }, { quoted: m });
}
break;

case 'self': {
  if (!isCreator && !isOwner) return m.reply(mess.owner);
  if (jean.public === false) return m.reply("𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚");

  jean.public = false;

  await jean.sendMessage(m.chat, {
    text: "SUCCESS SELF BOT 🔒!",
    contextInfo: {
      externalAdReply: {
        title: "JEAN STEPH MD-X",
        body: "null",
        mediaType: 1,
        thumbnailUrl: thumbnailUrl,
        sourceUrl: null,
      }
    },
    buttons: [
      {
        buttonId: ".public",
        buttonText: { displayText: "🔓 Public" },
        type: 1
      },
      {
        buttonId: ".menu",
        buttonText: { displayText: "Menu" },
        type: 1
      }
    ],
    footer: "JEAN STEPH TECH"
  }, { quoted: m });
}
break;

case 'tag':
case 'hidetag': {
await jean.sendMessage(from, { react: { text: "📢", key: m.key } });
if (!m.isGroup) return reply("❌ Group Only");

// récupération du contenu (texte ou fallback)
let teks = text || "";

// si on reply à un message
if (m.quoted) {
    teks = m.quoted.text 
        || m.quoted.caption 
        || m.quoted.conversation 
        || teks;
}

if (!teks) return reply("*Format :*\nht <message or reply>");

// récupération des membres du groupe
let metadata = await jean.groupMetadata(m.chat);
let member = metadata.participants.map(e => e.id);

// envoi avec mention
await jean.sendMessage(m.chat, {
    text: teks,
    mentions: member
}, { quoted: m });

}
break;

case 'github': {
await jean.sendMessage(from, { react: { text: "🦑", key: m.key } });
    if (!text) return reply(`⚠️ Usage: ${command} <username>\n\nExample: ${command} torvalds`)

    try {
        let res = await axios.get(`https://api.github.com/users/${encodeURIComponent(text)}`)
        let user = res.data

        if (!user || !user.login) return reply("❌ User not found.")

        let profileInfo = `👨‍💻 *GitHub Profile*\n
👤 Name: ${user.name || "N/A"}
🔖 Username: ${user.login}
📍 Location: ${user.location || "N/A"}
📦 Public Repos: ${user.public_repos}
👥 Followers: ${user.followers}
👤 Following: ${user.following}
📅 Created: ${new Date(user.created_at).toLocaleDateString()}
🌐 Profile: ${user.html_url}`

        // Send profile pic + info
        await jean.sendMessage(m.chat, {
            image: { url: user.avatar_url },
            caption: profileInfo,
             contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402881295184@newsletter',
                    newsletterName: '¿? JEAN STEPH TECH ¿?',
                    serverMessageId: 143
                }
            }
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        reply("⚠️ Failed to fetch GitHub profile. Try again.")
    }
}
break

case 'url': {
await jean.sendMessage(from, { react: { text: "🔗", key: m.key } });
    if (!m.quoted) return reply("❌ Reply to a media outlet");

    let mime = m.quoted.mimetype || '';
    if (!mime) return reply("❌ Unsupported type");

    try {
        let media = await m.quoted.download();

        let form = new FormData();
        form.append("file", media, "file");

        let res = await axios.post(
            "https://files.lordobitotech.xyz/api/mediafiles",
            form,
            {
                headers: {
                    ...form.getHeaders()
                }
            }
        );

        if (!res.data.success) return reply("❌ Upload failed");

        let link = res.data.url;

        await jean.sendMessage(m.chat, {
            text: `╭━〔 🔗 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗗 〕━╮
┃ ✅ Upload successful
┃ 🆔 ID : ${res.data.id}
┃ 🌐 Link :
┃ ${link}
╰━━━━━━━━━━━╯`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: MY_CHANNEL,
                    newsletterName: "JEAN STEPH TECH",
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

    } catch (err) {
        console.log(err?.response?.data || err);
        reply("❌ API upload error");
    }
}
break;
case 'save': {
await jean.sendMessage(from, { react: { text: "📥", key: m.key } });
    if (!m.quoted) return reply("Reply to a status/media");

    try {
        const buffer = await m.quoted.download();

        await jean.sendMessage(m.chat, {
            document: buffer,
            mimetype: m.quoted.mimetype || 'application/octet-stream',
            fileName: 'saved_file'
        }, { quoted: m });

    } catch (e) {
        console.log(e);
        reply("❌ Failed to save");
    }
}
break;

case 'npm': {
await jean.sendMessage(from, { react: { text: "📦", key: m.key } });
    if (!text) return reply(`⚠️ Usage: ${command} <package>\n\nExample: ${command} axios`)

    try {
        let res = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(text)}`)
        let data = res.data

        if (!data.name) return reply("❌ Package not found.")

        // Get latest version
        let latestVersion = data['dist-tags']?.latest
        let info = data.versions[latestVersion]

        let npmInfo = `📦 *NPM Package Info*\n
🔖 Name: ${data.name}
📌 Latest Version: ${latestVersion}
📝 Description: ${data.description || "N/A"}
👤 Author: ${info?.author?.name || "N/A"}
📅 Published: ${info?.date || "N/A"}
📦 License: ${info?.license || "N/A"}
🌐 Homepage: ${info?.homepage || "N/A"}
🔗 NPM: https://www.npmjs.com/package/${data.name}
`

        reply(npmInfo.trim())
    } catch (e) {
        console.error(e)
        reply("⚠️ Failed to fetch NPM package info. Try again.")
    }
}
break;

case "groupinfo":
 case "gcinfo": {
 await jean.sendMessage(from, { react: { text: "📑", key: m.key } });
 
  if (!m.isGroup) return jean.sendMessage(m.chat, { text: "❌ *Command usable only in a group.*" }, { quoted: m });
if (!owner) 
  return reply('❌ Only the bot owner or sudo users can use this command.');

  const groupInfo = await jean.groupMetadata(m.chat);
  const groupAdminsList = groupInfo.participants.filter(p => p.admin).map(p => p.id);

  let txt = `📊 *Group information*\n\n`;
  txt += `👥 *Name :* ${groupInfo.subject}\n`;
  txt += `🆔 *ID :* ${groupInfo.id}\n`;
  txt += `👑 *Creator :* @${groupInfo.owner.split("@")[0]}\n`;
  txt += `🧑‍🤝‍🧑 *Members :* ${groupInfo.participants.length}\n`;
  txt += `🛡️ *Admins :* ${groupAdminsList.length}\n`;
  txt += `🕒 *Created on :* ${new Date(groupInfo.creation * 1000).toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })}`;

  await jean.sendMessage(m.chat, {
    text: txt,
     contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402881295184@newsletter',
                    newsletterName: '¿? JEAN STEPH TECH ¿?',
                    serverMessageId: 143
                }
            },
    mentions: [groupInfo.owner, ...groupAdminsList]
  }, { quoted: m });
}
break;
        
case "jid": case "idch": {
await jean.sendMessage(from, { react: { text: "🆔", key: m.key } });
if (!text) return reply("*Put link*")
if (!text.includes("https://whatsapp.com/channel/")) return m.reply("*Link Is Not For Valid Channel*")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await jean.newsletterMetadata("invite", result)
let teks = `
* *ID :* ${res.id}
* *Name :* ${res.name}
* *Total followers :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "YES" : "NO"}
`
return reply(teks)
}
break

case 'deploy': {
await jean.sendMessage(from, { react: { text: "📂", key: m.key } });
const caption = `

╭━〔 JEAN-STEPH MD-X 〕━━╮
┃
┃ 📦 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : JEAN STEPH MD-X
┃ ⚙️ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 1.0.1
┃ 👑 𝗗𝗲𝘃 : JEAN STEPH 
┃
╰━━━━━━━━━━━━━━╯
╭━━━━〔 📥 𝗕𝗢𝗧 〕━━━╮ 
┃ 
┃ 🔗 𝗥𝗲𝗽𝗼 :
┃https://github.com/JeanStephTech/md-x/fork
┃
┃ 📂 𝗕𝗼𝘁 𝗙𝗶𝗹𝗲 :
┃
┃• 𝗢𝗕𝗜𝗧𝗢 𝗧𝗛𝗘𝗠𝗘 : 
┃https://files.lordobitotech.xyz/files/mdx-v1-0-1
┃
┃ 🌐 𝗪𝗲𝗯 𝗕𝗼𝘁 :
┃ https://js-mdx.lordobitotech.xyz (Offline at the moment )
┃ 🤖 𝗧𝗴 𝗯𝗼𝘁 :
┃ https://t.me/JS_MdX_Bot (offline at the moment)
┃
┃ 📂 𝗟𝗧𝗦 𝘃𝗲𝗿𝘀𝗶𝗼𝗻 𝗳𝗶𝗹𝗲𝘀 :
┃ https://files.lordobitotech.xyz/files/jsmdx-lts
┃
┃🧠 \`𝗗𝗘𝗣𝗟𝗢𝗬𝗠𝗘𝗡𝗧\`  
┃
┃ 📘 *Tutorial :*
┃
┃•Deploy on Termux : https://youtube.com/JeanStephTech
┃•Deploy on Ptero Server : https://youtube.com/JeanStephTech
┃
┃🚀 \`𝗙𝗥𝗘𝗘 𝗦𝗘𝗥𝗩𝗘𝗥𝗦\` 
┃
┃ 🌐 *Web :* https://fps-web.lordobitotech.xyz
┃ 🤖 *Tg Bot :*
┃https://t.me/FreePanelsPterodactyl_Bot
┃
┃ Another free server : https://bothosting.net
┃
┃📡 \`𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟𝗦\`
┃
┃ 📢 *WhatsApp :*
┃https://whatsapp.com/channel/0029VbCUG0XHltYAlmcp9A3T
┃ 💬 *Telegram :*
┃https://t.me/JeanStephTech
┃
┃🏢 \`𝗖𝗢𝗠𝗣𝗔𝗡𝗬\`
┃
┃ 🐙 *𝗚𝗶𝘁𝗛𝘂𝗯 𝗢𝗿𝗴 :*
┃ https://github.com/JeanStephTech
┃ 🌐 *𝗢𝘂𝗿 𝘄𝗲𝗯𝘀𝗶𝘁𝗲 :*
┃https://www.lordobitotech.xyz
┃
╰━━━━━━━━━━━━━━╯`;

await jean.sendMessage(m.chat, {
    image: { url: thumbnailUrl },
    caption: caption,
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363402881295184@newsletter",
            newsletterName: "¿? JEAN STEPH TECH ¿?",
            serverMessageId: 143
        }
    }
}, { quoted: m });

}
break;

case "autotyping": {
await jean.sendMessage(from, { react: { text: "🖋️", key: m.key } });
    if (!isOwner) return reply("❌ Owner only");

    if (args[0] === "on") {
        global.db.settings.autotyping = true;
        reply("✅ Auto typing ON");
    } else if (args[0] === "off") {
        global.db.settings.autotyping = false;
        reply("❌ Auto typing OFF");
    }
}
break;

case "autorecord": {
await jean.sendMessage(from, { react: { text: "🎤", key: m.key } });

    if (!isOwner) return reply("❌ Owner only");

    if (args[0] === "on") {
        global.db.settings.autorecord = true;
        reply("✅ Auto record ON");
    } else if (args[0] === "off") {
        global.db.settings.autorecord = false;
        reply("❌ Auto record OFF");
    }
}
break;

case 'menu':
case 'jean':
case 'js': {
    await jean.sendMessage(from, { react: { text: "🥷", key: m.key } });

    const JeanText = `╭━━━━━━━━━━━━━━━╮
┃  〔 𝗝𝗘𝗔𝗡 𝗦𝗧𝗘𝗣𝗛 𝗠𝗗-𝗫 〕
┝━━━━━━━━━━━━━━━┥
┃ 👤 𝗨𝗦𝗘𝗥 : @${sender.split("@")[0]}
┃ 💎 𝗩𝗘𝗥𝗦𝗜𝗢𝗡 : 𝟭.𝟬.𝟭
┃ 🛠️ 𝗗𝗘𝗩 : JEAN STEPH TECH
┃ 🎭 𝗧𝗛𝗘𝗠𝗘 : 𝗢𝗕𝗜𝗧𝗢 𝗨𝗦𝗛𝗜𝗪𝗔
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃   ⚙️〔 𝗨𝗧𝗜𝗟𝗦 〕
┝━━━━━━━━━━━━━━━┥
┃ ⏳ 𝗽𝗶𝗻𝗴      - speed bot
┃ 📜 𝗺𝗲𝗻𝘂      - show menu
┃ 🆔 𝗶𝗱𝗰𝗵      - id channel
┃ 📦 𝗻𝗽𝗺       - npm info
┃ 🦑 𝗴𝗶𝘁𝗵𝘂𝗯    - github stalk
┃ 🚀 𝗱𝗲𝗽𝗹𝗼𝘆    - bot deploy
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃   📥〔 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 〕
┝━━━━━━━━━━━━━━━┥
┃ 🖼️ 𝗶𝗺𝗴       - image download
┃ 🎵 𝗽𝗹𝗮𝘆      - download music
┃ 🔗 𝘂𝗿𝗹       - upload file
┃ 💾 𝘀𝗮𝘃𝗲      - save media/status
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃  🤖〔 𝗔𝗨𝗧𝗢 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 〕
┝━━━━━━━━━━━━━━━┥
┃ ⌨️ 𝗮𝘂𝘁𝗼𝘁𝘆𝗽𝗶𝗻𝗴 - typing mode
┃ 🎤 𝗮𝘂𝘁𝗼𝗿𝗲𝗰𝗼𝗿𝗱 - recording mode
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃  👥〔 𝗚𝗥𝗢𝗨𝗣 〕
┝━━━━━━━━━━━━━━━┥
┃ 👻 𝗵𝗶𝗱𝗲𝘁𝗮𝗴   - hidden tag
┃ 📢 𝘁𝗮𝗴𝗮𝗹𝗹    - tag members
┃ 📛 𝗸𝗶𝗰𝗸      - remove member
┃ ❌ 𝗸𝗶𝗰𝗸𝗮𝗹𝗹   - empty group
┃ 🔊 𝘂𝗻𝗺𝘂𝘁𝗲    - open group
┃ 🔇 𝗺𝘂𝘁𝗲      - close group
┃ 📑 𝗴𝗰𝗶𝗻𝗳𝗼    - group info
┃ 👋 𝘄𝗲𝗹𝗰𝗼𝗺𝗲 - on/off 
┃ 🌍 𝘄𝗲𝗹𝗰𝗼𝗺𝗲 𝗴𝗹𝗼𝗯𝗮𝗹-𝗼𝗻 - enable all gc
┃ 🌍 𝘄𝗲𝗹𝗰𝗼𝗺𝗲 𝗴𝗹𝗼𝗯𝗮𝗹-𝗼𝗳𝗳 - disable all gc
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃  👑〔 𝗢𝗪𝗡𝗘𝗥 〕
┝━━━━━━━━━━━━━━━┥
┃ 🔓 𝗽𝘂𝗯𝗹𝗶𝗰     - public mode
┃ 🔒 𝘀𝗲𝗹𝗳       - self mode
╰━━━━━━━━━━━━━━━╯

> © 2026 - JEAN STEPH MD-X
> Theme: *_Obito Uchiwa_*`;

    const videoUrl = "https://files.lordobitotech.xyz/mediafiles/a2c4bff2-b48b-4ec1-8c2f-6026b14dc789.mp4";
    const audioUrl = "https://files.lordobitotech.xyz/mediafiles/jean.mp3";

    // 🔥 BUFFER VIDEO (anti bug)
    const videoBuffer = (await axios.get(videoUrl, {
        responseType: 'arraybuffer'
    })).data;

    const sentMsg = await jean.sendMessage(
        m.chat,
        {
            video: Buffer.from(videoBuffer),
            caption: JeanText,
            gifPlayback: true,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402881295184@newsletter',
                    newsletterName: '¿? JEAN STEPH TECH ¿?',
                    serverMessageId: 143
                }
            }
        },
        { quoted: m }
    );

    const audioBuffer = (await axios.get(audioUrl, {
        responseType: 'arraybuffer'
    })).data;

    await jean.sendMessage(
        m.chat,
        {
            audio: Buffer.from(audioBuffer),
            mimetype: 'audio/mpeg',
            ptt: false
        },
        { quoted: sentMsg }
    );

    break;
}
//============================
case 'tagall': {
await jean.sendMessage(from, { react: { text: "📢", key: m.key } });
    if (!m.isGroup) return reply('❌ Group only');

    let teks = `
╭━━━〔 👥 𝗧𝗔𝗚 𝗔𝗟𝗟 📢 〕━━━╮
┃ 
┃ *Tagall by @${sender.split("@")[0]}*
┃
`;

    let mentions = [];
    let count = 1;

    for (let mem of participants) {
        let jid = mem.id;
        let name = store.contacts[jid]?.name 
            || mem.notify 
            || jid.split('@')[0];

        teks += `┃ ${count}. 👤 @${jid.split('@')[0]}\n`;

        mentions.push(jid);
        count++;
    }
    
    teks += `╰━━━━━━━━━━━━━━━━━╯`;

    let pp;
    try {
        pp = await jean.profilePictureUrl(m.sender, 'image');
    } catch {
        pp = 'https://files.lordobitotech.xyz/mediafiles/jean.jpg';
    }

    await jean.sendMessage(m.chat, {
        image: { url: pp },
        caption: teks,
        mentions,
        contextInfo: {
            mentionedJid: mentions,
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: MY_CHANNEL,
                newsletterName: '¿? JEAN STEPH TECH ¿?',
                serverMessageId: 143
            }
        }
    }, { quoted: m });
}
break;

case "kick": {
await jean.sendMessage(from, { react: { text: "🤡", key: m.key } });
if (!m.isGroup) return reply("❌ Group Only");
if (!(isOwner || isAdmins)) return reply(isOwner ? "❌ Owner Only" : "❌ Admin Only");
let users = participants.filter((u) => !areJidsSameUser(u.id, jean.user.id)); 
   let kickedUser = []; 
   for (let user of users) { 
     if (user.id.endsWith("@s.whatsapp.net") && !user.owner) { 
       await kickedUser.push(user.id); 
       await sleep(1 * 1000); 
     } 
   } 
   if (!kickedUser.length >= 1) 
     return reply("In this group there are no members except you and me"); 
   const res = await jean.groupParticipantsUpdate(m.chat, kickedUser, "remove"); 
   await sleep(3000); 
   await reply( 
     `sucessfully kicked member\n${kickedUser.map( 
       (v) => "@" + v.split("@")[0] 
     )}`, 
     null, 
     { 
       mentions: kickedUser, 
     } )
   }; 
break;

case "mute": {
await jean.sendMessage(from, { react: { text: "🔇", key: m.key } });
if (!m.isGroup) return reply("❌ Group Only");
if (!(isOwner || isAdmins)) return reply(isOwner ? "❌ Owner Only" : "❌ Admin Only");
await jean.groupSettingUpdate(m.chat, 'announcement')
reply("Success closed group chat,all members are not allowed to chat for now")
}
break
//==================================================//
case "unmute": {
await jean.sendMessage(from, { react: { text: "🔊", key: m.key } });
if (!m.isGroup) return reply("❌ Group Only");
if (!(isOwner || isAdmins)) return reply(isOwner ? "❌ Owner Only" : "❌ Admin Only");
await jean.groupSettingUpdate(m.chat, 'not_announcement')
reply("Success opened group chat,all members can send messages in group now")
}
break

case "kickall": {
await jean.sendMessage(from, { react: { text: "👿", key: m.key } });
if (!m.isGroup) return reply("❌ Group Only");
if (!(isOwner || isAdmins)) return reply(isOwner ? "❌ Owner Only" : "❌ Admin Only");

    const botId = jean.decodeJid(jean.user.id);

    let raveni = participants
        .filter(v => v.id !== botId && v.admin === null) // ✅ skip bot + admins
        .map(v => v.id);

    reply("⚡ Initializing Kickall MD-X...");

    // 🔥 MESSAGE MD-X (inchangé)
    await jean.sendMessage(m.chat, {
        text: `╭━━━〔 💀 𝗞𝗜𝗖𝗞𝗔𝗟𝗟 〕━━╮
┃ ⚡ Status : Initializing...
┃ 👥 Members : ${raveni.length}
┃ 🚀 Mode : Destruction
╰━━━━━━━━━━━━━━━━╯

╭━━━〔 ⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 〕━━╮
┃ This process is irreversible
┃ Removing all members...
╰━━━━━━━━━━━━━━╯`,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: MY_CHANNEL,
                newsletterName: '¿? JEAN STEPH TECH ¿?',
                serverMessageId: 143
            }
        }
    }, { quoted: m });

    await sleep(1500);

    // 🔥 SUPPRESSION PROGRESSIVE (inchangé + fix sync)
    for (let user of raveni) {
        try {
            await jean.groupParticipantsUpdate(m.chat, [user], "remove");
            await sleep(800); // légèrement augmenté pour stabilité
        } catch (err) {
            console.log("Kick error:", err);
        }
    }

    // 🔥 attendre que WhatsApp finisse vraiment
    await sleep(2000);

    // ✅ FIN (inchangé)
    await jean.sendMessage(m.chat, {
        text: `
╭━━〔 ✅ 𝗗𝗢𝗡𝗘 〕━━╮
┃ All members removed
┃ 👋 Goodbye group
╰━━━━━━━━━━━╯`,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: MY_CHANNEL,
                newsletterName: '¿? JEAN STEPH TECH ¿?',
                serverMessageId: 143
            }
        }
    }, { quoted: m });

    await sleep(2000);
}
break;
          
case 'welcome': {
    await jean.sendMessage(from, { react: { text: "🤗", key: m.key } });

    if (!m.isGroup) return reply("❌ Group only");
    if (!isOwner) return reply("Owner Only ❌")

    let group = getGroupSetting(m.chat);

    if (args[0] === 'on') {
        group.welcome = true;
        reply("✅ Welcome & Goodbye enabled for this group");
    } else if (args[0] === 'off') {
        group.welcome = false;
        reply("❌ Welcome & Goodbye disabled for this group");
    } else if (args[0] === 'global-on') {
        global.db.settings.welcome = true;
        reply("🌍 Global Welcome ENABLED");
    } else if (args[0] === 'global-off') {
        global.db.settings.welcome = false;
        reply("🌍 Global Welcome DISABLED");
    } else {
        reply(`⚙️ STATUS

🌍 Global: ${global.db.settings.welcome ? "ON" : "OFF"}
👥 Group: ${group.welcome ? "ON" : "OFF"}

Use:
.welcome on/off
.welcome global-on/global-off`);
    }
}
break;
case 'ping':
                          case 'p':
  await jean.sendMessage(from, { react: { text: '⌚', key: m.key } });
                            {
                              
                                   async function loading (jid) {
                             
                                    let start = new Date;
                                    let { key } = await jean.sendMessage(jid, {text: 'Checking latency.....'})
                                    let done = new Date - start;
                                    var lod = `*Pong*:\n> ⏱️ ${done}ms (${Math.round(done / 100) / 10}s)`
                                    
                                    await sleep(1000)
                                    await jean.sendMessage(jid, {text: lod, edit: key });
                                    }
                                    loading(from)
                                   
                            }       
                            break;
                            
 case 'img': {
    await jean.sendMessage(m.chat, { react: { text: "🖼️", key: m.key } });

    if (!text) return reply("❌ Example: .img Obito 5");

    let args = text.split(" ");
    let num = 5;

    let last = args[args.length - 1];
    if (!isNaN(last)) {
        num = Math.min(parseInt(last), 10);
        args.pop();
    }

    let query = args.join(" ");

    reply(`🔎 Searching ${num} images for "${query}"...`);

    try {
        let res = await axios.get("https://www.googleapis.com/customsearch/v1", {
            params: {
                q: query,
                cx: "d1a5b18a0be544a0e",
                searchType: "image",
                key: "AIzaSyDo09jHOJqL6boMeac-xmPHB-yD9dKOKGU",
                num: num
            }
        });

        let results = res.data.items;

        if (!results || results.length === 0) {
            return reply("❌ No images found");
        }

        for (let i = 0; i < results.length; i++) {
            try {
                let img = await axios.get(results[i].link, { responseType: "arraybuffer" });

                await jean.sendMessage(m.chat, {
                    image: Buffer.from(img.data),
                    caption: `╭━━〔 🖼 𝗜𝗠𝗔𝗚𝗘 ${i+1}/${results.length} 〕━━╮
┃ 🔍 Query : ${query}
┃ ⚡ Powered by MD-X
╰━━━━━━━━━━━━━━╯`,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: MY_CHANNEL,
                            newsletterName: '¿? JEAN STEPH TECH ¿?',
                            serverMessageId: 143
                        }
                    }
                }, { quoted: m });

                await sleep(800);

            } catch (e) {
                console.log("Image error:", e.message);
            }
        }

        await jean.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.log(err);
        reply("❌ Error while fetching images");
    }
}
break;           
case 'song':
case 'play': {
    await jean.sendMessage(m.chat, { react: { text: "🎧", key: m.key } });

    try {
        const query = args.join(' ');
        if (!query) return reply("❌ Exemple : .song Alan Walker");

        await jean.sendMessage(m.chat, { react: { text: "🔎", key: m.key } });

        const yts = require('yt-search');
        const search = await yts(query);

        if (!search.videos.length) return reply("❌ Aucun résultat");

        const vid = search.videos[0];

        // preview style channel
        await jean.sendMessage(m.chat, {
            image: { url: vid.thumbnail },
            caption: `╭━━〔 🎵 𝗠𝗨𝗦𝗜𝗖 𝗙𝗢𝗨𝗡𝗗 〕━━━╮
┃ 🎧 *Title* : ${vid.title}
┃ ⏱️ *Duration* : ${vid.timestamp}
┃ 👁️ *Views* : ${vid.views}
┃ 🔗 *Link* : ${vid.url}
╰━━━━━━━━━━━━━━━━━╯

⏳ Downloading audio...`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: MY_CHANNEL,
                    newsletterName: "¿? JEAN STEPH TECH ¿?",
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

        await jean.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

        // API download
        let api = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(vid.url)}`;
        let { data } = await axios.get(api);

        if (!data?.status) return reply("❌ API error");

        await jean.sendMessage(m.chat, {
            audio: { url: data.audio },
            mimetype: "audio/mpeg",
            ptt: false,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: MY_CHANNEL,
                    newsletterName: "¿? JEAN STEPH TECH ¿?",
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

        await jean.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.log(err);
        reply("❌ Download failed");
        await jean.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
}
break;
//=============≠≠==========
default:
}} catch (err) {
console.log('\x1b[1;31m'+err+'\x1b[0m')}}
