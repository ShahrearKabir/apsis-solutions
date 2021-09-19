const { notificationStore } = require('../controller/notificationController');
const Employee = require('../models/employee');
const Notification = require('../models/notification');
const nodemailer = require('nodemailer');
const twilio = require("twilio");
const NotificationSettings = require('../models/notificationSettings');

var accountSid = "AC03393039b848be692a9859cd080245b2";
var authToken = "31d9b84a0301ab5d372196a21211c07f";
var twilioNumber = "+19177192272"

const client = twilio(accountSid, authToken);

exports.socketPushNotification = async (io) => {
    io.on("connection", async (socket) => {
        const profileId = socket.handshake.auth.profileId;
        console.log(
            socket.client.conn.server.clientsCount +
            " users connected...................."
        );

        socket.on("disconnect", async (socket) => {
            // let query = { radisKey: socket.user && socket.user.redisUserIat }
            // let updateObj = {
            //   socket_id: null
            // }

            // await SocketUsers.findOneAndUpdate(query, updateObj)
            // await SocketUsers.deleteOne(query)
            console.log("A user disconnected................");
        });

        let notificationSetting = await NotificationSettings
            .findOne({ employee_id: profileId })
            .exec()


        // if()
        socket.on(profileId, async (data) => {
            let dataSendTo = []
            // console.log("socket data", data);
            // console.log("socket data profileId", profileId);
            data.from = "From Kabir";
            dataSendTo = [profileId, data.editProfileObj._id, data.editProfileObj.manager_id._id]

            await notificationStore(profileId, dataSendTo, "profileUpdate", "socket", data)
            this.emailNotification(data.editProfileObj.email, "Profile Update", data)
            this.smsNotification(data.editProfileObj.phone_number, "Profile Update", data)

            dataSendTo.map(item => {
                console.log("socket data item", item);
                socket.broadcast.emit(item, data);
            })
            // socket.broadcast.emit("addLeave", data);
        });

        socket.on("addLeave", async (data) => {
            console.log("socket data addLeave", data);
            await notificationStore(profileId, [data.editLeaveObj.submitted_to], "addLeave", "socket", data)
            // notificationSetting.email_active == 0 ? null :
                this.emailNotification(data.userInfo && data.userInfo.manager_id && data.userInfo.manager_id.email, "addLeave", data)
            // notificationSetting.sms_active == 0 ? null :
                this.smsNotification(data.userInfo && data.userInfo.manager_id && data.userInfo.manager_id.phone_number, "addLeave", data)

            // notificationSetting.push_active == 0 ? null :
                socket.broadcast.emit(data.editLeaveObj.submitted_to + "addLeave", data);
        })

        socket.on("leaveApproved", async (data) => {
            console.log("socket data 3 item", data);
            await notificationStore(profileId, [data.editLeaveObj.submitted_by._id], "leaveApproved", "socket", data)
            this.emailNotification(data.editLeaveObj.submitted_by && data.editLeaveObj.submitted_by && data.editLeaveObj.submitted_by.email, "leaveApproved", data)
            this.smsNotification(data.editLeaveObj.submitted_by && data.editLeaveObj.submitted_by && data.editLeaveObj.submitted_by.phone_number, "leaveApproved", data)
            socket.broadcast.emit(data.editLeaveObj.submitted_by._id + "leaveApproved", data);
        })
        // });
    });
}

exports.emailNotification = async (email, subject, data) => {
    let transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        // host: process.env.EMAIL_HOST,
        // port: process.env.EMAIL_PORT,
        // secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_SERVICE,
        to: email,
        subject: subject + 'Notification',
        html: `<table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" >
                <div style="width:26.6%;padding: 4rem; background: #dfdfdf 0% 0% no-repeat padding-box; border-radius: 0.25rem;">
                    ${subject}
                </div>
            </td>
        </tr>
    </table>`,
    };

    await transporter.sendMail(mailOptions, async (err, sent) => {
        console.log("sent===>", sent);
        // console.log("err===>", err);
        // console.log("err code===>", err.responseCode);
        if (err) {
            console.log("after sending mail err", err);
        }
        else if (sent) {
            console.log("after sending mail", sent);
        }
    });
}

exports.smsNotification = async (phone, subject, data) => {
    client.messages
        .create({
            body: subject,
            to: phone, // Text this number
            from: twilioNumber, // From a valid Twilio number
        })
        .then((message) => console.log("twilio message", message))
        .catch((err) => console.log("twilio err", err));
}