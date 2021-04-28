import { GuildMember } from 'discord.js';

export default {
    name: 'guildMemberAdd',
    async run(member: GuildMember): Promise<void> {
        if (member.guild.id !== '835430397033578497') return;
        const nick = 'Alot of ' + member.user.username;

        if (nick.length > 32) await member.setNickname('Alot of characters');
        else await member.setNickname(nick);
    }
};