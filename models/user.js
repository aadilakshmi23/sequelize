'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Here to store the name of the user",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        if (value) {
          this.setDataValue('email', value.toLowerCase());
        }
      }
    },
    gender: {
      type: DataTypes.ENUM(['male', 'female']),
      allowNull: false,
      defaultValue: 'female'
    },
    phone: {
      type: DataTypes.NUMBER,
      allowNull: true,         // Change to false if the field is mandatory
      unique: true         // Change to true if phone numbers must be unique
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,
  });
  return User;
};