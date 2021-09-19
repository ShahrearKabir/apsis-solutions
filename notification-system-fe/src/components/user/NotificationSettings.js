import Axios from 'axios';
import React, { Component } from 'react';
import { Alert, Table } from 'react-bootstrap';
import AuthService from '../../auth/AuthService';
import io from 'socket.io-client';
import decode from 'jwt-decode';

export class NotificationSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: props.userInfo,
            editProfile: false,
            editSettingsObj: {
                push_active: "",
                email_active: "",
                sms_active: "",
            },
            notificationSetting: {}
        }
    }

    componentDidMount() {
        this.setState({ userInfo: this.props.userInfo })
        this.getNotificationConfig()
    }

    getNotificationConfig() {
        const Auth = new AuthService();
        let user = decode(Auth.getToken())
        let url = process.env.REACT_APP_BASE_URL + "/notification/settings/by/" + user.profile_id   //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        Axios.get(url, header)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        notificationSetting: res.data.data.notificationSetting,
                        editSettingsObj: res.data.data.notificationSetting
                    })
                }
                else {
                    console.log("Data not found");
                }
            }).catch(error => {
                console.log('Please check connection')
            });
    }

    editProfile = () => {
        this.setState({
            editProfile: !this.state.editProfile,
            // editLeaveObj: this.state.userInfo
        })
    }

    onChangeProfileData = (e) => {
        // console.log("onChangeProfileData", e.target.name);
        // console.log("onChangeProfileData", e.target.value);
        let { userInfo, editLeaveObj } = this.state
        editLeaveObj[e.target.name] = e.target.value
        this.setState({ editLeaveObj })
    }

    onUpdateConfig = () => {
        let { editSettingsObj, userInfo } = this.state
        // delete editLeaveObj.role_ids
        const Auth = new AuthService();
        let user = decode(Auth.getToken())
        editSettingsObj.employee_id = user.profile_id
        let url = process.env.REACT_APP_BASE_URL + "/notification/settings/update"   //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        editSettingsObj.employee_id = userInfo._id
        Axios.post(url, editSettingsObj, header)
            .then(res => {
                if (res.status === 200) {
                    // this.setState({
                    //     userData: res.data.data.user
                    // })
                    console.log("save config", res);
                    this.getLeaveList()

                }
                else {
                    console.log("Data not found");
                }
            }).catch(error => {
                console.log('Please check connection')
            });
    }

    leaveDropdownChanged = (e) => {
        let { editSettingsObj } = this.state
        const values = e.target.value
        console.log("target.selectedOptions", e.target.name, values);
        editSettingsObj[e.target.name] = values
        this.setState({ editSettingsObj })
    }


    render() {
        let { userInfo, editLeaveObj, notificationSetting, editSettingsObj } = this.state
        // console.log("userInfo", userInfo);

        return (
            <div className="">
                <section>
                    <div className="container-fluid" style={{ textAlign: 'left' }}>
                        <div className="container bg-white">
                            <div className="row">
                                <div className="col-md-12 mt-4">
                                    <h3>
                                        Notification Settings
                                        <button
                                            className="btn btn-secondary float-right"
                                            onClick={this.editProfile}
                                        >
                                            <i class="fas fa-plus 3x"></i>
                                        </button>
                                    </h3>
                                    <div className="custom-title-border-left"></div>
                                </div>
                                <div className="col-md-6 my-2">

                                <div className="col-md-6 my-2">
                                            <div className="row">
                                                
                                                <div className="col-12 my-2">
                                                    Push Notification
                                                    <select
                                                        name="push_active"
                                                        className="form-control"
                                                        // aria-label="multiple select example"
                                                        value={editSettingsObj.push_active}
                                                        onChange={this.leaveDropdownChanged}
                                                    >
                                                        <option value="0">Off</option>
                                                        <option value="1">On</option>
                                                    </select>
                                                </div>

                                                <div className="col-12 my-2">
                                                    Email Notification
                                                    <select
                                                        name="email_active"
                                                        className="form-control"
                                                        value={editSettingsObj.email_active}
                                                        onChange={this.leaveDropdownChanged}
                                                    >
                                                        <option value="0">Off</option>
                                                        <option value="1">On</option>
                                                    </select>
                                                </div>

                                                <div className="col-12 my-2">
                                                    SMS Notification
                                                    <select
                                                        name="sms_active"
                                                        className="form-control"
                                                        value={editSettingsObj.sms_active}
                                                        onChange={this.leaveDropdownChanged}
                                                    >
                                                        <option value="0">Off</option>
                                                        <option value="1">On</option>
                                                    </select>
                                                </div>

                                                <div className="col-12 my-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={this.onUpdateConfig}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    
                                </div>

                                {/* {
                                    !this.state.editProfile ? null :
                                        <div className="col-md-6 my-2">
                                            <div className="row">
                                                
                                                <div className="col-12 my-2">
                                                    Push Notification
                                                    <select
                                                        name="push_active"
                                                        className="form-control"
                                                        // aria-label="multiple select example"
                                                        onChange={this.leaveDropdownChanged}
                                                    >
                                                        <option value="0">Off</option>
                                                        <option value="1">On</option>
                                                    </select>
                                                </div>

                                                <div className="col-12 my-2">
                                                    Email Notification
                                                    <select
                                                        name="email_active"
                                                        className="form-control"
                                                        // aria-label="multiple select example"
                                                        onChange={this.leaveDropdownChanged}
                                                    >
                                                        <option value="0">Off</option>
                                                        <option value="1">On</option>
                                                    </select>
                                                </div>

                                                <div className="col-12 my-2">
                                                    SMS Notification
                                                    <select
                                                        name="sms_active"
                                                        className="form-control"
                                                        // aria-label="multiple select example"
                                                        onChange={this.leaveDropdownChanged}
                                                    >
                                                        <option value="0">Off</option>
                                                        <option value="1">On</option>
                                                    </select>
                                                </div>

                                                <div className="col-12 my-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={this.onAddLeave}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                } */}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}