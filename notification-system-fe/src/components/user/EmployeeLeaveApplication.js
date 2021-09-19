import Axios from 'axios';
import React, { Component } from 'react';
import { Alert, Table } from 'react-bootstrap';
import AuthService from '../../auth/AuthService';
import io from 'socket.io-client';
import decode from 'jwt-decode';

export class EmployeeLeaveApplication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: props.userInfo,
            editProfile: false,
            editLeaveObj: {
                start_date: "",
                end_date: "",
                leave_type: "",
            },
            leaveList: []
        }
    }

    componentDidMount() {
        this.setState({ userInfo: this.props.userInfo })
        this.getLeaveList()
    }

    getLeaveList() {
        const Auth = new AuthService();
        let url = process.env.REACT_APP_BASE_URL + "/leave/list"   //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        Axios.get(url, header)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        leaveList: res.data.data.leaveList
                    })
                    // console.log("newShortedData", newShortedData);
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

    onAddLeave = () => {
        let { editLeaveObj, userInfo } = this.state
        // delete editLeaveObj.role_ids
        const Auth = new AuthService();
        let url = process.env.REACT_APP_BASE_URL + "/leave/save"   //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        editLeaveObj.submitted_by = userInfo._id
        editLeaveObj.submitted_to = userInfo.manager_id._id
        editLeaveObj.manager_id = userInfo.manager_id._id
        Axios.post(url, editLeaveObj, header)
            .then(res => {
                if (res.status === 200) {
                    // this.setState({
                    //     userData: res.data.data.user
                    // })
                    console.log("save leave", res);
                    this.getLeaveList()

                    let user = decode(Auth.getToken())
                    // console.log("userInfo", userInfo);
                    const BASE_URL = process.env.REACT_APP_BASE_URL
                    const socket = io(BASE_URL, {
                        auth: {
                            token: Auth.getToken(),
                            profileId: user._id
                        },
                        transports: ['polling', 'websocket'],
                    });
                    // io.connect();
                    socket.emit(
                        "addLeave", //userInfo.manager_id._id + 
                        {
                            editLeaveObj,
                            userInfo,
                            socketID: socket.id,
                            addLeave: "addLeave"
                        },

                        response => {
                            console.log('response', response.status); // ok
                        }
                    );
                }
                else {
                    console.log("Data not found");
                }
            }).catch(error => {
                console.log('Please check connection')
            });
    }

    leaveDropdownChanged = (e) => {
        let { editLeaveObj } = this.state
        const values = e.target.value
        console.log("target.selectedOptions", values);
        editLeaveObj.leave_type = values
        this.setState({ editLeaveObj })
    }


    render() {
        let { userInfo, editLeaveObj, leaveList } = this.state
        // console.log("userInfo", userInfo);

        return (
            <div className="">
                <section>
                    <div className="container-fluid" style={{ textAlign: 'left' }}>
                        <div className="container bg-white">
                            <div className="row">
                                <div className="col-md-12 mt-4">
                                    <h3>
                                        Employee Leave Application
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
                                    {
                                        leaveList.map((item, index) => {
                                            return <Alert variant={item.status == 1 ? "secondary" : "success"}>
                                                <Alert.Heading className="text-capitalize">{item.leave_type} <small>created at: <i>{new Date(item.createdAt).toLocaleString()}</i></small></Alert.Heading>
                                                <p>
                                                    {new Date(item.start_date).toLocaleDateString()} to {new Date(item.end_date).toLocaleDateString()}
                                                </p>
                                                <hr />
                                                <p className="mb-0">
                                                    {item.status == 0 ? "pending" : item.status == 1 ? "approved" : null}
                                                    {/* <Button variant="success" onClick={() => this.onUpdateNotification(item, 1)}> Read </Button>
                                                    <Button variant="secondary" onClick={() => this.onUpdateNotification(item, 0)}> Unread </Button> */}
                                                </p>
                                            </Alert>
                                        })
                                    }
                                </div>

                                {
                                    !this.state.editProfile ? null :
                                        <div className="col-md-6 my-2">
                                            <div className="row">
                                                <div className="col-12 my-2">
                                                    Start Date
                                                    <input
                                                        type="date"
                                                        name="start_date"
                                                        className="form-control"
                                                        placeholder="Start Date..."
                                                        value={editLeaveObj.start_date}
                                                        onChange={this.onChangeProfileData}
                                                    />
                                                </div>
                                                <div className="col-12 my-2">
                                                    Last Name
                                                    <input
                                                        type="date"
                                                        name="end_date"
                                                        className="form-control"
                                                        placeholder="End Date..."
                                                        value={editLeaveObj.end_date}
                                                        onChange={this.onChangeProfileData}
                                                    />
                                                </div>
                                                <div className="col-12 my-2">
                                                    Leave type
                                                    <select
                                                        className="form-control"
                                                        // aria-label="multiple select example"
                                                        onChange={this.leaveDropdownChanged}
                                                    >
                                                        <option selected>Open this select menu</option>
                                                        <option value="casual">Casual</option>
                                                        <option value="Sick">Sick</option>
                                                        <option value="general">General</option>
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
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}