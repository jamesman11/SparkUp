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
        .state('profile',{
            url: "/profile",
            templateUrl: "partials/profile.html.erb",
            controller: profileCtrl
        })
});
myapp.controller('signUpCtrl', signUpCtrl)
     .controller('signInCtrl',signInCtrl)
     .controller('mainCtrl', mainCtrl)
     .controller('userCtrl', userCtrl)
     .controller('profileCtrl', profileCtrl);
function profileCtrl($scope, $location){
    $scope.data = gon.profile;
    $scope.tags = ["User Experience","Marketing", "Engineering", "Human Resource", "Operation", "Merchandising"];
    $scope.selected_tags = $scope.data.interest ? $scope.data.interest.split(',') : [];
    $scope.addInterest = function(context){
        $scope.selected_tags.push(context.tag);
    };
    $scope.removeInterest = function($index){
        $scope.selected_tags.splice($index, 1);
    };
    $scope.cancel = function(){
        $location.path('/main');
    };
    $scope.save = function(){
        if($scope.selected_tags !== 0){
            $scope.data.interest = $scope.selected_tags.join(',');
        }
        $.ajax({
            url: "/profile/" + $scope.data.id,
            type: "PUT",
            dataType: "json",
            data: {
                data: $scope.data
            },
            success: function(data){
                alert('profile saved!');
            }
        })
    };
}
function userCtrl($scope, $location){
    $scope.is_user_sign_in = gon.current_user ? true : false;
    $scope.profile = function(){
      $location.path('profile');
    };
    $scope.welcome_message = function(){
        var name = gon.profile.name.split(" ")[0];
        var str = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        return "Hello, " + str;
    }
}
function mainCtrl($scope, $location){
    $scope.just_joined_profile_list = [
        {
            name: 'James Man',
            role: 'Sr Software Engineer',
            image_url: '/images/jamesman.jpg'
        },
        {
            name: 'Xinxin Dai',
            role: 'Sr Software Engineer',
            image_url: '/images/xinxin.png'
        },
        {
            name: 'Cici Liu',
            role: 'ItemSetup Manager',
            image_url: '/images/cici.png'
        },
        {
            name: 'Zhaochang He',
            role: 'UX Designer',
            image_url: '/images/xiaozhao.jpg'
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
    },
    $scope.tags = ["User Experience","Marketing", "Engineering", "Human Resource", "Operation", "Merchandising"];
    $scope.selected_tags = $scope.data.interest ? $scope.data.interest.split(',') : [];
    $scope.addInterest = function(context){
        $scope.selected_tags.push(context.tag);
    };
    $scope.removeInterest = function($index){
        $scope.selected_tags.splice($index, 1);
    };
    $scope.cancel = function(){
        $location.path('/main');
    };
    $scope.save = function(){
        if($scope.selected_tags !== 0){
            $scope.data.interest = $scope.selected_tags.join(',');
        }
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
    };
};