const {sequelizeCon,DataTypes,Model}=require("../config/databaseConfig");
const bcrypt = require('bcrypt');
class User extends Model{
    async validPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
};
User.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    mobile:{
        type:DataTypes.STRING,
        allowNull:true
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isAdmin:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    role:{
        type:DataTypes.STRING,
        defaultValue:"User",
        enum:['Admin','User']
        
    },
    profilePic:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:"https://avatar.iran.liara.run/public"
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    tokenVersion: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
},{
    tableName:"users",
    modelName:"User",
    sequelize:sequelizeCon,
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        }
    },
    timestamps:true
});


module.exports=User;