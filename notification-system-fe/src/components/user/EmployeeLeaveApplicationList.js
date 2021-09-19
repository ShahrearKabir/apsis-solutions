import Axios from 'axios';
import React, { Component } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import AuthService from '../../auth/AuthService';
import io from 'socket.io-client';
import decode from 'jwt-decode';

export class EmployeeLeaveApplicationList extends Component {
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
        Axios.post(url, editLeaveObj, header)
            .then(res => {
                if (res.status === 200) {
                    // this.setState({
                    //     userData: res.data.data.user
                    // })
                    console.log("save leave", res);

                    // let userInfo = decode(Auth.getToken())
                    // // console.log("userInfo", userInfo);
                    // const BASE_URL = process.env.REACT_APP_BASE_URL
                    // const socket = io(BASE_URL, {
                    //     auth: {
                    //         token: Auth.getToken(),
                    //         profileId: userInfo._id
                    //     },
                    //     transports: ['polling', 'websocket'],
                    // });
                    // // io.connect();
                    // socket.emit(
                    //     userInfo._id,
                    //     {
                    //         editLeaveObj,
                    //         socketID: socket.id,
                    //     },

                    //     response => {
                    //         console.log('response', response.status); // ok
                    //     }
                    // );
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

    onUpdateLeaveStatus = (item, status) => {
        let { editProfileObj } = this.state
        const Auth = new AuthService();
        let url = process.env.REACT_APP_BASE_URL + "/leave/update"   //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        let editLeaveObj = item
        item.status = status
        Axios.put(url, item, header)
            .then(async res => {
                if (res.status === 200) {
                    // await this.handleClose()
                    this.getLeaveList()
                    console.log("update res", res);

                    let userInfo = decode(Auth.getToken())
                    // console.log("userInfo", userInfo);
                    const BASE_URL = process.env.REACT_APP_BASE_URL
                    const socket = io(BASE_URL, {
                        auth: {
                            token: Auth.getToken(),
                            profileId: userInfo._id
                        },
                        transports: ['polling', 'websocket'],
                    });
                    // io.connect();
                    socket.emit(
                        "leaveApproved", //userInfo.manager_id._id + 
                        {
                            editLeaveObj,
                            socketID: socket.id,
                            addLeave: "leaveApproved"
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


    render() {
        let { userInfo, editLeaveObj, leaveList } = this.state
        // console.log("userInfo", userInfo);

        return (
            <div className="main-section dashBoard-wrapper">
                <section>
                    <div className="container-fluid" style={{ textAlign: 'left' }}>
                        <div className="container bg-white">
                            <div className="row">
                                <div className="col-md-12 mt-4">
                                    <h3>
                                        Employee Leave Application
                                        {/* <button
                                            className="btn btn-secondary float-right"
                                            onClick={this.editProfile}
                                        >
                                            <i class="fas fa-plus 3x"></i>
                                        </button> */}
                                    </h3>
                                    <div className="custom-title-border-left"></div>
                                </div>
                                <div className="col-md-12 my-2">
                                    {
                                        leaveList.map((item, index) => {
                                            return <Alert variant={item.status == 1 ? "secondary" : "success"}>
                                                <Alert.Heading className="text-capitalize">{item.leave_type} Leave <small>created at: <i>{new Date(item.createdAt).toLocaleString()}</i></small></Alert.Heading>
                                                <p>
                                                    {new Date(item.start_date).toLocaleDateString()} to {new Date(item.end_date).toLocaleDateString()}
                                                </p>
                                                <hr />
                                                <p className="">
                                                    {item.status == 0 ? "pending" : item.status == 1 ? "approved" : null}

                                                    {
                                                        userInfo && userInfo.role_ids.map(role => {
                                                            if(role.name == "MANAGER"){
                                                                return <Button
                                                                    className="btn btn-secondary float-right"
                                                                    variant="success"
                                                                    onClick={() => this.onUpdateLeaveStatus(item, 1)}
                                                                    style={item.status == 0 ? {display: "block"} : item.status == 1 ? {display: "none"} : null}
                                                                > Approve </Button>
                                                            }
                                                            else{
                                                                return null
                                                            }
                                                        })
                                                    }
                                                    {/* <Button variant="secondary" onClick={() => this.onUpdateNotification(item, 0)}> Unread </Button> */}
                                                </p>
                                            </Alert>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}