import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import PrettyError from 'pretty-error';
PrettyError.start().withoutColors();
import Discord from 'discord.js';
import Util from './Util.js';

const alot = new Discord.Client({
    intents: 3,
    shards: 'auto',
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    restRequestTimeout: 25000
});

process.alot = alot;
alot.commands = new Discord.Collection();
alot.events = new Discord.Collection();

Util.LoadEvents().then(() => {
    for (const event of alot.events.values()) {
        if (event.process) {
            if (event.once) {
                // @ts-expect-error dis is valid bro
                process.once(event.name, (...args) => event.run(...args));
            } 
            else process.on(event.name, (...args) => event.run(...args));
        }
        else {
            if (event.once) alot.once(event.name, (...args: unknown[]) => event.run(...args, alot));
            else alot.on(event.name, (...args: unknown[]) => event.run(...args, alot));
        }
    }

    if (process.env.CLIENT_TOKEN) {
        alot.login(process.env.CLIENT_TOKEN);
    }
    else {
        console.log('No client token!');
        process.exit(1);
    }
});