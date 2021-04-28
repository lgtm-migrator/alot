import { CommandInteraction, CommandInteractionOption, MessageEmbed, Permissions, MessageAttachment, Message, TextChannel } from 'discord.js';
import { Command } from 'src/@types/Util';
//@ts-ignore
import CanvasPlus from 'pixl-canvas-plus';
import Canvas from 'canvas';
import Util from '../../Util.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function run(interaction: CommandInteraction, options: CommandInteractionOption[]): Promise<void | Message | null> {
    try {
        let target: string | undefined = interaction.user.displayAvatarURL({ format: 'png'});
        if (options[0]?.type === 'USER') target = options[0].user?.displayAvatarURL({ format: 'png'});
        else if (options[0]?.type === 'STRING') {
            if (!(options[0].value as string)?.match(/(https?:)?\/\/?[^'"<>]+?\.(jpg|jpeg|png)/g)) return interaction.editReply('Please provide a valid image URL!');
            else target = encodeURI(options[0].value as string);
        }
        
        const canvas = new CanvasPlus();
        const cvs = Canvas.createCanvas(128, 128);
        const image = await Canvas.loadImage(target as string);

        for (let i = 0; i < 400; i++) { // 'pattern' aka just draw this alot until it covers everything randomly
            const ctx = cvs.getContext('2d');
            ctx.drawImage(image, Math.random() * (129 - 0) + 0, Math.random() * (129 - 0) + 0, 30, 30);
        }

        canvas.load(cvs.toBuffer(), async (err: Error) => {
            if (err) {
                Util.log((err.message as string));
                return interaction.editReply('An error occured. Please make sure that the URL is well formed.');
            }
            
            const maskimg = await Canvas.loadImage(path.join(__dirname, '../../../data/images/alotbg.png'));

            canvas.mask({
                image: maskimg
            });
               
            canvas.write({ format: 'png' }, async (err: Error, buffer: Buffer) => {
            if (err) {
                Util.log((err.message as string));
                return interaction.editReply('An error occured. Please make sure that the URL is well formed.');
            }
                
            const cv = Canvas.createCanvas(128, 128);
            const background = await Canvas.loadImage(buffer);
            const toplayer = await Canvas.loadImage(path.join(__dirname, '../../../data/images/alottoplayer.png'));

            const ctt = cv.getContext('2d');
            ctt.drawImage(background, 0, 0, cv.width, cv.height);
            ctt.drawImage(toplayer, 0, 0, cv.width, cv.height);

            const attachment = new MessageAttachment(cv.toBuffer(), 'alot.png');
            Util.IncreaseStat('created_alots');
            
            let alotstring = '';
            if (options.find(x => x.name === 'image')) alotstring = '';
            else if (options.find(x => x.name === 'user')) alotstring = '`alotof' + options.find(x => x.name === 'user')?.user?.username.toLowerCase().replace(/ /g,'') + '`';
            else alotstring = '`alotof' + interaction.user.username.toLowerCase().replace(/ /g,'') + '`';

            if (options.find(x => x.name === 'emoji')?.value === true) {
                const member = await interaction.guild?.members.fetch(interaction.user);

                if (member?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS) && interaction.guild?.me?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS)) {
                    const emoji = await interaction.guild?.emojis.create(cv.toBuffer(), 'alotofsomething');

                    const embed = new MessageEmbed()
                    .setTitle('Here is your alot:')
                    .setDescription(`Your emoji ${emoji} has also been successfully created!`)
                    .setImage('attachment://alot.png')
                    .setColor('#997a63')
                    .attachFiles([attachment])
                    .setFooter('alot of alots | © adrifcastr', process.alot.user?.displayAvatarURL());
                    if (interaction.guildID !== '835430397033578497') embed.addField('Want more?', 'There\'s <:alot:835434140496429057> over at [Alot of Emojis](https://discord.gg/8KRmyaMewe)!');
    
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
                    if (interaction.guildID !== '835430397033578497') embed.addField('Want more?', 'There\'s <:alot:835434140496429057> over at [Alot of Emojis](https://discord.gg/8KRmyaMewe)!');

                    return interaction.editReply(embed);
                }
            }
            else {
                const embed = new MessageEmbed()
                .setTitle('Here is your alot:')
                .setDescription(alotstring)
                .setImage('attachment://alot.png')
                .setColor('#997a63')
                .attachFiles([attachment])
                .setFooter('alot of alots | © adrifcastr', process.alot.user?.displayAvatarURL());
                if (interaction.guildID !== '835430397033578497') embed.addField('Want more?', 'There\'s <:alot:835434140496429057> over at [Alot of Emojis](https://discord.gg/8KRmyaMewe)!');

                return interaction.editReply(embed);
            }
        });
    
    }); 
    } catch (ex) {
        Util.log(ex.message);
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
    description: 'make alot of things',
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