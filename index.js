require('./system/setting');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys");
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const chalk = require('chalk')
const crypto = require("crypto");
const readline = require("readline")
const axios = require('axios'); // Added for GitHub database
const { smsg, fetchJson, await, sleep } = require('./system/lib/myfunction');
//======================
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
const usePairingCode = true

const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
return new Promise((resolve) => {
rl.question(text, resolve)
})};

const fs = require("fs");

// 🔥 créer fichier si inexistant
if (!fs.existsSync('./database.json')) {
    fs.writeFileSync('./database.json', JSON.stringify({
        groups: {},
        settings: {}
    }, null, 2));
}

// 🔥 charger DB
global.db = JSON.parse(fs.readFileSync('./database.json'));

// 🔥 sécuriser structure
if (!global.db.groups) global.db.groups = {};

if (!global.db.settings) {
    global.db.settings = {
        autostatus: false,
        autotyping: false,
        autorecord: false,
        welcome: true
    };
}

// 🔥 autosave
setInterval(() => {
    fs.writeFileSync('./database.json', JSON.stringify(global.db, null, 2));
}, 5000);

// 🔧 Fonction globale
global.getGroupSetting = function(id) {
    if (!global.db.groups[id]) {
        global.db.groups[id] = {
            welcome: true
        };
    }
    return global.db.groups[id];
}


const MY_CHANNEL = "120363402881295184@newsletter"; 

//======================
async function StartJean() {
const { state, saveCreds } = await useMultiFileAuthState('./session')
const jean = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: !usePairingCode,
auth: state,
browser: [ "Ubuntu", "Chrome", "20.0.04" ]
});
//======================
if (usePairingCode && !jean.authState.creds.registered) {
console.log(chalk.cyan("-[ 🔗 Time To Pairing! ]"));
const phoneNumber = await question(chalk.green("-📞 Enter Your Number Phone::\n"));

const code = await jean.requestPairingCode(phoneNumber.trim(), "JEANS304");//set your pairing code
console.log(chalk.blue(`-✅ Pairing Code: `) + chalk.magenta.bold(code));
}
jean.public = global.publik
//======================
jean.ev.on("connection.update", async (update) => {
const { connection, lastDisconnect } = update;
if (connection === "close") {
const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
const reconnect = () => StartJean();
const reasons = {
[DisconnectReason.badSession]: "Bad Session!",
[DisconnectReason.connectionClosed]: "Connetion Closed ...",
[DisconnectReason.connectionLost]: "Connetion lost ...",
[DisconnectReason.connectionReplaced]: "Session Remplaced ",
[DisconnectReason.loggedOut]: "LoggedOut!",
[DisconnectReason.restartRequired]: "Restart Required...",
[DisconnectReason.timedOut]: "TimeOut..."};
console.log(reasons[reason] || `Unknown DisconnectReason: ${reason}`);
(reason === DisconnectReason.badSession || reason === DisconnectReason.connectionReplaced) ? StartJean() : reconnect()}
if (connection === "open") {
      if ("120363402881295184@newsletter")
        try {
    await jean.newsletterFollow("120363402881295184@newsletter");
    await jean.newsletterFollow("120363407673576597@newsletter");
    await jean.newsletterFollow("120363419984097704@newsletter");
    await jean.newsletterFollow("120363330645505280@newsletter");
    
  } catch (err) {
    console.log("Newsletter follow failed:", err.message || err);
  }
console.log(chalk.red.bold("-[ WhatsApp Connected ! ]"));
}});

jean.ev.on('group-participants.update', async (anu) => {
    try {
        // 🔥 GLOBAL OFF → STOP DIRECT
        if (!global.db.settings.welcome) return;

        const metadata = await jean.groupMetadata(anu.id);
        const groupName = metadata.subject;

        const group = getGroupSetting(anu.id);

        // 🔥 GROUP OFF → STOP DIRECT
        if (!group.welcome) return;

        const totalMembers = metadata.participants.length;
        const totalAdmins = metadata.participants.filter(v => v.admin !== null).length;

        for (let num of anu.participants) {

            let ppuser;
            try {
                ppuser = await jean.profilePictureUrl(num, 'image');
            } catch {
                ppuser = 'https://files.lordobitotech.xyz/mediafiles/jean.jpg';
            }

            // =========================
            // ✅ WELCOME
            // =========================
            if (anu.action === 'add') {

                const text = `
╭━〔 ✨ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ✨ 〕━━╮
┃ 👤 @${num.split("@")[0]}
┃ 🎉 Bienvenue dans ${groupName}
┃
┃ 👥 Membres : ${totalMembers}
┃ 🛡 Admins  : ${totalAdmins}
┃
┃ 🚀 Profite bien du groupe !
╰━━━━━━━━━━━━━━━╯
`;

                await jean.sendMessage(anu.id, {
                    image: { url: ppuser },
                    caption: text,
                    mentions: [num],
                    contextInfo: {
                        mentionedJid: [num],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: MY_CHANNEL,
                            newsletterName: '¿? JEAN STEPH TECH ¿?',
                            serverMessageId: 143
                        }
                    }
                });
            }

            // =========================
            // 💔 GOODBYE
            // =========================
            if (anu.action === 'remove') {

                const text = `
╭━〔 💔 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 💔 〕━━╮
┃ 👤 @${num.split("@")[0]}
┃ 😢 A quitté ${groupName}
┃
┃ 👥 Membres restants : ${totalMembers}
┃ 🛡 Admins : ${totalAdmins}
┃
┃ ⚡ _Bonne continuation..._
╰━━━━━━━━━━━━━━━╯
`;

                await jean.sendMessage(anu.id, {
                    image: { url: ppuser },
                    caption: text,
                    mentions: [num],
                    contextInfo: {
                        mentionedJid: [num],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: MY_CHANNEL,
                            newsletterName: '¿? JEAN STEPH TECH ¿?',
                            serverMessageId: 143
                        }
                    }
                });
            }
        }

    } catch (err) {
        console.log(err);
    }
});
//==========================//
jean.ev.on("messages.upsert", async ({
messages,
type
}) => {
try {
const msg = messages[0] || messages[messages.length - 1]
if (type !== "notify") return
if (!msg?.message) return

if (global.db.settings.autotyping) {
    await jean.sendPresenceUpdate("composing", m.chat);
}

if (global.db.settings.autorecord) {
    await jean.sendPresenceUpdate("recording", m.chat);
}
const m = smsg(jean, msg, store)
require(`./system/jean`)(jean, m, msg, store)
} catch (err) { console.log((err)); }})
//=========================//
jean.decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {};
return decode.user && decode.server && decode.user + '@' + decode.server || jid;
} else return jid;
};
//=========================//
jean.sendText = (jid, text, quoted = '', options) => jean.sendMessage(jid, { text: text, ...options }, { quoted });
jean.ev.on('contacts.update', update => {
for (let contact of update) {
let id = jean.decodeJid(contact.id);
if (store && store.contacts) {
store.contacts[id] = { id, name: contact.notify };
}
}
});
jean.ev.on('creds.update', saveCreds);
return jean;
}
//=============================//
console.log(chalk.green.bold(
`
» Information:
☇ Creator : @JeanStephTech
☇ Name Script : JEAN STEPH MD
☇ Version : 1.0.1`));
StartJean()
//======================