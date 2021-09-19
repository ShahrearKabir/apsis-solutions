import Axios from 'axios';
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import AuthService from '../../auth/AuthService';
import io from 'socket.io-client';
import decode from 'jwt-decode';
import { EmployeeLeaveApplication } from './EmployeeLeaveApplication';

export class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: props.userInfo,
            editProfile: false,
            editProfileObj: {
                first_name: "",
                last_name: "",
                phone_number: "",
                email: ""
            }
        }
    }

    componentDidMount() {
        this.setState({ userInfo: this.props.userInfo })
        // this.getUserInfo()
    }

    // getUserInfo() {
    //     const Auth = new AuthService();
    //     let url = process.env.REACT_APP_BASE_URL + "/user/list"   //'http://frontend.interview.dingi.work/user/data'
    //     let header = {
    //       headers: {
    //         Authorization: "Bearer " + Auth.getToken()
    //       }
    //     }

    //     Axios.get(url, header)
    //       .then(res => {
    //         if (res.status === 200) {
    //           this.setState({
    //             userData: res.data.data.user
    //           })
    //           // console.log("newShortedData", newShortedData);
    //         }
    //         else {
    //           console.log("Data not found");
    //         }
    //       }).catch(error => {
    //         console.log('Please check connection')
    //       });
    //   }

    editProfile = () => {
        this.setState({
            editProfile: !this.state.editProfile,
            editProfileObj: this.state.userInfo
        })
    }

    onChangeProfileData = (e) => {
        // console.log("onChangeProfileData", e.target.name);
        // console.log("onChangeProfileData", e.target.value);
        let { userInfo, editProfileObj } = this.state
        editProfileObj[e.target.name] = e.target.value
        this.setState({ editProfileObj })
    }

    onUpdateUserProfile = () => {
        let { editProfileObj, userInfo } = this.state
        delete editProfileObj.role_ids
        const Auth = new AuthService();
        let url = process.env.REACT_APP_BASE_URL + "/user/update"   //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        Axios.put(url, { editProfileObj }, header)
            .then(res => {
                if (res.status === 200) {
                    // this.setState({
                    //     userData: res.data.data.user
                    // })
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
                        userInfo._id,
                        {
                            editProfileObj,
                            socketID: socket.id,
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
        let { userInfo, editProfileObj } = this.state
        // console.log("userInfo", userInfo);

        return (
            <>
                <div className="main-section dashBoard-wrapper">
                    <section>
                        <div className="container-fluid" style={{ textAlign: 'left' }}>
                            <div className="container bg-white">
                                <div className="row">
                                    <div className="col-md-12 mt-4">
                                        <h3>
                                            User Profile
                                            <button
                                                className="btn btn-secondary float-right"
                                                onClick={this.editProfile}
                                            >
                                                <i class="fas fa-pen 3x"></i>
                                            </button>
                                        </h3>
                                        <div className="custom-title-border-left"></div>
                                    </div>
                                    <div className="col-md-6 my-2">
                                        <p>
                                            <h5>
                                                username: {userInfo && userInfo.user_id && userInfo.user_id.username}

                                            </h5>
                                            working as {userInfo && userInfo.role_ids && userInfo.role_ids.map((item, index) => {
                                                return <i>{item.name} {index > 0 ? ", " : null} </i>
                                            })}
                                        </p>
                                        <p>Name: {(userInfo && userInfo.first_name || null) + " " + (userInfo && userInfo.last_name || null)}</p>
                                        <p>Phone: {userInfo && userInfo.phone_number || null}</p>
                                        <p>Email: {userInfo && userInfo.email || null}</p>
                                    </div>

                                    {
                                        !this.state.editProfile ? null :
                                            <div className="col-md-6 my-2">
                                                <div className="row">
                                                    <div className="col-12 my-2">
                                                        First Name
                                                        <input
                                                            name="first_name"
                                                            className="form-control"
                                                            placeholder="First Name..."
                                                            value={editProfileObj.first_name}
                                                            onChange={this.onChangeProfileData}
                                                        />
                                                    </div>
                                                    <div className="col-12 my-2">
                                                        Last Name
                                                        <input
                                                            name="last_name"
                                                            className="form-control"
                                                            placeholder="Last Name..."
                                                            value={editProfileObj.last_name}
                                                            onChange={this.onChangeProfileData}
                                                        />
                                                    </div>
                                                    <div className="col-12 my-2">
                                                        Phone No.
                                                        <input
                                                            name="phone_number"
                                                            className="form-control"
                                                            placeholder="phone_number..."
                                                            value={editProfileObj.phone_number}
                                                            onChange={this.onChangeProfileData}
                                                        />
                                                    </div>
                                                    <div className="col-12 my-2">
                                                        Email
                                                        <input
                                                            name="email"
                                                            className="form-control"
                                                            placeholder="Email..."
                                                            value={editProfileObj.email}
                                                            onChange={this.onChangeProfileData}
                                                        />
                                                    </div>
                                                    <div className="col-12 my-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={this.onUpdateUserProfile}
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
                        <EmployeeLeaveApplication userInfo={userInfo} />
                    </section>
                </div>
            </>
        )
    }
}