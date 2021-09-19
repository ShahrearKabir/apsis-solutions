import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class SideBarLeft extends Component {
	constructor() {
		super();
		this.state = {
			
		};
	}

	render() {
		
		return (
			// <div className="sidebar-left sidebar-wrapper">
                <nav id="sidebar" className="sidebar-wrapper">
                    <div className="sidebar-content">
                        <div className="sidebar-menu">
                            <ul>
                                <li className="sidebar-dropdown">
                                    <Link to="/user-list">
                                        <i className="fas fa-user menu-box icon"></i>
                                        <span className="menu-box title text-secondary">User</span>
                                    </Link>
                                </li>

                                <li className="sidebar-dropdown">
                                    <Link to="/leave">
                                        <i className="fas fa-user menu-box icon"></i>
                                        <span className="menu-box title text-secondary">Leave</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
			// </div>
		)
	}
}