import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Command } from 'src/@types/Util.js';
import Util from '../../Util.js';

/**
 * @param {Discord.Intercation} interaction
 */
export async function run(interaction: CommandInteraction): Promise<void> {
    const embed = new MessageEmbed()
    .setTitle('alot of uptime:')
    .setDescription(Util.secondsToDifferenceString(process.alot.uptime as number / 1000, { enableSeconds: true }))
    .setColor('#997a63')
    .setThumbnail((process.alot.user?.displayAvatarURL() as string))
    .setFooter('alot of alots | © adrifcastr', process.alot.user?.displayAvatarURL());
        
    return interaction.reply(embed);
}

export const info: Command['info'] = {
    roles: [],
    user_perms: [],
    bot_perms: []
};

export const data: Command['data'] = {
    name: 'uptime',
    description: 'alot of uptime'
};