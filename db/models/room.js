'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.hasMany(models.RoomMember, {
        foreignKey: "room_id",
        as: "members"
      });

      Room.hasMany(models.Message, {
        foreignKey: "room_id",
        as: "messages"
      });
    }
  }
  Room.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms',               
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Room;
};