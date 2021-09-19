const Roles = require("../models/roles");
const response = require('../utils/response');
const GLOBAL_MESSAGE = require('../configs/globalMessage.json');
const Users = require('../models/user');

exports.roleStore = async (req, res) => {
    const {
        name,
        role,
    } = req.body

    await Roles.findOne({role: role}).then( async(err, roleResult) => {
        // checkRole = role
        if (err) {
            response(res).toJson({
                status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                message: GLOBAL_MESSAGE.BAD_REQUEST,
                data: {},
                errorMsg: 'Role already exists'
            },GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
        } else {
            var roles = new Roles({
                name,
                role,
            })
    
            await roles.save((err, roleResult) => { 
                if (err){ 
                    response(res).toJson({
                        status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                        message: GLOBAL_MESSAGE.BAD_REQUEST,
                        data: { },
                        errorMsg: err,
                    },GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
                } 
                else{ 
                    response(res).toJson({
                        status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                        message: GLOBAL_MESSAGE.SUCCESS,
                        data: { roleResult },
                        errorMsg: "",
                    },GLOBAL_MESSAGE.SUCCESS.STATUS_CODE);
                } 
            })
        }
    })
    // console.log("getRole", checkRole.role, role);
    
}

exports.rolesList = async (req, res) => {
    await Roles.find({role: {$ne: "super_admin"}})
    .populate("access_id")
    .exec( async (err, roleList) => {
        if (roleList) {
            response(res).toJson({
                status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                message: GLOBAL_MESSAGE.SUCCESS,
                data: { roleList },
                errorMsg: "",
            },GLOBAL_MESSAGE.SUCCESS.STATUS_CODE);
        } else {
            response(res).toJson({
                status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                message: GLOBAL_MESSAGE.BAD_REQUEST,
                data: { roleList },
                errorMsg: err,
            },GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
        }
    })

    
}

exports.roleUpdate = async (req, res) => {
    const {
        _id,
        name,
        role,
    } = req.body

    let query = { _id: _id }
    let newData =  {
        name,
        role,
    }
    // console.log("req.body", _id, name, role);
    await Roles.findByIdAndUpdate( query, newData, (err, roleResult) => {
        if (err){ 
            response(res).toJson({
                status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                message: GLOBAL_MESSAGE.BAD_REQUEST,
                data: { },
                errorMsg: err,
            },GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
        } 
        else{ 
            response(res).toJson({
                status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                message: GLOBAL_MESSAGE.SUCCESS,
                data: { roleResult },
                errorMsg: "",
            },GLOBAL_MESSAGE.SUCCESS.STATUS_CODE);
        } 
    })
    
}

exports.roleDelete = async (req, res) => {
    const {
        _id
    } = req.body

    let query = { _id: _id }
    
    await Roles.findByIdAndDelete( query, (err, result) => {
        if (err){ 
            response(res).toJson({
                status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                message: GLOBAL_MESSAGE.BAD_REQUEST,
                data: { },
                errorMsg: err,
            },GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
        } 
        else{ 
            response(res).toJson({
                status: GLOBAL_MESSAGE.DELETE.STATUS_CODE,
                message: GLOBAL_MESSAGE.DELETE,
                data: { result },
                errorMsg: "",
            },GLOBAL_MESSAGE.DELETE.STATUS_CODE);
        } 
    })
    
}

exports.roleAssign = async (req, res) => {
    const {
        user_id,
        role
    } = req.body

    let query = { _id: user_id }
    let newData =  {
        $addToSet: { role : role}
    }
    
    await Users.findByIdAndUpdate( query, newData, (err, result) => {
        if (err){ 
            res.json({
                status: 401,
                errors: err
            })
        } 
        else{ 
            res.json({
                status: 200,
                data: {
                    result
                },
            })
        } 
    })
    
}