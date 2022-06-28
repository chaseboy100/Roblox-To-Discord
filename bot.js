var Discord = require('discord.js');
var rbxbot = require('noblox.js');
var bot = new Discord.Client();
const fs = require('fs')
var config = require('./config.json')
bot.commands = new Discord.Collection()
const fetch = require("node-fetch");
const {message} = require("noblox.js");

const commandfiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'));

for (const file of commandfiles){
    const command = require(`./Commands/${file}`)
    bot.commands.set(command.name,command);
}

bot.on ('message', (message) => {

var msg = message.content.toLocaleLowerCase()
var prefix = "!"
var args = message.content.split(/ +/)

if(message.author.bot) return;
if(message.channel.type === 'dm') return ;

if (msg.startsWith(prefix + 'userinfo')){
    bot.commands.get('UserInfo').execute(message,msg);
}

if (msg.startsWith(prefix + 'rank')) {
    if(message.member.roles.cache.has(config.RoleID)){
    bot.commands.get('Rank').execute(message,msg,args,config);}

    else message.reply("You Don't Have Perms To Use This")
}

if(msg.startsWith(prefix + 'payrobux'))return bot.commands.get('PayRobux').execute(message,msg,args);


if(msg.startsWith(prefix + 'shout'))return bot.commands.get('GroupShout').execute(message,msg,args);

const { MessageEmbed } = require("discord.js")
if(msg.startsWith(prefix + 'help')) {
    let embed = new MessageEmbed()
    .setTitle("Command List")
    .setDescription("**!payrobux{user}{ammount}**,  **!userinfo{user}**,    **!rank{user}{rank}**,  **!shout{msg}**")
    message.channel.send(embed)
    }

});







bot.on('ready', () => {

    console.log("The Bot Is Online!")

});







bot.on ('ready', async() => {
    bot.user.setActivity("Enjoy!", {type : "WATCHING"})
    await rbxbot.setCookie(config.Cookie)
    .then(async(success) => { // Required if the group's shout is private
        console.log('Logged in.');
 
        let onShout = rbxbot.onShout(config.GroupID);
 
        onShout.on('data', async function(post) {
            console.log("New Shout")
 
    function GetAvatarURL(user)
    {
        return new Promise((resolve, reject) => 
        {
            fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?format=Png&isCircular=false&size=352x352&userIds=${user}`)
            .then(res => res.json())
            .then(json => {
              resolve (json.data[0].imageUrl)
            })
            .catch(reject);
        });
    }

    const pw = post.body.toLowerCase()



    if (pw.includes("training") && pw.includes("over") == false && pw.includes("conclude") == false && pw.includes("end") == false) {
        console.log("Training!")
        let avatarurl = await (GetAvatarURL(post.poster.userId))
        const shoutchannel = await bot.guilds.cache.get(config.ServerID).channels.cache.get(config.ChannelID)
        const vc = await bot.guilds.cache.get(config.ServerID).channels.cache.get(config.VcID)
        const embed = new Discord.MessageEmbed()
            .setTitle('A Training is Being Hosted!')
            .setURL("https://www.roblox.com/games/8232411/Innovation-Security-Training-Facility")
            .addField('Host:', post.poster.username, true)
            .setThumbnail(avatarurl)
        shoutchannel.send("@everyone")
        shoutchannel.send(embed)
        vc.setName("Training In Progress #trainings")

        console.log(`${post.poster.username} posted ${post.body}`)
    }

            if (pw.includes("over") || pw.includes("conclude") || pw.includes("end")) {
                console.log("Training Over!")
                let avatarurl = await (GetAvatarURL(post.poster.userId))
                const shoutchannel = await bot.guilds.cache.get(config.ServerID).channels.cache.get(config.ChannelID)
                const vc = await bot.guilds.cache.get(config.ServerID).channels.cache.get(config.VcID)
                const embed = new Discord.MessageEmbed()
                    .setTitle('Training is Now Over!')
                    .addField('Host:', post.poster.username, true)
                    .setThumbnail(avatarurl)
                await vc.setName("Training Not In Progress")
                shoutchannel.send(embed)

                console.log(`${post.poster.username} posted ${post.body}`)
            }
});
 
onShout.on('error', function (err) {
    //console.log(err.message);
});
 
 
 
        })  
 
    .catch((err) => console.error(err.message)); 
    
 
});






bot.login(config.Token)
