import React, { Component } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import App from "./App";
import Login from './components/Login';
import AuthService from './auth/AuthService';
import decode from 'jwt-decode';
import Signup from './components/Signup';
// import { GUEST_POINT, BIJOY_POINT } from './utils/PointWiseRouteConsts';


class AppWrapper extends Component {
	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			window.scrollTo(0, 0)
		}
	}

	render() {
		const Auth = new AuthService();
		const isLog = Auth.getToken();

		console.log("isLog", isLog);

		switch (this.props.location.pathname) {
			case "/login":
				if (!isLog) {
					return <Route path="/login" component={Login} />
				}
				else {
					let userInfo = decode(isLog)
					console.log("userInfo", userInfo);
					
					return <Route
						render={props => (
							<Redirect to={{
								pathname: '/'
							}} />

						)}
					/>
				}

			case "/signup":
				return <Route path="/signup" component={Signup} />
			default:
				// Updated at 23-10-2019 by ABsiddik
				switch (isLog) {
					case null:
						return <div>
							<Route
								render={props => (
									<Redirect to={{
										pathname: '/login'
									}} />

								)}
							/>
						</div>
					default:
						return <App props={this.props} />;
				}
			// return <App props={this.props} />;
		}
	}
}

export default withRouter(AppWrapper);