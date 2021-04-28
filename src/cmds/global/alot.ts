import { CommandInteraction, CommandInteractionOption, MessageEmbed, Permissions, MessageAttachment, Message, TextChannel } from 'discord.js';
import { Command } from 'src/@types/Util';
//@ts-ignore
import CanvasPlus from 'pixl-canvas-plus';
import Canvas from 'canvas';
import Util from '../../Util.js';
//@ts-ignore
import resizeImg from 'resize-image-buffer';
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
        const cvs = Canvas.createCanvas(530, 476);
        const ctx = cvs.getContext('2d');
        const image = await Canvas.loadImage(target as string);
        const tvs = Canvas.createCanvas(image.width + ((25 / 100) * image.width), image.height + ((25 / 100) * image.height));

        let glowColor = "black";
        let imgData, tdata: any;

        const defineNonTransparent = (x: number, y: number) => {
            let a = tdata[(y * tvs.width + x) * 4 + 3];
            return (a > 20);
        }

        const ttx = tvs.getContext('2d');
        ttx.drawImage(image, 0, 0);

        // grab the image's pixel data
        imgData = ttx.getImageData(0, 0, tvs.width, tvs.height);
        tdata = imgData.data;
        let geom: any = {};

        (function() {
            // d3-plugin for calculating outline paths
            // License: https://github.com/d3/d3-plugins/blob/master/LICENSE
             
            geom.contour = function(grid: any, start: any) { 
              let s = start || d3_geom_contourStart(grid), // starting point 
                  c = [],    // contour polygon 
                  x = s[0],  // current x position 
                  y = s[1],  // current y position 
                  dx = 0,    // next x direction 
                  dy = 0,    // next y direction 
                  pdx = NaN, // previous x direction 
                  pdy = NaN, // previous y direction 
                  i = 0; 
          
              do { 
                // determine marching squares index 
                i = 0; 
                if (grid(x-1, y-1)) i += 1; 
                if (grid(x,   y-1)) i += 2; 
                if (grid(x-1, y  )) i += 4; 
                if (grid(x,   y  )) i += 8; 
          
                // determine next direction 
                if (i === 6) { 
                  dx = pdy === -1 ? -1 : 1; 
                  dy = 0; 
                } else if (i === 9) { 
                  dx = 0; 
                  dy = pdx === 1 ? -1 : 1; 
                } else { 
                  dx = d3_geom_contourDx[i]; 
                  dy = d3_geom_contourDy[i]; 
                } 
          
                // update contour polygon 
                if (dx != pdx && dy != pdy) { 
                  c.push([x, y]); 
                  pdx = dx; 
                  pdy = dy; 
                } 
          
                x += dx; 
                y += dy; 
              } while (s[0] != x || s[1] != y); 
          
              return c; 
            }; 
          
            // lookup tables for marching directions 
            let d3_geom_contourDx = [1, 0, 1, 1,-1, 0,-1, 1,0, 0,0,0,-1, 0,-1,NaN], 
                d3_geom_contourDy = [0,-1, 0, 0, 0,-1, 0, 0,1,-1,1,1, 0,-1, 0,NaN]; 
          
            function d3_geom_contourStart(grid: any) { 
              var x = 0, 
                  y = 0; 
          
              // search for a starting point; begin at origin 
              // and proceed along outward-expanding diagonals 
              while (true) { 
                if (grid(x,y)) { 
                  return [x,y]; 
                } 
                if (x === 0) { 
                  x = y + 1; 
                  y = 0; 
                } else { 
                  x = x - 1; 
                  y = y + 1; 
                } 
              } 
            } 
          
        })();

        const points = geom.contour(defineNonTransparent);

        ttx.clearRect(0, 0, tvs.width, tvs.height);

        const drawOutline = (points: any, offsetX: any) => {
            // draw results
            ttx.beginPath();
            ttx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                let point = points[i];
                ttx.lineTo(point[0], point[1]);
            }
            ttx.closePath();
            ttx.stroke();
        }

        // use shadowing to apply glow to the outline
        ttx.save();
        ttx.strokeStyle = glowColor;
        ttx.shadowColor = glowColor;
        for (let i = 0; i < 10; i++) {
            ttx.shadowBlur = i * 2;
            drawOutline(points, 0);
        }
        ttx.shadowBlur = 15;
        drawOutline(points, 0);
        ttx.restore();
    
        // redraw the image into the glow outline
        ttx.drawImage(image, 0, 0);
        const outlinedimg = await Canvas.loadImage(tvs.toBuffer());

        for (let i = 0; i < 550; i++) { // 'pattern' aka just draw this alot until it covers everything randomly
            ctx.drawImage(outlinedimg, Math.random() * (531 - 0) + 0, Math.random() * (477 - 0) + 0, 120, 120);
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
                
            const background = await Canvas.loadImage(buffer);
            const toplayer = await Canvas.loadImage(path.join(__dirname, '../../../data/images/alottoplayer.png'));

            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(background, 0, 0, cvs.width, cvs.height);
            ctx.drawImage(toplayer, 0, 0, cvs.width, cvs.height);

            const attachment = new MessageAttachment(cvs.toBuffer(), 'alot.png');
            Util.IncreaseStat('created_alots');
            
            let alotstring = '';
            if (options.find(x => x.name === 'image')) alotstring = '';
            else if (options.find(x => x.name === 'user')) alotstring = '`alotof' + options.find(x => x.name === 'user')?.user?.username.toLowerCase().replace(/ /g,'') + '`';
            else alotstring = '`alotof' + interaction.user.username.toLowerCase().replace(/ /g,'') + '`';

            if (options.find(x => x.name === 'emoji')?.value === true) {
                const member = await interaction.guild?.members.fetch(interaction.user);

                if (member?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS) && interaction.guild?.me?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS)) {
                    const emojiimg = await resizeImg(cvs.toBuffer(), {
                        width: 265,
                        height: 238,
                      });
                    const emoji = await interaction.guild?.emojis.create(emojiimg, 'alotofsomething');

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