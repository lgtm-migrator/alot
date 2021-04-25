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
    interaction.defer();
    
    const canvas = new CanvasPlus();
    const target = 'https://cdn.discordapp.com/avatars/224617799434108928/c81bc5952aa805edf9b38d406fc1c6aa.png';

    const cvs = Canvas.createCanvas(128, 128);

    const imgs: CanvasImgArray[] = [
    { url: target, x: 25, y: 25, sw: 20, sh: 20 },
    { url: target, x: 40, y: 40, sw: 20, sh: 20 },
    ];
      
    for (const item of imgs) {
        const ctx = cvs.getContext('2d');
        const image = await Canvas.loadImage(item.url);
        ctx.drawImage(image, item.x, item.y, item.sw, item.sh);
    }

    const attachment = new MessageAttachment(cvs.toBuffer(), 'target.png');
    return interaction.editReply('test', { files: [attachment]});
    /*
    canvas.load(target, (err: Error) => {
        if (err) {
            Util.log((err.stack as string));
            return interaction.editReply('An error occured.');
        }

        canvas.resize({
            width: 128,
            height: 128,
            mode: 'fit'
        });
    
        canvas.border({
            "size": 1,
            "color": "#000000",
            "mode": "inside"
        });

        canvas.write({ format:'png' }, (err: Error, buf: Buffer) => {
            if (err) {
                Util.log((err.stack as string));
                return interaction.editReply('An error occured.');
            }
    
            const attachment = new MessageAttachment(buf, 'alot.png');

            console.log('hello');

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
/*
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

            //return interaction.editReply(embed);
        });
    
    }); 
    */
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