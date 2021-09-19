import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../assets/scss/_topbar.scss'
import AuthService from '../../auth/AuthService';
import { Navbar, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import decode from 'jwt-decode';
import Axios from 'axios';

// import Logo from '../../assets/images/logo.png'

// const Auth = new AuthService();
// let countPending= 0, countSolved= 0;



export class AppTopbar extends Component {

	static defaultProps = {
		history: null
	}

	static propTypes = {
		history: PropTypes.object
	}

	constructor(props) {
		super();
		this.state = {
			notificationCount: 0,
			notificationData: []
		};


	}

	componentWillMount() {
		const Auth = new AuthService();
		const BASE_URL = process.env.REACT_APP_BASE_URL
		let token = decode(Auth.getToken())
		const socket = io(BASE_URL, {
			auth: {
				token: Auth.getToken(),
			},
			transports: ['polling', 'websocket'],
		});

		console.log("this.props && this.props.userInfo && this.props.userInfo._id", this.props && this.props.userInfo && this.props.userInfo);
		console.log("token topbar", token);
		// socket.on(this.props && this.props.userInfo && this.props.userInfo._id, data => {
		socket.on(token.profile_id, data => {
			// this.previewLiverun = true;
			console.log('liverun data', data);
			this.setState({ notificationCount: this.state.notificationCount + 1 })
		})

		socket.on(token.profile_id + "addLeave", data => {
			this.setState({ notificationCount: this.state.notificationCount + 1 })
		})

		socket.on(token.profile_id + "leaveApproved", data => {
			this.setState({ notificationCount: this.state.notificationCount + 1 })
		})

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
					let result = res.data.data.notificationList.filter(item => item.read_status == 0)
					this.setState({
						notificationData: result,
						notificationCount: this.state.notificationCount + result.length
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

	handleLogout = () => {
		const Auth = new AuthService();
		Auth.logout();

		console.log("this.props", this.props);
		// this.props.history.push('/login');

		this.props.history.replace("/login")
	}

	render() {

		return (
			<Navbar bg="dark" expand="lg" className="app-topbar">
				<Navbar.Brand href="/">
					{/* <img src={Logo} className="logo"/> */}
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Link className="nav-link" to="/">Dashboard</Link>
						{/* <Link className="nav-link" to="/sales-item-list">Item List</Link> */}
					</Nav>

					<span className="d-inline-block mr-3">
						<Link className="notification" to="/notification" tooltip="Sign Out">
							<i className="fas fa-bell 3x"></i><span className="badge badge-light">{this.state.notificationCount || 0}</span>
						</Link>
					</span>

					<span className="d-inline-block mr-3">
						<Link className="profile" to="/profile-info" tooltip="Sign Out"><i className="fas fa-user-alt 3x"></i></Link>
					</span>

					<OverlayTrigger
						placement="bottom"
						overlay={<Tooltip id="tooltip-disabled">Sign Out</Tooltip>}
					>
						<span className="d-inline-block">
							<a className="sign-out" onClick={this.handleLogout} tooltip="Sign Out"><i className="fas fa-sign-out-alt 3x"></i></a>
						</span>
					</OverlayTrigger>




				</Navbar.Collapse>
			</Navbar>
		)
	}
}