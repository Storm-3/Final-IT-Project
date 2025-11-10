const { DataTypes, Model } = require("sequelize");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^\+?\d{10,15}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

class Users extends Model {
  static associate(models) {
    Users.belongsTo(models.ResourceDirectories, { foreignKey: "resource_id" });
    Users.belongsTo(models.UserRoles, { foreignKey: "role_id" });
    Users.hasMany(models.Reports, { foreignKey: "user_id", as: "madeReports" });
    Users.hasMany(models.Reports, {
      foreignKey: "assigned_counsellor_id",
      as: "assignedReports",
    });
    Users.belongsToMany(models.Reports, {
      through: models.ReportUsers,
      as: "linkedReports",
    });
    Users.hasMany(models.Messages, {
      foreignKey: "sender_id",
      as: "sentMessages",
      onDelete: "CASCADE",
    });
    Users.hasMany(models.Messages, {
      foreignKey: "recipient_id",
      as: "receivedMessages",
      onDelete: "CASCADE",
    });
    Users.hasMany(models.Articles, { foreignKey: "user_id" });
  }

  static initModel(sequelize) {
    Users.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        sendbird_id: { 
          type: DataTypes.STRING, 
          allowNull: true,
           
        },
        password: { type: DataTypes.STRING, allowNull: true },
        is_anonymous: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        name: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: true, unique: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        role_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // default = survivor
        resource_id: { type: DataTypes.INTEGER, allowNull: true },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "inactive",
          validate: { isIn: [["inactive", "pending", "active"]] },
        },
        isEmailVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        verificationToken: { type: DataTypes.STRING, allowNull: true },
        emergency_contact: { type: DataTypes.STRING, allowNull: true },
      },
      {
        sequelize,
        modelName: "Users",
        tableName: "Users",
        paranoid: true,
        timestamps: true,
        validate: {
          emailvalidation() {
            if (this.email && !emailRegex.test(this.email)) {
              throw new Error("Invalid email format.");
            }
          },
          passwordvalidation() {
            if (this.password && !passwordRegex.test(this.password)) {
              throw new Error(
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number."
              );
            }
          },
          phonevalidation() {
            if (this.phone && !phoneRegex.test(this.phone)) {
              throw new Error("Invalid phone number format.");
            }
          },
        },
      }
    );
  }
}

module.exports = Users;
