import Util from '../../Util.js';
import { Guild, MessageEmbed } from 'discord.js';

export default {
    name: 'guildDelete',
    async run(guild: Guild): Promise<void> {
        const embed = new MessageEmbed()
        .setTitle('Left guild:')
        .setDescription(`Guild: \`${guild.name}\` (${guild.id})\nMembers: \`${guild.members.cache.filter(x => !x.user.bot).size}\` Bots: \`${guild.members.cache.filter(x => x.user.bot).size}\`\nCreated at: \`${guild.createdAt.toDateString()}\`\nOwner: \`${guild.ownerID}\``)
        .setThumbnail((guild.iconURL() as string))
        .setColor('#997a63')
        .setFooter('alot of alots | © adrifcastr', process.alot.user?.displayAvatarURL());
        
        Util.log(embed);
    }
};