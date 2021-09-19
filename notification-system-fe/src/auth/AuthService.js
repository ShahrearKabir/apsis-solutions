import decode from 'jwt-decode';
export default class AuthService {
    constructor(domain) {
        this.domain = process.env.REACT_APP_BASE_URL //"http://localhost:5000";
        this.login = this.login.bind(this)
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        this.token = {
            'jwt_token': '',
            'refreshToken': ''
        }
    }

    login(username, password) {
        let url = this.domain + '/auth/signin';
        const headers = {
            'Content-Type': 'application/json',
        }

        const data = {
            "username": username, 
            "password": password
        }

        console.log("DATA:::", data);
        

        return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(data)
                })
                .then(this._checkStatus)
                .then(response => response.json())
                .then(res => {
                    let jwt_token = res.data.accessToken
                    const decoded = decode(jwt_token);
                    console.log('Decoded', decoded)

                    this.setTokenObjectToStore(jwt_token, jwt_token) 
                    return Promise.resolve(res);
                })
    }

    signup(username, password) {
        let url = this.domain + '/auth/signup';
        const headers = {
            'Content-Type': 'application/json',
        }

        const data = {
            "username": username, 
            "password": password
        }

        console.log("DATA:::", data);
        

        return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(data)
                })
                .then(this._checkStatus)
                .then(response => response.json())
                .then(res => {
                    return Promise.resolve(res);
                })
    }

    async loggedIn() {
        let token = this.getToken() // GEtting token from localstorage
        
        return !!token // handwaiving here
    }

    setTokenObjectToStore(jwt_token, refreshToken) {
        // Saves user token to localStorage
        let token = {
            'jwt_token': jwt_token,
            'refreshToken': refreshToken
        }
        localStorage.setItem('Token', JSON.stringify(token));
    }

    getToken() {
        // Retrieves the user token from localStorage
        const Token = JSON.parse(localStorage.getItem('Token'));
        if (Token == null) {
            return null;
        }
        return Token.jwt_token;
    }

    logout() {
        localStorage.removeItem('Token');
        localStorage.clear();
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}