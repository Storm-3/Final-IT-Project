const { DataTypes, Model } = require('sequelize');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^\+?\d{10,15}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

class Users extends Model {
    static associate(models) {
        // User <-o ResourceDirectory
        Users.belongsTo(models.ResourceDirectories, { foreignKey: 'resource_id' });
        
        // User <-o UserRole
        Users.belongsTo(models.UserRoles, { foreignKey: 'role_id' });

        // User o-> Reports (as reporter)
        Users.hasMany(models.Reports, { foreignKey: 'user_id', as: 'madeReports' });

        // User o-> Reports (as assigned counsellor)
        Users.hasMany(models.Reports, { foreignKey: 'assigned_counsellor_id', as: 'assignedReports' });

        // User o<-o Reports (linked)
        Users.belongsToMany(models.Reports, { through: models.ReportUsers, as: 'linkedReports' });

        // User o-> Messages (as sender)
        Users.hasMany(models.Messages, {
            foreignKey: 'sender_id',
            as: 'sentMessages',
            onDelete: 'CASCADE' // making sure every message related to user is (soft) deleted
        });

        // User o-> Messages (as recipient)
        Users.hasMany(models.Messages, {
            foreignKey: 'recipient_id',
            as: 'receivedMessages',
            onDelete: 'CASCADE' // making sure every message related to user is (soft) deleted
        });
        //User o-> Articles
        Users.hasMany(models.Articles, {foreignKey: 'user_id'});

        const { Model } = require('sequelize');

        console.log('🔍 Users.associate called');
        console.log('🔍 models.UserRoles:', models.UserRoles);
        console.log('🔍 Is UserRoles a subclass of Model?', models.UserRoles?.prototype instanceof Model);
        
        if (models.UserRoles?.prototype instanceof Model) {
            Users.belongsTo(models.UserRoles, { foreignKey: 'role_id' });
            } else {
            console.warn('UserRoles is not a valid Sequelize model at association time');
            }


    }

    static initModel(sequelize) {
        Users.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            sendbird_id: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true
            },
            is_anonymous: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1 // 1 is survivor
                // references: { model: 'UserRoles', key: 'id' }
            },
            resource_id: {
                type: DataTypes.INTEGER,
                allowNull: true
                // references: { model: 'ResourceDirectory', key: 'id' }
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'inactive',
                validate: {
                isIn: [['inactive', 'pending', 'active']] 
                }
            },
            isEmailVerified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            verificationToken:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            emergency_contact:{
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            modelName: 'Users',
            tableName: 'Users',
            paranoid: true,
            timestamps: true,

            // Validation logic
            validate: {
                validateUserFields() {
                    if (this.role_id === 2) {
                        if (!this.name || !this.password || !this.email || !this.phone || !this.resource_id) {
                            throw new Error('Counsellors are required to provide their name, email, phone numbers, and must be affiliated with a partnering organisation.');
                        }
                    } else if (this.role_id === 3) {
                        if (!this.name || !this.email || !this.password) {
                            throw new Error('Admins are required to provide their name and email.');
                        }
                    }

                    if (this.role_id !== 1){
                        if (this.emergency_contact !== null){
                            throw new Error('Only survivors can have emergency contacts');
                        }
                    }
                },

                emailvalidation() {
                    if (this.email && !emailRegex.test(this.email)) {
                        throw new Error('Invalid email.');
                    }
                },

                phonevalidation() {
                    if (this.phone && !phoneRegex.test(this.phone)) {
                        throw new Error('Invalid phone');
                    }
                    if (this.emergency_contact && !phoneRegex.test(this.emergency_contact)) {
                        throw new Error('Invalid emergency contact');
                    }
                    // front: no dashes, no letters.
                    // front: for email and phone, use placeholders
                },

                passwordvalidation() {
                    if (this.password && !passwordRegex.test(this.password)) {
                        throw new Error('Invalid password.');
                    }
                    // front: Min 8 character, One Uppercase letter, One Lowercase Letter, one Number
                },

                emailRequiredForNamedUser() {
                    if (!this.is_anonymous && !this.email) {
                        throw new Error('Named users must have an email');
                    }
                }
            }
        });
    }
}

module.exports = Users;

