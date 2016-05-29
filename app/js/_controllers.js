var app = angular.module('myApp');

app
.controller('LoginCtrl', ['$location', 'UserService', function($location, UserService) {

	var vm = this;

	//public methods
	vm.login = login;
	vm.createUser = createUser;

	activate();

	function activate() {
		//init my user
		vm.myUser = {};
		vm.errorMessage = "";
	}

	function login(myUser) {

		UserService.login(myUser.name, myUser.password).then(function success(response) {
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("owner", myUser.name);
			$location.path("/dashboard");
		}, function error(response) {
			vm.errorMessage = response.data.message;
		});	
	}

	function createUser(myUser) {
		UserService.postUser(myUser.name, myUser.password).then(function success(response) {
			console.log(response);
		}, function error(response) {
			console.log(response);
		});	
	}
}])

.controller('DashBoardCtrl', ['$location', 'GroupService',  function($location, GroupService) {

	var vm = this;

	//public methods
	vm.myGroups = myGroups;

	activate();

	function activate() {
		//init
		vm.groups = {};

		GroupService.getGroups().then(function success(response) {
			vm.groups = getArray(response.data);
		}, function error(err) {
			console.log(err);
		});
	}

	function myGroups() {
		$location.path("/mygroups");
	}

	function getArray(map) {
		var arr = [];

		for(var key in map) {
			if(map.hasOwnProperty(key)) {
				arr.push(map[key]);
			}
		}

		return arr;		
	}

}])

.controller('MyGroupsCtrl', ['$location', 'GroupService',  function($location, GroupService) {

	var vm = this;

	//public methods
	vm.createGroup = createGroup;
	vm.deleteGroups = deleteGroups;

	activate();

	function activate() {
		//init
		vm.groups = {};

		GroupService.getGroups().then(function success(response) {
			vm.groups = getArray(response.data);
		}, function error(err) {
			console.log(err);
		});
	}

	function createGroup() {
		$location.path("/group");
	}	

	function deleteGroups() {
		var groupId = [];

		if(vm.groups.length > 0) {			
			vm.groups.forEach(function (group) {
				if(group.select) {
					GroupService.deleteGroup(group.name).then(function success(response) {
						console.log(response.data);
						vm.mensagem = response.data;					
					}, function error(err) {
						console.log(err);
					});
				}
			});		
		}

		setTimeout(function() {
			activate();
		}, 1000);
	}

	function getArray(map) {
		var arr = [];

		for(var key in map) {
			if(map.hasOwnProperty(key)) {
				arr.push(map[key]);
			}
		}

		return arr;		
	}

}])

.controller('GroupCtrl', ['$location', 'GroupService', 'UserService',  function($location, GroupService, UserService) {

	var vm = this;

	//public methods
	vm.createGroup = createGroup;


	activate();

	function activate() {
		//init
		vm.myGroup = {};
		vm.users = {};

		UserService.getUsers().then(function success(response) {
			vm.users = getArray(response.data);
		}, function error(err) {
			console.log(err);
		});
	}

	function createGroup(myGroup) {
		var userLoged = localStorage.getItem("owner");
		var usersSelected = getUsersSelected(vm.users);

		GroupService.postGroup(myGroup.name, myGroup.description, userLoged, usersSelected).then(function success(response) {			
			console.log(response.data);
			vm.mensagem = response.data;
		}, function error(response) {
			console.log(response.data);
			vm.errorMessage = response.data. message;
		});

		$location.path("/mygroups");
	}	

	function getUsersSelected(users) {
		var arr = []

		users.forEach(function (user) {
			if(user.select) {
				delete user.select;
				arr.push(user);
			}
		});

		return arr;
	}

	function getArray(map) {
		var arr = [];

		for(var key in map) {
			if(map.hasOwnProperty(key)) {
				arr.push(map[key]);
			}
		}

		return arr;		
	}

}]);