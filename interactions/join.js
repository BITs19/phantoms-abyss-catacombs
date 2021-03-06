const Players = require("../util/getPlayerTable.js");
const Servers = require("../util/getServersTable.js");
const replyInteraction = require("../util/replyInteraction.js");
const Ghosts = require("../util/getGhostsTable.js");

module.exports = {
  name: "join",
  pattern: /join/i,
  execute: async function(interaction, Client) {
    Players.sync();
    Servers.sync();
    Ghosts.sync();

    Players.create({
      id: interaction.member.user.id,
      serversId: interaction.guild_id
    })
      .then(record => {
        try {
          Ghosts.bulkCreate([
            {
              subId: 0,
              active: true,
              serverId: interaction.guild_id,
              playerId: interaction.member.user.id
            },
            {
              subId: 1,
              serverId: interaction.guild_id,
              playerId: interaction.member.user.id
            },
            {
              subId: 2,
              serverId: interaction.guild_id,
              playerId: interaction.member.user.id
            },
            {
              subId: 3,
              serverId: interaction.guild_id,
              playerId: interaction.member.user.id
            }
          ]);
        } catch (error) {
          console.log(error);
          replyInteraction(
            Client,
            interaction,
            "There was an error adding the ghosts. It has been logged."
          );
        }

        replyInteraction(
          Client,
          interaction,
          "Added Sucessfully! Use /room to look around yourself"
        );
      })
      .catch(error => {
        if (error.name === "SequelizeUniqueConstraintError") {
          replyInteraction(Client, interaction, "You're already in the game!");
        } else {
          console.log(error);
          replyInteraction(
            Client,
            interaction,
            "There was an error executing that command. It has been logged "
          );
        }
      });
  },
  addInteraction: {
    name: "join",
    description: "Begin your adventure in the Phantom's Abyss Catacombs!!"
  }
};
