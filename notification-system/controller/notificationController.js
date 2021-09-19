const Notification = require("../models/notification");
const NotificationSettings = require("../models/notificationSettings");
const response = require('../utils/response');
const GLOBAL_MESSAGE = require('../configs/globalMessage.json');

exports.notificationStore = async (from, to, type, route, data) => {
    var notification = new Notification({
        from,
        to,
        type,
        route,
        read_status: 0
    })

    await notification.save((err, notificationResult) => {
        if (err) {
            console.log("notificationResult failed", err);
            return false
        }
        else {
            console.log("notificationResult success", notificationResult);
            return true
        }
    })

}

exports.notificationList = async (req, res) => {
    let { profile_id } = req.params
    await Notification.find({ to: { $in: profile_id } })
        .populate("to")
        .populate("from")
        .sort({ createdAt: -1 })
        .exec(async (err, notificationList) => {
            if (notificationList) {
                response(res).toJson({
                    status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                    message: GLOBAL_MESSAGE.SUCCESS,
                    data: { notificationList },
                    errorMsg: "",
                }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE);
            } else {
                response(res).toJson({
                    status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                    message: GLOBAL_MESSAGE.BAD_REQUEST,
                    data: { notificationList },
                    errorMsg: err,
                }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
            }
        })


}

exports.notificationUpdate = async (req, res) => {
    const notificationObj = req.body.item

    let query = { _id: notificationObj._id }
    let newData = {
        read_status: notificationObj.read_status,
    }
    // console.log("req.body", _id, name, role);
    await Notification.findByIdAndUpdate(query, newData, (err, notificationResult) => {
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
                data: { notificationResult },
                errorMsg: "",
            }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE);
        }
    })

}

exports.notificationSettingsUpdate = async (req, res) => {
    const notificationObj = req.body

    let query = { employee_id: notificationObj.employee_id }
    let newData = {
        push_active: notificationObj.push_active,
        email_active: notificationObj.email_active,
        sms_active: notificationObj.sms_active,
    }
    // console.log("req.body", _id, name, role);
    await NotificationSettings.findOneAndUpdate(query, newData, { upsert: true }, (err, notificationResult) => {
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
                data: { notificationResult },
                errorMsg: "",
            }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE);
        }
    })

}

exports.notificationSettings = async (req, res) => {
    let { profile_id } = req.params
    await NotificationSettings
        .findOne({ employee_id: profile_id })
        .exec(async (err, notificationSetting) => {
            if (notificationSetting) {
                response(res).toJson({
                    status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                    message: GLOBAL_MESSAGE.SUCCESS,
                    data: { notificationSetting },
                    errorMsg: "",
                }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE);
            } else {
                response(res).toJson({
                    status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                    message: GLOBAL_MESSAGE.BAD_REQUEST,
                    data: { notificationSetting },
                    errorMsg: err,
                }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE);
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