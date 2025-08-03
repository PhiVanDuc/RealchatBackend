'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomMember extends Model {
    static associate(models) {
      RoomMember.belongsTo(models.Room, {
        foreignKey: "room_id",
        as: "room"
      });

      RoomMember.belongsTo(models.Account, {
        foreignKey: "account_id",
        as: "member"
      });
    }
  }
  RoomMember.init({
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
    account_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'RoomMember',
    tableName: 'room_members',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return RoomMember;
};