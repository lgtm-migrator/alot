import { CommandInteraction } from 'discord.js';
import { Command } from 'src/@types/Util';

export async function run(interaction: CommandInteraction): Promise<void> {
    const url = 'https://discord.com/api/oauth2/authorize?client_id=835992696610488380&permissions=1073741824&scope=bot%20applications.commands';
    return interaction.reply(`[Invite me](<${url}>)`);       
}

export const info: Command['info'] = {
    roles: [],
    user_perms: [],
    bot_perms: []
};

export const data: Command['data'] = {
    name: 'invite',
    description: 'invite alot of alots'
};