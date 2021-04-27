import { CommandInteraction, MessageEmbed, Message } from 'discord.js';
import { Command } from 'src/@types/Util';

export async function run(interaction: CommandInteraction): Promise<void | Message | null> {
    const cmds = process.alot.getStat.get('commands_ran').value + 1;
    const alots =  process.alot.getStat.get('created_alots').value;
    const users = process.alot.guilds.cache.reduce((r, d) => r + d.memberCount, 0);

    const embed = new MessageEmbed()
    .setTitle('alot of stats:')
    .setDescription(`<:alot:835434140496429057> of guilds: \`${process.alot.guilds.cache.size}\`\n<:alot:835434140496429057> of users: \`${users.toLocaleString('de-DE')}\`\n<:alot:835434140496429057> of used commands: \`${cmds.toLocaleString('de-DE')}\`\ncreated <:alot:835434140496429057> of alots: \`${alots.toLocaleString('de-DE')}\``)
    .setColor('#997a63')
    .setThumbnail((process.alot.user?.displayAvatarURL() as string))
    .setFooter('alot of alots | © adrifcastr', process.alot.user?.displayAvatarURL());
    if (interaction.guildID !== '835430397033578497') embed.addField('Want more?', 'There\'s <:alot:835434140496429057> over at [Alot of Emojis](https://discord.gg/2KZqgajxtH)!');
    
    return interaction.editReply(embed);
}

export const info: Command['info'] = {
    roles: [],
    user_perms: [],
    bot_perms: []
};

export const data: Command['data'] = {
    name: 'stats',
    description: 'alot of stats'
};