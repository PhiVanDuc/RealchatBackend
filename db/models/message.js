'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Room, {
        foreignKey: 'room_id',
        as: "room"
      });

      Message.belongsTo(models.Account, {
        foreignKey: 'sender_id',
        as: "sender"
      });

      Message.belongsTo(models.Message, {
        foreignKey: 'replied_message_id',
        as: "replied_message"
      });
    }
  }
  Message.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    replied_message_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Message;
};