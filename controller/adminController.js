const User=require("../model/UserModel");
// const Task=require("../models/TaskModel");
const ErrorHandler = require('../utility/ErrorHandler');
const sendResponse = require('../utility/sendResponse');
const { Sequelize, Op } = require("sequelize");
exports.getAllUsers = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = limit * (page - 1);
        const { search } = req.query;
        const query = {};
        if (search) {
            query[Op.or] = [
                { name: { [Op.like]: '%' + search + '%' } },
                { email: { [Op.like]: '%' + search + '%' } },
                { mobile: { [Op.like]: '%' + search + '%' } },
            ];
        }       

        const totalUsers = await User.count({ where: query });

        let users=[]
        users = await User.findAll({ 
            where: query,
            limit: limit,
            offset: offset
        });
        for(let i=0;i<users.length;i++){
            users[i].password=undefined
        }
        if(!users){
            return next(new ErrorHandler("Users not found",200));
        }
        const data=await Promise.all(users.map(async (user)=>{
            // const countUserTask=await Task.findAll({where:{userId:user.id}});
            return {
                ...user.dataValues,
                // taskCount:countUserTask.length,
                // completedTaskCount:countUserTask.filter(task=>task.completed===true).length,
                // incompleteTaskCount:countUserTask.filter(task=>task.completed===false).length

            }
        }))
        const pagination = {};
        pagination.limit = limit;
        pagination.page = page;
        pagination.pages = Math.ceil(totalUsers / limit);
        pagination.nextPage = parseInt(page) < pagination.pages ? parseInt(page) + 1 : null;
        pagination.prevPage = page > 1 ? parseInt(page) - 1 : null;
        pagination.hasPrevPage = page > 1;
        pagination.hasNextPage = page < pagination.pages;
        console.log("aaya")

    data.push(pagination);
        sendResponse({
            res,
            message: "Users Fetched Successfully",
            data: data,
          });
    } catch (error) {
        console.log("error",error)
        return next(new ErrorHandler(error.message,500));
    }
};

exports.getUserById=async(req, res, next) => {
    try{
        const userId = req.user.id;
        console.log("--------", userId, "-----------"); // Log userId to verify
        const user = await User.findOne({ where: { id: userId } });
        if(!user){
            return next(new ErrorHandler("User not found",404));
        }
        user.password=undefined;
        user.role=undefined;
        user.isAdmin=undefined;
        sendResponse({
            res,
            message: "User Fetched Successfully",
            data: user,
          });
    }catch(error){
        return next(new ErrorHandler(error.message,500));
    }
}

exports.deleteById=async(req,res,next)=>{
    try{
        // await Agent.findById({ _id: req.user._id })
        const {userId}=req.query;
        if(!userId){
            return next(new ErrorHandler("Please provide userId",400));
        }
        const user=await User.findOne({where:{id:userId}});
        if(!user){
            return next(new ErrorHandler("User not found",404));
        }
        if (user.role == "Admin"&&!user.isAdmin) {
            return next(new ErrorHandler("You are not authorized to delete this user", 401));
        }        
        user.isDeleted=true;
        user.save();
        sendResponse({
            res,
            message: "User Deleted Successfully",
            data: [],
          });
    }catch(error){
        console.log("error",error);
        return next(new ErrorHandler(error.message,500));
    }
}

exports.updateProfilePicture=async(req,res,next)=>{
    try {
        const {userId}=req.query;
        if(!userId){
            return next(new ErrorHandler("Please provide userId",400));
        }
        const user=await User.findOne({where:{id:userId}});
        if(!user){
            return next(new ErrorHandler("User not found",404));
        }
        user.profilePic=req.file.path;
        await user.save();
        sendResponse({
            res,
            message: "Profile Picture Updated Successfully",
            data: user,
          });
    } catch (error) {
        console.log("eror",error);
        return next(new ErrorHandler(error.message,500));
    }
}
exports.deleteProfilePicture = async (req, res, next) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return next(new ErrorHandler("Please provide userId", 400));
        }

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (user.profilePic) {            
            user.profilePic = `https://avatar.iran.liara.run/public/boy?username=${user.name}`;
            // "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"||
            await user.save();
        }

        sendResponse({
            res,
            message: "Profile Picture Deleted Successfully",
            data:{
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                profilePic: user.profilePic
            },
        });
    } catch (error) {
        console.log("error", error);
        return next(new ErrorHandler(error.message, 500));
    }
};
