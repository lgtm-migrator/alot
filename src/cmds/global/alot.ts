import { CommandInteraction, MessageEmbed, MessageAttachment } from 'discord.js';
import { Command, CanvasImgArray } from 'src/@types/Util';
//@ts-ignore
import CanvasPlus from 'pixl-canvas-plus';
import Canvas from 'canvas';
import Util from '../../Util.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function run(interaction: CommandInteraction): Promise<void> {
    try {
        interaction.defer();
    
        const canvas = new CanvasPlus();
        const target = interaction.user.displayAvatarURL({ format: 'png'});
        const cvs = Canvas.createCanvas(128, 128);

        canvas.load(target, (err: Error) => {
            if (err) {
                Util.log((err.stack as string));
                return interaction.editReply('An error occured.');
            }
        
            canvas.border({
                "size": 2,
                "color": "#000000",
                "mode": "inside"
            });
    
            canvas.write({ format:'png' }, async (err: Error, buf: Buffer) => {
                if (err) {
                    Util.log((err.stack as string));
                    return interaction.editReply('An error occured.');
                }
        
                const ctx = cvs.getContext('2d');
                const background = await Canvas.loadImage(path.join(__dirname, '../../../data/images/alotbg.png'));
                ctx.drawImage(background, 0, 0, cvs.width, cvs.height);

                const imgs: CanvasImgArray[] = [
                { img: buf, x: 0, y: 0 }, { img: buf, x: 0, y: 23 }, { img: buf, x: 0, y: 43 }, 
                { img: buf, x: 0, y: 63 }, { img: buf, x: 0, y: 83 }, { img: buf, x: 0, y: 103 },
                { img: buf, x: 0, y: 119 }, { img: buf, x: 23, y: 0 }, { img: buf, x: 23, y: 23 }, 
                { img: buf, x: 23, y: 43 }, { img: buf, x: 23, y: 63 }, { img: buf, x: 23, y: 83 },
                { img: buf, x: 23, y: 103 }, { img: buf, x: 23, y: 119 }, { img: buf, x: 43, y: 0 }, 
                { img: buf, x: 43, y: 23 }, { img: buf, x: 43, y: 43 }, { img: buf, x: 43, y: 63 },
                { img: buf, x: 43, y: 83 }, { img: buf, x: 43, y: 103 }, { img: buf, x: 43, y: 119 }, 
                { img: buf, x: 63, y: 0 }, { img: buf, x: 63, y: 23 }, { img: buf, x: 63, y: 43 },
                { img: buf, x: 63, y: 63 }, { img: buf, x: 63, y: 83 }, { img: buf, x: 63, y: 103 }, 
                { img: buf, x: 63, y: 119 }, { img: buf, x: 83, y: 0 }, { img: buf, x: 83, y: 23 },
                { img: buf, x: 83, y: 43 }, { img: buf, x: 83, y: 63 }, { img: buf, x: 83, y: 83 }, 
                { img: buf, x: 83, y: 103 }, { img: buf, x: 83, y: 119 }, { img: buf, x: 105, y: 0 },
                { img: buf, x: 105, y: 23 }, { img: buf, x: 105, y: 43 },{ img: buf, x: 105, y: 63 }, 
                { img: buf, x: 105, y: 83 }, { img: buf, x: 105, y: 103 }, { img: buf, x: 105, y: 119 },
                ];
                
                for (const item of imgs) {
                    const ctx = cvs.getContext('2d');
                    const image = await Canvas.loadImage(item.img);
                    ctx.drawImage(image, item.x, item.y, 25, 25);
                }

                canvas.load(cvs.toBuffer(), (err: Error) => {
                    if (err) {
                        Util.log((err.stack as string));
                        return interaction.editReply('An error occured.');
                    }
            
                    canvas.mask({
                        image: 'https://media.discordapp.net/attachments/709062739581992971/835951798828269608/alot.png'
                    });
               
                    canvas.write({ format:'png' }, (err: Error, buffer: Buffer) => {
                        if (err) {
                            Util.log((err.stack as string));
                            return interaction.editReply('An error occured.');
                        }
                
                        const attachment = new MessageAttachment(buffer, 'alot.png');
            
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
            }); 
        }); 
    } catch (ex) {
        Util.log(ex);
        return interaction.editReply('An error ocurred!');
    }
}

export const info: Command['info'] = {
    roles: [],
    user_perms: [],
    bot_perms: []
};

export const data: Command['data'] = {
    name: 'alot',
    description: 'make alot of alots',
    options: [
        {
            name: 'user',
            description: 'alot of this user',
            type: 'USER',
            required: false
        },
        {
            name: 'image',
            description: 'alot of this image url',
            type: 'STRING',
            required: false
        },
        {
            name: 'emote',
            description: 'create an emote of this alot (perms required)',
            type: 'BOOLEAN',
            required: false
        }
    ]
};