import { Client, ClientApplication, User, Team } from 'discord.js';
import Util from '../../Util.js';
import LCL from 'last-commit-log';

export default {
    name: 'ready',
    once: true,
    async run(alot: Client): Promise<void> {
        const app = await alot.application?.fetch().catch(x => Util.log('Failed to fetch owner: ' + x));
        if (app && app instanceof ClientApplication && app.owner && app.owner instanceof User) alot.owner = app.owner.id;
        else if (app && app instanceof ClientApplication && app.owner && app.owner instanceof Team) alot.owner = app.owner.ownerID as string;

        await Util.LoadCommands();
        await Util.DeployCommands();
    
        const activities = async () => {
            const users = alot.guilds.cache.reduce((r, d) => r + d.memberCount, 0);
            const emojis = alot.guilds.cache.get('835430397033578497')?.emojis.cache.size;

            alot.user?.setActivity('alot of guilds: ' + alot.guilds.cache.size, { type: 'WATCHING' });
            await Util.delay(10000)
            alot.user?.setActivity('alot of users: ' + users, { type: 'WATCHING' });
            await Util.delay(10000)
            alot.user?.setActivity('alot of emojis: ' + emojis, { type: 'WATCHING' });
        }
        
        setInterval(activities, 30000);
        const aday = 1000 * 60 * 60 * 24;
        //await Util.Avatars(); for some reason png does not work
        //setInterval(avatars, aday);
        console.log('Ready!');

        const lcl = new LCL('../');
        const commit = await lcl.getLastCommit();
        if (commit) Util.log(`Logged in as \`${process.alot.user?.tag}\`.\n[#${commit.shortHash}](<${commit.gitUrl}/commit/${commit.hash}>) - \`${commit.subject}\` by \`${commit.committer.name}\` on branch [${commit.gitBranch}](<${commit.gitUrl}/tree/${commit.gitBranch}>).`);
    }
};