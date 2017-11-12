import React from 'react';
import LoginForm from './LoginForm.jsx';
import Auth from '../../modules/Auth.js';
import { Redirect } from 'react-router-dom';


class LoginFormContainer extends React.Component {
	
	constructor(props) {
		super(props);

		const storedMessage = localStorage.getItem('successMessage');
		let successMessage = '';

		if (storedMessage) {
			successMessage = storedMessage;
			localStorage.removeItem('successMessage');
		}

		this.state = {
			errors: {},
			successMessage,
			user: {
				username: '',
				password: ''
			},
			redirectToHome: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const field = event.target.id;
		const user = this.state.user;
		user[field] = event.target.value;

		this.setState({
			user: user
		})
	}

	handleSubmit(event) {
		event.preventDefault();

		const username = encodeURIComponent(this.state.user.username);
		const password = encodeURIComponent(this.state.user.password);
		const formData = `username=${username}&password=${password}`;

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/auth/login');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.responseType = 'json';

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				console.log('successful xhr.response is: ' + xhr.response);

				Auth.authenticateUser(xhr.response.token);

				this.setState({
					errors: {},
					redirectToHome: true
				});
			} else {
				console.log('unsuccessful xhr.response is: ' + xhr.response)

				const errors = xhr.response.errors ? xhr.response.errors : {};
				errors.summary = xhr.response.message;

				this.setState({ errors });
			}
		});

		xhr.send(formData);
	}

	render() {
		if (this.state.redirectToHome) {
			return (
				<Redirect push to='/' />
			);
		}

		return (
			<LoginForm onSubmit={(e) => this.handleSubmit(e)}  onChange={(e) => this.handleChange(e)} errors={this.state.errors} user={this.state.user} successMessage={this.state.successMessage} />
		);
	}
}

export default LoginFormContainer;