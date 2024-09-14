const User=require("../model/UserModel.js");
const ErrorHandler=require("../utility/ErrorHandler.js");
const sendResponse=require("../utility/sendResponse.js");
const { generateToken } = require("../utility/generateToken.js");
const {registerUserValidation,loginValidation}=require("../helper/validation.js")
const bcrypt=require("bcrypt")

exports.registerUser = async (req, res, next) => {
    try {
        const { name,mobile, email, password,isAdmin,role } = req.body;
        if(!name||!email||!password||!isAdmin||!mobile){
            return next(new ErrorHandler("All Field Required",400))
        }
        const valid=await registerUserValidation(req.body);
        if(!valid||(valid&&valid.error)){
            console.log("valid",valid.error)
            return next(new ErrorHandler(valid.error,400))
        }
        const checkEmail=await User.findOne({where:{email:email}});
        if(checkEmail){
            console.log("checkEmail",checkEmail)
            return next(new ErrorHandler("User Already Existed",404))
        }
        let user;
        user= await User.create({ name, email, password,isAdmin,mobile,role });
        const token=await generateToken(user.id,user.isAdmin,role,user.tokenVersion);
        user.password=undefined;
        const data={...user.dataValues,token}
        sendResponse({
            res,
            message: "User Register Successfully",
            data: data,
          });
    } catch (error) {
        console.log("valid",error)
        return next(new ErrorHandler(error.message,500));
    }
};

exports.loginUser =async (req, res, next) => {
    try{
        const {email,password}=req.body;
        const valid=await loginValidation(req.body);
        if(!valid||(valid&&valid.error)){
            return next(new ErrorHandler(valid.error,400))
        }

        let checkEmail=await User.findOne({where:{email:email}});
        if(!checkEmail){
            return next(new ErrorHandler("Email Id not found",404));
        }
        const matchPassword=await bcrypt.compare(password,checkEmail.password);
        if(!matchPassword){
            return next(new ErrorHandler("Invalid Password",400));
        }
        checkEmail.password=undefined;
        if(checkEmail.isDeleted){
            return next(new ErrorHandler("User Deleted Please Contact to the Admin",404));
        }
        let token=await generateToken(checkEmail.id,checkEmail.isAdmin,checkEmail.role,checkEmail.tokenVersion);
        let data={
            ...checkEmail.dataValues,
            token
        }
        sendResponse({
            res,
            message: "User Login Successfully",
            data: data,
          });
        
    }catch(error){
        console.log("login erro",error)
        return next(new ErrorHandler(error.message,500));
    }
};

exports.logoutUser = async(req, res,next) => {
    try{
        // res.clearCookie("x-authorization");
        const {userId}=req.query;
        const user=await User.findByPk(userId);
        if(!user){
            return next(new ErrorHandler("User Not Found",404));
        }
        // const requestId = req.user.id;
        if (userId.toString() !== req.user.id.toString()) {
            return next(new ErrorHandler("Not Authorized Token And User Id Doesn't Match it.",401));
        }
        user.tokenVersion=user.tokenVersion+1;
        await user.save();

        sendResponse({
            res,
            message: "User Logout Successfully",
          });
    }catch(error){
        return next(new ErrorHandler(error.message,500));
    }
};


async function setAll(){
    const all=await User.findAll()
    for(let i=0;i<all.length;i++){
        all[i].profilePic="https://avatar.iran.liara.run/public";
        all[i].save();
        console.log(all[i].dataValues)
    }
}