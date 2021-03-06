const replyInteraction = require("../util/replyInteraction.js");
const Servers = require("../util/getServersTable.js");

module.exports = {
  name: "bind",
  pattern: /bind/i,
  execute: function(interaction, Client) {
    Servers.create({
      serverId: interaction.guild_id,
      channelId: interaction.channel_id
    })
      .then(created => {
        replyInteraction(
          Client,
          interaction,
          "Phantom's Abyss Catacombs bound to this channel!"
        );
      })
      .catch(error => {
        if (error.name === "SequelizeUniqueConstraintError") {
          Servers.update(
            { channelId: interaction.channel_id },
            { where: { serverId: interaction.guild_id } }
          )
            .then(updated => {
              replyInteraction(Client, interaction, "Bound channel updated!");
            })
            .catch(error => {
              console.log(error);
              replyInteraction(
                Client,
                interaction,
                "There was an error updating the bound channel. It has been logged."
              );
            });
        } else {
          console.log(error);
          replyInteraction(
            Client,
            interaction,
            "There was an error binding to this channel. It has been logged."
          );
        }
      });
  },
  addInteraction: {
    name: "bind",
    description:
      "Bind the bot to a certain channel. This is required for the bot to function."
  }
};
;
