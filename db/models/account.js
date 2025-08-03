'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.hasMany(models.RoomMember, {
        foreignKey: "account_id",
        as: "rooms"
      });

      Account.hasMany(models.Message, {
        foreignKey: "sender_id",
        as: "messages"
      });
    }
  }
  Account.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    display_name:  {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Account;
};