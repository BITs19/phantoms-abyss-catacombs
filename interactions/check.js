const Discord = require("discord.js");
const Players = require("../util/getPlayerTable.js");
const replyInteraction = require("../util/replyInteraction.js");

module.exports = {
  name: "check",
  pattern: /\bcheck\b/i,
  execute: async function(interaction, Client) {
    Players.sync();

    let userId;
    if (interaction.data.options) {
      userId = interaction.data.options[0].value;
    } else {
      userId = interaction.member.user.id;
    }
    const record = await Players.findOne({ where: { id: userId } });
    if (!record)
      return replyInteraction(
        Client,
        interaction,
        "That person isn't a player!"
      );
    const guild = await Client.guilds.fetch(interaction.guild_id);
    const member = await guild.members.fetch(userId);
    const avatar = (await Client.users.fetch(userId)).avatarURL();
    let embed = new Discord.MessageEmbed()
      //.setAuthor(member.displayName, avatar)
      .setThumbnail(avatar)
      .setTitle(member.displayName)
      .addFields([
        {
          name: "Level",
          value: record.level
        },
        {
          name: "Score",
          value: record.score
        },
        {
          name: "Lives",
          value: record.lives
        },
        /*{
          name: "Holding",
          value:
            record.holding != null
              ? require("../util/holdables.js")[record.holding]
              : "Nothing"
        },*/
        {
          name: "Energized",
          value: record.energized ? "Yes" : "No"
        }
      ]);
    replyInteraction(Client, interaction, "", [embed]);
  },
  addInteraction: {
    name: "check",
    description: "Check the status of a player.",
    options: [
      {
        type: 9,
        name: "player",
        description: "Player to check. If left blank, will check you",
        required: false
      }
    ]
  }
};
