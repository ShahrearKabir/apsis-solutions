const users = require('../models/user');
const Employee = require('../models/employee');
const response = require('../utils/response');
const GLOBAL_MESSAGE = require('../configs/globalMessage.json');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const auth = require('../configs/auth.json');
const Roles = require('../models/roles');

let refresheTokens = [];
exports.login = async (req, res) => {
    const {
        username,
        password
    } = req.body;
    await users
        .findOne({
            username: username
        })
        // .populate({
        //     path: "roles",
        //     // model:"roles",s
        //     select: "-_id -__v -createdAt -updatedAt"
        // })
        .exec((err, user) => {
            console.log("user----->", user);

            if (err) {
                res.status(GLOBAL_MESSAGE.UN_AUTH.STATUS_CODE).json({
                    status: GLOBAL_MESSAGE.UN_AUTH.STATUS_CODE,
                    message: GLOBAL_MESSAGE.UN_AUTH,
                    errorMsg: err,
                });
            }

            if (user) {
                bcrypt.compare(password, user.password, async (err, isMatch) => {
                    if (err) {
                        res.status(GLOBAL_MESSAGE.UN_AUTH.STATUS_CODE).json({
                            status: GLOBAL_MESSAGE.UN_AUTH.STATUS_CODE,
                            message: GLOBAL_MESSAGE.UN_AUTH,
                            errorMsg: err,
                        });
                    }
                    if (isMatch) {
                        let employeeDetails = await Employee
                            .findOne({
                                user_id: user._id
                            })
                            .populate({
                                path: "role_ids",
                                select: "-_id -createdAt -updatedAt -__v"
                            })
                            .exec()

                        const accessToken = await jwt.sign(
                            {
                                _id: user._id,
                                username: user.username,
                                roles: employeeDetails.role_ids,
                                profile_id: employeeDetails._id
                            },
                            auth.accessToken,
                            {
                                expiresIn: auth.expiresIn,
                            }
                        );

                        const refresheToken = jwt.sign({
                            _id: user._id,
                            username: user.username,
                            password: user.password,
                        },
                            auth.refreshToken
                        );

                        refresheTokens.push(refresheToken);
                        let decoded = jwt_decode(accessToken);
                        // const expiresInSecond = decoded.exp - decoded.iat;
                        // console.log(expiresInSecond);
                        const token = jwt_decode(accessToken);
                        var temp = Object.assign({}, token);
                        delete temp.password;

                        response(res).toJson({
                            status: 200,
                            data: {
                                accessToken,
                                refresheToken,
                                // roles: user.tole_ids,
                                type: "Bearer",
                                authorization: `Bearer ${accessToken}`,
                            },
                        });
                    }
                    else {
                        response(res).toError({
                            status: GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE,
                            message: GLOBAL_MESSAGE.NOT_FOUND,
                            data: {},
                            errorMsg: {
                                username: null,
                                password: "Password does not matched"
                            },
                        });
                    }
                });
            } else {
                response(res).toError({
                    status: GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE,
                    message: GLOBAL_MESSAGE.NOT_FOUND,
                    data: {},
                    errorMsg: {
                        username: "Phone number does not match",
                        password: null,
                    }
                });
            }

        });
}

// exports.logout = async(req, res)=>{

//     const {authorization} = req.headers;
//     if(authorization) {

//         const tokenHeader = authorization.split(" ")[1];
//         const token = jwt_decode(tokenHeader);
//     }
// }

exports.userList = async (req, res) => {

    await Employee
        .find({})
        .populate({
            path: "role_ids",
            select: "name -_id"
        })
        .populate({
            path: "user_id",
            select: "username"
        })
        .populate({
            path: "manager_id",
            select: "first_name last_name"
        })
        .exec((err, user) => {

            if (err) {
                response(res).toError({
                    status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                    message: GLOBAL_MESSAGE.BAD_REQUEST,
                    errors: err
                }), GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE
            }

            else if (user.length == 0) {
                response(res).toJson({
                    status: GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE,
                    message: GLOBAL_MESSAGE.NOT_FOUND,
                    data: { user },
                }, GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE)
            }

            else if (user) {
                response(res).toJson({
                    status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                    message: GLOBAL_MESSAGE.SUCCESS,
                    data: { user },
                }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE)
            }
        });
};

exports.userStore = async (req, res) => {
    const {
        username,
        password,
    } = req.body;

    var salt = bcrypt.genSaltSync(10);
    var saltHashPasword = bcrypt.hashSync(password, salt);

    let getUserRole = await Roles.findOne({ role: "user" }).exec()
    var user = new users({
        username,
        password: saltHashPasword,
    })

    let employee = new Employee({
        role_ids: getUserRole._id,
        user_id: user._id,
    });

    await employee.save()
    await user.save((err, user) => {
        if (err) {
            response(res).toError({
                status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                message: GLOBAL_MESSAGE.BAD_REQUEST,
                errors: err
            }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE)
        }
        else {
            response(res).toJson({
                status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                message: GLOBAL_MESSAGE.SUCCESS,
                data: { user },
            }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE)
        }
    });
};

// userInfo
exports.userInfo = async (req, res) => {
    const { user_id } = req.params
    console.log("userID", user_id);
    await Employee
        .findOne({ user_id: user_id })
        .populate({
            path: "role_ids",
            select: "name -_id"
        })
        .populate({
            path: "user_id",
            select: "username"
        })
        .populate({
            path: "manager_id",
            // select: "first_name last_name"
        })
        .exec((err, user) => {
            if (!user) {
                response(res).toError({
                    status: GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE,
                    message: GLOBAL_MESSAGE.NOT_FOUND,
                    errors: err,
                }, GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE)
            }

            else if (err) {
                response(res).toError({
                    status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                    message: GLOBAL_MESSAGE.BAD_REQUEST,
                    errors: err,
                }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE)
            }

            else {
                response(res).toJson({
                    status: GLOBAL_MESSAGE.UPDATED.STATUS_CODE,
                    message: GLOBAL_MESSAGE.UPDATED,
                    data: { user },
                }, GLOBAL_MESSAGE.UPDATED.STATUS_CODE)
            }
        })
}

exports.userUpdate = async (req, res) => {
    // console.log("req.body", req.body);
    const {
        _id,
        first_name,
        last_name,
        phone_number,
        email,
        manager_id,
        role_ids
    } = req.body.editProfileObj;

    let query = { _id: _id };
    let newData = {
        first_name,
        last_name,
        phone_number,
        email
        // manager_id,
        // role_ids
    };

    if(manager_id) newData.manager_id = manager_id
    if(role_ids && role_ids.length > 0) newData.role_ids = role_ids

    await Employee.findByIdAndUpdate(query, newData, (err, user) => {
        if (!user) {
            response(res).toError({
                status: GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE,
                message: GLOBAL_MESSAGE.NOT_FOUND,
                errors: err,
            }, GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE)
        }

        else if (err) {
            response(res).toError({
                status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                message: GLOBAL_MESSAGE.BAD_REQUEST,
                errors: err,
            }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE)
        }

        else {

            response(res).toJson({
                status: GLOBAL_MESSAGE.UPDATED.STATUS_CODE,
                message: GLOBAL_MESSAGE.UPDATED,
                data: { user },
            }, GLOBAL_MESSAGE.UPDATED.STATUS_CODE)
        }
    });
};

exports.userDelete = async (req, res) => {
    const { _id } = req.body;
    var query = { _id: _id };

    await users.findByIdAndDelete(query, (err, user) => {
        if (!user) {
            response(res).toError({
                status: GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE,
                message: GLOBAL_MESSAGE.NOT_FOUND,
                errors: err,
            }, GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE)
        }

        else if (err) {
            response(res).toError({
                status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
                message: GLOBAL_MESSAGE.BAD_REQUEST,
                errors: err
            }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE)
        }

        else {
            response(res).toJson({
                status: GLOBAL_MESSAGE.DELETE.STATUS_CODE,
                message: GLOBAL_MESSAGE.DELETE,
                data: { user },
            }, GLOBAL_MESSAGE.DELETE.STATUS_CODE)
        }
    });
};