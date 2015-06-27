var myapp = angular.module('myapp', ["ui.router"]);
myapp.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/main");
    $stateProvider
        .state('signup', {
            url: "/signup",
            templateUrl: "partials/signup.html.erb",
            controller: signUpCtrl
        })
        .state('signin', {
            url: "/signin",
            templateUrl: "partials/signin.html.erb",
            controller: signInCtrl
        })
        .state('main',{
            url: "/main",
            templateUrl: "partials/main.html.erb",
            controller: mainCtrl
        })
});
myapp.controller('signUpCtrl', signUpCtrl).controller('signInCtrl',signInCtrl).controller('mainCtrl', mainCtrl);
function mainCtrl($scope, $location){
    $scope.just_joined_profile_list = [
        {
            name: 'James',
            role: 'MaiMeng Specialist',
            image_url: 'http://pubpages.unh.edu/~ltp6/Project_3/cute-dog2.jpg'
        },
        {
            name: 'Xinxin',
            role: 'Application Dev',
            image_url: 'http://pifeed.com/avatars/default-profile_250.jpg'
        },
        {
            name: 'Hello',
            role: 'Application Dev',
            image_url: 'http://pifeed.com/avatars/default-profile_250.jpg'
        },
        {
            name: 'World',
            role: 'Application Dev',
            image_url: 'http://pifeed.com/avatars/default-profile_250.jpg'
        }
    ];

    $scope.popular_team_list = [
        {
            name: 'User Experience',
            num_of_invite: 500
        },
        {
            name: 'Merchandise',
            num_of_invite: 400
        },
        {
            name: 'Personalization',
            num_of_invite: 400
        }
    ];

    $scope.invite = {
        avl_teams: [
            'User Experience Team'
        ],
        avl_loc: [
            'San Bruno Cafe',
            'Sunnyvale Cafe'
        ],

        selected: {
            team: '',
            time: '',
            loc: '',
            message: ''
        }
    };

    $scope.submitInvite = function(){
        var data = $scope.invite.selected;
        $.ajax({
            url: "/request",
            type: "POST",
            dataType: "json",
            data: {
                data: {
                    who: data.team,
                    when: data.time,
                    where: data.loc,
                    message : data.message,
                    owner_id: '1'
                }
            },
            success: function(data){
                alert('sign up success');
            }
        })
    }

};
function signInCtrl($scope, $location){
    $scope.initialize = function () {
        $scope.user_data = {
            username : "",
            password : ""
        }
    };
    $scope.login = function(){
        $.ajax({
            url: "/user/login",
            type: "POST",
            dataType: "json",
            data: {
                user_data: $scope.user_data
            },
            success: function(data){
                alert('sign up success');
            },
            error: function(){
                alert('login failures');
            }
        })
    };
    $scope.cancel = function(){
        $location.path('/main');
    }
}
function signUpCtrl($scope, $location){
    $scope.initialize = function () {
        $scope.data ={
            location : "",
            name : "",
            title : "",
            description : "",
            interest : ""
        },
        $scope.user_data = {
            username : "",
            password : ""
        }
    };

    $scope.save = function(){
        $.ajax({
            url: "/user",
            type: "POST",
            dataType: "json",
            data: {
                profile: $scope.data,
                user_data : $scope.user_data
            },
            success: function(data){
                alert('sign up success');
            }
        })
    };
    $scope.cancel = function(){
        $location.path('/main');
    }
};