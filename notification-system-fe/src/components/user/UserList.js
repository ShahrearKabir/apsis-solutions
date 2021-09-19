import Axios from 'axios';
import React, { Component } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import AuthService from '../../auth/AuthService';

export class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: props.userInfo,
            userData: [],
            roleData: [],
            isModalVisiable: false,
            currentRowData: {},
            managerLevelUser: [],
            editProfileObj: {
                first_name: "",
                last_name: "",
                phone_number: "",
                role_ids: [],
                manager_id: ""
            }
        }
    }

    componentDidMount() {
        // this.setState({ userData : this.props.userData })
        this.getUserData()
        this.getRoleData()
    }

    getUserData() {
        const Auth = new AuthService();
        let url = process.env.REACT_APP_BASE_URL + "/user/list"   //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        Axios.get(url, header)
            .then(res => {
                if (res.status === 200) {
                    let ManagerRole = ["HR_MANAGER", "MANAGER"]
                    let getAllUser = res.data.data.user
                    let managerLevelUser = getAllUser.filter(item => item.role_ids.every(value => ManagerRole.includes(value.name)))
                    this.setState({
                        userData: getAllUser,
                        managerLevelUser
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

    getRoleData() {
        const Auth = new AuthService();
        let url = process.env.REACT_APP_BASE_URL + "/role/list"   //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        Axios.get(url, header)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        roleData: res.data.data.roleList
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

    managerDropdownChanged = (e) => {
        let { editProfileObj } = this.state
        const values = e.target.value
        console.log("target.selectedOptions", values);
        editProfileObj.manager_id = values
        this.setState({ editProfileObj })
    }

    roleDropdownChanged = (e) => {
        let { editProfileObj } = this.state
        const values = [...e.target.selectedOptions].map(opt => opt.value);
        console.log("target.selectedOptions", values);
        editProfileObj.role_ids = values
        this.setState({ editProfileObj })
    }

    handleShow = (rowData) => {
        let { editProfileObj } = this.state

        editProfileObj._id = rowData._id
        editProfileObj.first_name = rowData.first_name
        editProfileObj.last_name = rowData.last_name
        editProfileObj.phone_number = rowData.phone_number

        this.setState({
            currentRowData: rowData,
            isModalVisiable: !this.state.isModalVisiable,
            editProfileObj
        })
    }
    handleClose = () => {
        this.setState({
            currentRowData: {},
            isModalVisiable: false
        })
    }

    onUpdateUserProfile = () => {
        let { editProfileObj } = this.state
        
        const Auth = new AuthService();
        let url = process.env.REACT_APP_BASE_URL + "/user/update"   //'http://frontend.interview.dingi.work/user/data'
        let header = {
            headers: {
                Authorization: "Bearer " + Auth.getToken()
            }
        }

        Axios.put(url, { editProfileObj }, header)
            .then(async res => {
                if (res.status === 200) {
                    // this.setState({
                    //     userData: res.data.data.user
                    // })
                    await this.getUserData()
                    await this.handleClose()
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
        let { userData, roleData, isModalVisiable, managerLevelUser, userInfo } = this.state
        // let { userInfo } = this.props
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
                        <div className="container bg-white">
                            <div className="row">
                                <div className="col-md-12 mt-4" style={{ textAlign: 'left' }}>
                                    <h3>User Data List</h3>
                                    <div className="custom-title-border-left"></div>
                                </div>
                                <div className="col-md-12 my-2">
                                    <Table striped bordered hover id="myTable">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Username</th>
                                                <th>First Name <input id="inputName" className="w3-input" placeholder="First Name..." />
                                                </th>
                                                <th>Designation <input id="inputRole" className="w3-input" placeholder="Designation..." />
                                                </th>
                                                <th>Phone <input id="inputPhone" className="w3-input" placeholder="Phone..." />
                                                </th>
                                                <th>Manager</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                userData.map((item, index) =>
                                                    <tr className="item">
                                                        <td style={{ width: '150px' }}>{new Date(item.createdAt).toLocaleString()}</td>
                                                        <td className="text-left">
                                                            username: {item.user_id.username}
                                                            <br />
                                                            email: {item.email}
                                                        </td>
                                                        <td>{(item.first_name || "") + " " + (item.last_name || "")}</td>
                                                        <td>
                                                            {
                                                                item.role_ids.map(item => {
                                                                    return item.name + ", "
                                                                })
                                                            }
                                                        </td>
                                                        <td>{item.phone_number}</td>
                                                        <td>{(item.manager_id && item.manager_id.first_name || "") + " " + (item.manager_id && item.manager_id.last_name || "")}</td>
                                                        <td>
                                                            {
                                                                userInfo && userInfo.role_ids.map(role => {
                                                                    if (role.name == "MANAGER" || role.name == "HR_MANAGER") {
                                                                        return <Button variant="primary" onClick={() => this.handleShow(item)}>
                                                                            Edit
                                                                        </Button>
                                                                    }
                                                                    else{
                                                                        return null
                                                                    }
                                                                })
                                                            }

                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </div>

                            <Modal show={isModalVisiable} onHide={this.handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Modal heading</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col-12 my-2">
                                            Choose Manager
                                            <select
                                                className="form-control"
                                                aria-label="multiple select example"
                                                onChange={this.managerDropdownChanged}
                                            >
                                                <option selected>Open this select menu</option>
                                                {
                                                    managerLevelUser.map(item => {
                                                        return <option value={item._id}>{item.first_name + " " + item.last_name}</option>
                                                    })
                                                }
                                            </select>
                                        </div>

                                        <div className="col-12 my-2">
                                            Choose Roles
                                            <select
                                                style={{ height: "80px" }}
                                                className="form-control"
                                                multiple
                                                aria-label="multiple select example"
                                                onChange={this.roleDropdownChanged}
                                            >
                                                <option selected>Open this select menu</option>
                                                {
                                                    roleData.map(item => {
                                                        return <option value={item._id}>{item.name}</option>
                                                    })
                                                }
                                            </select>
                                        </div>

                                        {/* <div className="col-12 my-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={this.onUpdateUserRole}
                                            >
                                                Update Role
                                            </button>
                                        </div> */}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={this.handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={this.onUpdateUserProfile}>
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}