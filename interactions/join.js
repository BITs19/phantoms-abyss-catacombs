const Sequelize = require("sequelize");
//const { Op } = require("sequelize");
const sequelize = new Sequelize(
  "database",
  process.env.DBUSERNAME,
  process.env.DBPASSWORD,
  {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite"
  }
);

const Players = sequelize.define("players", {
  id: {
    type: Sequelize.STRING(25),
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  carrying: {
    type: Sequelize.INTEGER(1),
    defaultValue: null
  },
  score: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  lives: {
    type: Sequelize.INTEGER(1),
    defaultValue: 3
  }
});

const Servers = sequelize.define("Servers", {
  serverId: {
    type: Sequelize.STRING(25),
    primarykey: true,
    allowNull: false,
    unique: true
  },
  channelId: {
    type: Sequelize.STRING(25),
    allowNull: false
  },
  prefix: {
    type: Sequelize.STRING(5),
    allowNull: false,
    defaultValue: "!"
  }
});

Players.belongsTo(Servers);

module.exports = {
  name: "join",
  pattern: /join/i,
  execute: async function(interaction, Client) {
    Players.sync();
    if (await Servers.findOne({ where: { serverId: interaction.guild_id } })) {
      Players.create({
        id: interaction.member.user.id,
        serversId: interaction.guild_id
      })
        .then(record => {
          Client.api
            .interactions(interaction.id, interaction.token)
            .callback.post({
              data: {
                type: 4,
                data: {
                  content: "Added Sucessfully!"
                }
              }
            });
        })
        .catch(error => {
          if (error.name === "SequelizeUniqueConstraintError") {
            Client.api
              .interactions(interaction.id, interaction.token)
              .callback.post({
                data: {
                  type: 4,
                  data: {
                    content: "You're already in the game!"
                  }
                }
              });
          } else {
            console.log(error);
            Client.api
              .interactions(interaction.id, interaction.token)
              .callback.post({
                data: {
                  type: 4,
                  data: {
                    content:
                      "There was an error executing that command. It has been logged."
                  }
                }
              });
          }
        });
    } else {
      Client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content:
              "Phantom's Abyss Catacombs must be /bind ed before it can be used"
          }
        }
      });
    }
  },
  addInteraction: {
    name: "join",
    description: "Begin your adventure in the Phantom's Abyss Catacombs!!"
  }
};