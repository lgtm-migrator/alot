import { CommandInteraction, CommandInteractionOption, MessageEmbed, Permissions, MessageAttachment, Message, TextChannel } from 'discord.js';
import { Command, CanvasImgArray } from 'src/@types/Util';
//@ts-ignore
import CanvasPlus from 'pixl-canvas-plus';
import Canvas from 'canvas';
import Util from '../../Util.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function run(interaction: CommandInteraction, options: CommandInteractionOption[]): Promise<void | Message | null> {
    try {
        interaction.defer();
        
        let target: string | undefined = interaction.user.displayAvatarURL({ format: 'png'});
        if (options[0]?.type === 'USER') target = options[0].user?.displayAvatarURL({ format: 'png'});
        else if (options[0]?.type === 'STRING') {
            if (!(options[0].value as string)?.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)/g)) return interaction.editReply('Please provide a valid image URL!');
            else target = options[0].value as string;
        }
        
        const canvas = new CanvasPlus();
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

                canvas.load(cvs.toBuffer(), async (err: Error) => {
                    if (err) {
                        Util.log((err.stack as string));
                        return interaction.editReply('An error occured.');
                    }
                    
                    const maskimg = await Canvas.loadImage(path.join(__dirname, '../../../data/images/alotbg.png'));

                    canvas.mask({
                        image: maskimg
                    });
               
                    canvas.write({ format: 'png' }, async (err: Error, buffer: Buffer) => {
                        if (err) {
                            Util.log((err.stack as string));
                            return interaction.editReply('An error occured.');
                        }
                        
                        const cv = Canvas.createCanvas(128, 128);
                        const background = await Canvas.loadImage(buffer);
                        const toplayer = await Canvas.loadImage(path.join(__dirname, '../../../data/images/alottoplayer.png'));

                        const ctt = cv.getContext('2d');
                        ctt.drawImage(background, 0, 0, cv.width, cv.height);
                        ctt.drawImage(toplayer, 0, 0, cv.width, cv.height);

                        const attachment = new MessageAttachment(cv.toBuffer(), 'alot.png');

                        if (options.find(x => x.name === 'emoji')?.value === true) {
                            const member = await interaction.guild?.members.fetch(interaction.user);

                            if (member?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS) && interaction.guild?.me?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS)) {
                                const emoji = await interaction.guild?.emojis.create(cv.toBuffer(), 'alotof' + (options[0]?.user?.username ?? interaction.user.username).toLowerCase().replace(/ /g,''));

                                const embed = new MessageEmbed()
                                .setTitle('Here is your alot:')
                                .setDescription(`Your emoji ${emoji} has also been successfully created!`)
                                .setImage('attachment://alot.png')
                                .setColor('#997a63')
                                .attachFiles([attachment])
                                .setFooter('alot of alots | © adrifcastr', process.alot.user?.displayAvatarURL());
                    
                                return interaction.editReply(embed);
                            }
                            else {
                                const embed = new MessageEmbed()
                                .setTitle('Here is your alot:')
                                .setDescription(`Uh-oh, looks like at least one of us doesn't have \`MANAGE_EMOJIS\` set. Anyway, enjoy your alot below.`)
                                .setImage('attachment://alot.png')
                                .setColor('#997a63')
                                .attachFiles([attachment])
                                .setFooter('alot of alots | © adrifcastr', process.alot.user?.displayAvatarURL());
                    
                                return interaction.editReply(embed);
                            }
                        }
                        else {
                            const embed = new MessageEmbed()
                            .setTitle('Here is your alot:')
                            .setDescription('`alotof' + (options[0]?.user?.username ?? interaction.user.username).toLowerCase().replace(/ /g,'') + '`')
                            .setImage('attachment://alot.png')
                            .setColor('#997a63')
                            .attachFiles([attachment])
                            .setFooter('alot of alots | © adrifcastr', process.alot.user?.displayAvatarURL());
                
                            return interaction.editReply(embed);
                        }
                    });
                
                }); 
            }); 
        }); 
    } catch (ex) {
        Util.log(ex.stack);
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
            name: 'emoji',
            description: 'create an emoji of this alot (perms required)',
            type: 'BOOLEAN',
            required: false
        }
    ]
};