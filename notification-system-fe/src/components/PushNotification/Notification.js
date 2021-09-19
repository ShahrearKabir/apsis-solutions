import Axios from 'axios';
import React, { Component } from 'react';
import { Alert, Button, Modal, Table } from 'react-bootstrap';
import AuthService from '../../auth/AuthService';
import decode from 'jwt-decode';

export class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationCount: 0,
            notificationData: []
        }
    }

    componentDidMount() {
        const Auth = new AuthService();
        let token = decode(Auth.getToken())
        this.getNotificationData(token.profile_id)
    }

    getNotificationData(profile_id) {
        const Auth = new AuthService();
        let url = process.env.REACT_APP_BASE_URL + "/notification/list/by/" + profile_id  //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        Axios.get(url, header)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        notificationData: res.data.data.notificationList,
                        notificationCount: this.state.notificationCount + res.data.data.notificationList.length
                    })
                    console.log("topbar state", this.state);
                }
                else {
                    console.log("Data not found");
                }
            }).catch(error => {
                console.log('Please check connection')
            });
    }

    onUpdateNotification = (item, read_status) => {
        let { editProfileObj } = this.state
        const Auth = new AuthService();
        let token = decode(Auth.getToken())
        let url = process.env.REACT_APP_BASE_URL + "/notification/update"   //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        item.read_status = read_status
        Axios.put(url, { item }, header)
            .then(async res => {
                if (res.status === 200) {
                    // await this.handleClose()
                    this.getNotificationData(token.profile_id)
                    console.log("update res", res);
                }
                else {
                    console.log("Data not found");
                }
            }).catch(error => {
                console.log('Please check connection')
            });
    }

    render() {
        let { userData, roleData, isModalVisiable, notificationData } = this.state

        let filterTable = (event, index) => {
            var filter = event.target.value.toUpperCase();
            var rows = document.querySelector("#myTable tbody").rows;
            for (var i = 0; i < rows.length; i++) {
                var firstCol = rows[i].cells[2].textContent.toUpperCase();
                var secondCol = rows[i].cells[3].textContent.toUpperCase();
                var thirdCol = rows[i].cells[4].textContent.toUpperCase();
                if ((firstCol.indexOf(filter) > -1 && index == 0)
                    || (secondCol.indexOf(filter) > -1 && index == 1)
                    || (thirdCol.indexOf(filter) > -1 && index == 2)) {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
        }

        document.querySelectorAll('input.w3-input').forEach((el, idx) => {
            el.addEventListener('keyup', (e) => {
                filterTable(e, idx);
            }, false);
        });

        return (
            <div className="main-section dashBoard-wrapper">
                <section>
                    <div className="container-fluid">
                        <div className="container bg-white" style={{ textAlign: 'left' }}>
                            <div className="row">
                                <div className="col-md-12 mt-4">
                                    <h3>Notifications</h3>
                                    <div className="custom-title-border-left"></div>
                                </div>
                                <div className="col-md-12 my-2">
                                    <div className="">
                                        {
                                            notificationData.map((item, index) => {
                                                return <Alert variant={item.read_status == 1 ? "secondary" : "success"}>
                                                    <Alert.Heading className="text-capitalize">{item.type} <small><i>{new Date(item.createdAt).toLocaleString()}</i></small></Alert.Heading>
                                                    <p>
                                                        {item.type} by {item.from.username}
                                                    </p>
                                                    <hr />
                                                    <p className="mb-0">
                                                        <Button variant="success" onClick={() => this.onUpdateNotification(item, 1)}> Read </Button>
                                                        <Button variant="secondary" onClick={() => this.onUpdateNotification(item, 0)}> Unread </Button>
                                                    </p>
                                                </Alert>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </section>
            </div>
        )
    }
}