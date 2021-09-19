const Leaves = require("../models/leave");
const response = require('../utils/response');
const GLOBAL_MESSAGE = require('../configs/globalMessage.json');
const Users = require('../models/user');
const jwt_decode = require("jwt-decode");

exports.leaveStore = async (req, res) => {
    const {
        start_date,
        end_date,
        leave_type,
        submitted_by,
        submitted_to,
    } = req.body


    var leave = new Leaves({
        start_date,
        end_date,
        leave_type,
        submitted_by,
        submitted_to,
    })

    await leave.save((err, leaveResult) => {
        if (err) {
            response(res).toJson({
                status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                message: GLOBAL_MESSAGE.BAD_REQUEST,
                data: {},
                errorMsg: err,
            }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
        }
        else {
            response(res).toJson({
                status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                message: GLOBAL_MESSAGE.SUCCESS,
                data: { leaveResult },
                errorMsg: "",
            }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE);
        }
    })

}

exports.leaveList = async (req, res) => {
    let { profile_id } = req.params
    let { authorization } = req.headers

    const tokenHeader = authorization.split(" ")[1];
    const token = jwt_decode(tokenHeader);
    let filter = {}
    token.roles.map(item => {
        if (item.name == "MANAGER") {
            filter.submitted_to = token.profile_id
        }
        else if (item.name == "EMPLOYEE") {
            filter.submitted_by = token.profile_id
        }
    })
    await Leaves
        .find(filter)
        .populate("submitted_by submitted_to")
        .sort({createdAt: -1})
        .exec(async (err, leaveList) => {
            if (leaveList) {
                response(res).toJson({
                    status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                    message: GLOBAL_MESSAGE.SUCCESS,
                    data: { leaveList },
                    errorMsg: "",
                }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE);
            } else {
                response(res).toJson({
                    status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                    message: GLOBAL_MESSAGE.BAD_REQUEST,
                    data: { leaveList },
                    errorMsg: err,
                }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
            }
        })
}

exports.leaveUpdate = async (req, res) => {
    const leaveObject = req.body

    let query = { _id: leaveObject._id }
    // let newData = {
    //     name,
    //     role,
    // }
    // console.log("req.body", _id, name, role);
    await Leaves.findByIdAndUpdate(query, leaveObject, (err, leaveResult) => {
        if (err) {
            response(res).toJson({
                status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                message: GLOBAL_MESSAGE.BAD_REQUEST,
                data: {},
                errorMsg: err,
            }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
        }
        else {
            response(res).toJson({
                status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                message: GLOBAL_MESSAGE.SUCCESS,
                data: { leaveResult },
                errorMsg: "",
            }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE);
        }
    })

}

exports.roleDelete = async (req, res) => {
    const {
        _id
    } = req.body

    let query = { _id: _id }

    await Roles.findByIdAndDelete(query, (err, result) => {
        if (err) {
            response(res).toJson({
                status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                message: GLOBAL_MESSAGE.BAD_REQUEST,
                data: {},
                errorMsg: err,
            }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
        }
        else {
            response(res).toJson({
                status: GLOBAL_MESSAGE.DELETE.STATUS_CODE,
                message: GLOBAL_MESSAGE.DELETE,
                data: { result },
                errorMsg: "",
            }, GLOBAL_MESSAGE.DELETE.STATUS_CODE);
        }
    })

}

exports.roleAssign = async (req, res) => {
    const {
        user_id,
        role
    } = req.body

    let query = { _id: user_id }
    let newData = {
        $addToSet: { role: role }
    }

    await Users.findByIdAndUpdate(query, newData, (err, result) => {
        if (err) {
            res.json({
                status: 401,
                errors: err
            })
        }
        else {
            res.json({
                status: 200,
                data: {
                    result
                },
            })
        }
    })

}