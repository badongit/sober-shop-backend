const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redisClient");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async matchPassword(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    }

    isActived() {
      return this.status === "active";
    }

    getAccessToken() {
      return jwt.sign(
        { id: this.id, role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
      );
    }

    async getRefreshToken() {
      const refreshToken = jwt.sign(
        { id: this.id, role: this.role },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
        }
      );

      await redisClient.set(this.id.toString(), refreshToken);

      return refreshToken;
    }

    static associate(models) {
      this.hasMany(models.Feedback, {
        foreignKey: "userId",
        as: "feedbacks",
      });

      this.hasMany(models.Cart, {
        foreignKey: "userId",
        as: "carts",
      });

      this.hasMany(models.Order, {
        foreignKey: "userId",
        as: "orders",
      });

      this.hasMany(models.Order, {
        foreignKey: "shipperId",
        as: "billsOfLading",
      });

      this.hasMany(models.Message, {
        foreignKey: "senderId",
        as: "messages",
      });

      this.hasMany(models.RechargeHistory, {
        foreignKey: "userId",
        as: "rechargeHistories",
      });

      this.hasOne(models.Conversation, {
        foreignKey: "userId",
        as: "conversation",
      });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Please enter your username",
          },
          len: {
            args: [8, 20],
            msg: "Your username is too long",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your password",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Entered wrong email format",
          },
          notNull: {
            msg: "Please enter your email",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          is: {
            args: /^[0-9]{10,11}$/,
            msg: "Entered wrong phone number format",
          },
        },
      },
      address: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
          isIn: {
            args: [["user", "admin", "shipper"]],
            msg: "This role is not supported",
          },
        },
      },
      displayName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Display name is empty",
          },
        },
      },
      balance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
        validate: {
          isGreaterThanEqualZero(value) {
            if (+value < 0) {
              throw new Error("Your balance is not enough");
            }
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
        validate: {
          isIn: {
            args: [["active", "inactive"]],
            msg: "This status is not supported",
          },
        },
      },
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpire: DataTypes.DATE,
    },
    {
      scopes: {
        forClient: {
          attributes: {
            exclude: ["password", "resetPasswordToken", "resetPasswordExpire"],
          },
        },
      },
      hooks: {
        beforeCreate: async (user, options) => {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user, options) => {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
      },
      sequelize,
      modalName: "User",
    }
  );

  return User;
};
