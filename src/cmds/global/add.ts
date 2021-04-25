import { CommandInteraction } from 'discord.js';
import { Command } from 'src/@types/Util';

/**
* @param {Discord.CommandInteraction} interaction
*/
export async function run(interaction: CommandInteraction): Promise<void> {
    const url = '';
    return interaction.reply(`[Invite me](<${url}>)`);       
}

export const info: Command['info'] = {
    roles: [],
    user_perms: [],
    bot_perms: []
};

export const data: Command['data'] = {
    name: 'add',
    description: 'alot of oauth2 invite link'
};