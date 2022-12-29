const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: false }, session: sessionCfg });

client.initialize();

const msgList = [
    'Happy New Year',
    'new year',
    'hny',
    'this year',
    'hpy new yr',
    'hpy nw year',
    '2023'
];
const replies = [
    'Thank you :) wish you the same',
    'Same to you :)'
]



client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg = session;
    if (session) {
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
                console.error(err);
            }
        });
    }

});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});

client.on('message', message => {
    const isNewYearWish= msgList.find((msg) => message.body.toLocaleLowerCase().includes(msg.toLocaleLowerCase()));

    if (isNewYearWish) {
        const reply = replies[Math.floor(Math.random() * replies.length)];
        message.reply(reply)
    }

});

client.on('change_state', state => {
    console.log('CHANGE STATE', state);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});
