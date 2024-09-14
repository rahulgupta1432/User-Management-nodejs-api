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
        const {userId}=req.query;
        if(!userId){
            return next(new ErrorHandler("Please provide userId",400));
        }
        const user=await User.findOne({where:{id:userId}});
        if(!user){
            return next(new ErrorHandler("User not found",404));
        }
        user.password=undefined;
        const countUserTask=await Task.findAll({where:{userId:user.id}});
        const data={
            ...user.dataValues,
            taskCount:countUserTask.length,
            completedTaskCount:countUserTask.filter(task=>task.completed===true).length,
            incompleteTaskCount:countUserTask.filter(task=>task.completed===false).length
        }
        sendResponse({
            res,
            message: "User Fetched Successfully",
            data: data,
          });
    }catch(error){
        return next(new ErrorHandler(error.message,500));
    }
}