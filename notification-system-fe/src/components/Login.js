import React, { Component } from 'react';
import AuthService from '../auth/AuthService';
import { Container, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.Auth = new AuthService();
        this.state = {
            username: "",
            password: "",
            errors: {}
        }
    }

    handleChange = event => {
        let { errors } = this.state
        errors[event.target.name] = ''
        this.setState({
            [event.target.name]: event.target.value, errors
        });
    }

    onSubmitErrorHandler = () => {
        let { errors } = this.state
        
        let formIsValid = true;
        if (!this.state.username) {
            errors["username"] = "Username can't left empty"
            formIsValid = false;
        }

        if (!this.state.password) {
            errors["password"] = "Password can't left empty"
            formIsValid = false;
        }

        this.setState({ errors })
        return formIsValid;
    }

    onSubmitHandler = (e) => {
        e.preventDefault()
        if (this.onSubmitErrorHandler()) {
            this.Auth.login(this.state.username, this.state.password)
                .then(res => {
                    console.log("log in submit clicked", res);
                    this.props.history.replace('/');
                })
                .catch(err => {
                    // this.setState({ loginErr: "Invalid Username or Password " })
                })
        }
    }

    render() {
        let { errors } = this.state
        return (
            <div className="gradian-bg">
                <div className="animated-circle blur-section">
                    <div className="circle-first"></div>
                    <div className="circle-second"></div>
                    <div className="circle-third"></div>
                </div>
                
                <Container>
                    {/* <div className="overlay-bg"></div> */}
                    <div className="wrap-login p-b-160 p-t-50">
                        <form className="login-form validate-form">
                            <span className="login-form-title p-b-43">
                                Account Login
                                <div className="custom-title-border-center"></div>
                                {/* <center className="error-msg">{ errors['username'] }</center> */}
                            </span>

                            <div className="wrap-input rs1 validate-input" data-validate="Username is required">
                                <input
                                    className="input"
                                    name='username'
                                    placeholder={ errors['username'] || 'Username'}
                                    value={this.state.username}
                                    onChange={this.handleChange}
                                />
                                {/* <center className="error-msg">{ errors['username'] }</center> */}
                            </div>


                            <div className="wrap-input rs2 validate-input" data-validate="Password is required">
                                <input
                                    type="password"
                                    className="input"
                                    name='password'
                                    placeholder={ errors['password'] || 'Password'}
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                                {/* <center className="error-msg">{ errors['password'] }</center> */}
                            </div>

                            <div className="container-login-form-btn">
                                <Button 
                                    variant="success" 
                                    className="login-form-btn"
                                    onClick={this.onSubmitHandler}
                                >
                                    Sign in
                                </Button>
                            </div>

                            
                                <h6 className="forget-pw-text w-100 d-flex">
                                    <Link className="text-white" to="/signup">Signup</Link> <Link to="#" className="text-white text-right">Forgot password?</Link>
                                </h6>
                        </form>
                    </div>
                </Container>
            </div>
            
        )
    }
}