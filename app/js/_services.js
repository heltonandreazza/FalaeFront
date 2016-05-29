var app = angular.module('myApp');
var prefix = "http://helton-pc:8080/FalaeWEB/FalaeWEB/falaesvc/";

app.factory('UserService', ['$http', function($http) {
	
	var service = {
		login: login,
		getUsers: getUsers,
		postUser: postUser
	};

	function login(user, password) {
		return $http({
			method: 'POST',
			url: prefix + 'login',
			data: {
				user: user,
				password: password
			}
		});
	}

	function getUsers() {
		return $http({
			method: 'POST',
			url: prefix + 'getUsers',
			data: {
				token: localStorage.getItem("token")
			}
		});
	}

	function postUser(name, password) {
		var data = {
			id: 1,
			name: name,
			password: password
		}
		console.log(data);
		return $http({
			method: 'POST',
			url: prefix + 'postUser',
			data: data
		});
	}	

	return service;
}])

.factory('GroupService', ['$http', function($http) {

	var service = {
		getGroups: getGroups,
		postGroup: postGroup,
		deleteGroup: deleteGroup
	};

	function getGroups() {
		return $http({
			method: 'POST',
			url: prefix + 'getGroups',
			data: {
				token: localStorage.getItem("token")
			}
		});
	}

	function postGroup(name, description, owner, users) {
		var data = {
			id: 1,
			name: name,
			description: description,
			owner: owner,
			users: users,				
			token: localStorage.getItem("token")
		}

		console.log(JSON.stringify(data));

		return $http({
			method: 'POST',
			url: prefix + 'postGroup',
			data: data
		});
	}

	function deleteGroup(name) {
		return $http({
			method: 'POST',
			url: prefix + 'deleteGroup',
			data: {
				name: name,
				token: localStorage.getItem("token")
			}
		});
	}

	return service;
}]);
