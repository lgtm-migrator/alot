import { CommandInteraction, MessageEmbed, MessageAttachment } from 'discord.js';
import { Command } from 'src/@types/Util';
//@ts-ignore
import CanvasPlus from 'pixl-canvas-plus';
import Util from '../../Util.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function run(interaction: CommandInteraction): Promise<void> {
    interaction.defer();
    
    const canvas = new CanvasPlus();

    canvas.load(path.join(__dirname, '../../../data/images/alotbg.png'), (err: Error) => {
        if (err) {
            Util.log((err.stack as string));
            return interaction.editReply('An error occured.');
        }
    /*
        // Note: You will have to load 'MY_MASK_IMAGE' separately.
        canvas.mask({
            image: '../../../data/images/alotbg.png'
        });
    */
        canvas.write({ format:'png' }, (err: Error, buf: Buffer) => {
            if (err) {
                Util.log((err.stack as string));
                return interaction.editReply('An error occured.');
            }
    
            const attachment = new MessageAttachment(buf, 'alot.png');

            const embed = new MessageEmbed()
            .setTitle('Here is your alot:')
            .setDescription(`alotofdebugging`)
            .setImage('attachment://alot.png')
            .setColor('#997a63')
            .attachFiles([attachment])
            .setFooter('alot of alots | © adrifcastr', process.alot.user?.displayAvatarURL());

            return interaction.editReply(embed);
        });
    
    }); 
}

export const info: Command['info'] = {
    roles: [],
    user_perms: [],
    bot_perms: []
};

export const data: Command['data'] = {
    name: 'alot',
    description: 'make alot of alots'
};