const { accessObj, roleObj, userObj } = require("../configs/seedSuperAdmin.json");
// const CityList = require("../configs/cities.json");
// const CountryList = require("../configs/countries.json");
const bcrypt = require("bcryptjs");
// const Accesses = require("../models/accesses");
const Roles = require("../models/roles");
const Users = require("../models/user");
const Employee = require("../models/employee");
const moment = require('moment');
const response = require("../utils/response");
const GLOBAL_MESSAGE = require("../configs/globalMessage.json");
// const Cities = require("../models/cities");
// const Countries = require("../models/countries");
/**
 * Seed the database
 */
exports.seedSuperAdminEvents = async (req, res) => {
    console.log("seedSuperAdminEvents...");

    const today = moment().toDate()
    // const { _id, title, type, description } = accessObj;
    // let access = new Accesses(accessObj);
    // await access.save()

    // roleObj.access_id = access.id
    let roles = new Roles(roleObj)
    await roles.save()

    let salt = bcrypt.genSaltSync(10);
    let saltHashPasword = bcrypt.hashSync(userObj.password, salt);

    let users = new Users({
        username: userObj.username,
        password: saltHashPasword
    });

    let employee = new Employee({
        role_ids: roles._id,
        user_id: users._id,
    });

    await employee.save()

    await users.save(async (err, userResult) => {
        if (err) {
            response(res).toError({
                status: GLOBAL_MESSAGE.UN_AUTH.STATUS_CODE,
                message: GLOBAL_MESSAGE.UN_AUTH,
                errors: err
            }, GLOBAL_MESSAGE.UN_AUTH.STATUS_CODE)
        } else {
            response(res).toJson({
                status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
                message: GLOBAL_MESSAGE.SUCCESS,
                data: { userResult }
            }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE)
        }
    });
}

// exports.seedCitiesEvents = async (req, res) => {
//     console.log("seedCitiesEvents...");
//     await Cities.insertMany(CityList, async (err, citiesResult) => {
//         if (err) {
//             response(res).toError({
//                 status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
//                 message: GLOBAL_MESSAGE.BAD_REQUEST,
//                 errors: err
//             }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE)
//         }
//         else if (citiesResult.length == 0) {
//             response(res).toJson({
//                 status: GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE,
//                 message: GLOBAL_MESSAGE.NOT_FOUND,
//                 data: { citiesResult },
//             }, GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE)
//         }
//         else {//if (citiesResult.length > 0)
//             response(res).toJson({
//                 status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
//                 message: GLOBAL_MESSAGE.SUCCESS,
//                 data: { citiesResult },
//             }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE)
//         }
//     })
// }

// exports.seedCountriesEvents = async (req, res) => {
//     console.log("seedCountriesEvents...");
//     await Countries.insertMany(CountryList, async (err, countriesResult) => {
//         if (err) {
//             response(res).toError({
//                 status: GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE,
//                 message: GLOBAL_MESSAGE.BAD_REQUEST,
//                 errors: err
//             }, GLOBAL_MESSAGE.BAD_REQUEST.STATUS_CODE)
//         }
//         else if (countriesResult.length == 0) {
//             response(res).toJson({
//                 status: GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE,
//                 message: GLOBAL_MESSAGE.NOT_FOUND,
//                 data: { countriesResult },
//             }, GLOBAL_MESSAGE.NOT_FOUND.STATUS_CODE)
//         }
//         else {//if (countriesResult.length > 0)
//             response(res).toJson({
//                 status: GLOBAL_MESSAGE.SUCCESS.STATUS_CODE,
//                 message: GLOBAL_MESSAGE.SUCCESS,
//                 data: { countriesResult },
//             }, GLOBAL_MESSAGE.SUCCESS.STATUS_CODE)
//         }
//     })
// }