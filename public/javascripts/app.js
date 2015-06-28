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
        .state('team', {
            url: "/team",
            templateUrl: "partials/team.html.erb",
            controller: teamCtrl
        })
        .state('org', {
            url: "/org",
            templateUrl: "partials/org.html.erb"
        })
        .state('inbox', {
            url: "/inbox",
            abstract: true,
            templateUrl: "partials/inbox.html.erb",
            controller: inboxController
        })
        .state('inbox.sent', {
            url: '/sent',
            views: {
                'request': {
                    templateUrl: 'partials/inbox_sent.html.erb',
                    controller: requestSentController
                }
            }
        })
        .state('inbox.rcv', {
            url: '/rcv',
            views: {
                'request': {
                    templateUrl: 'partials/inbox_rcv.html.erb',
                    controller: requestReceivedController
                }
            }
        });

});
myapp.controller('signUpCtrl', signUpCtrl)
     .controller('signInCtrl',signInCtrl)
     .controller('headerCtrl',headerCtrl)
     .controller('mainCtrl', mainCtrl)
     .controller('userCtrl', userCtrl)
     .controller('profileCtrl', profileCtrl)
     .controller('InboxController', inboxController)
     .controller('RequestSentController', requestSentController)
     .controller('RequestReceivedController', requestReceivedController)
     .controller('teamCtrl',teamCtrl);

function teamCtrl($scope, $location){
    $scope.teams = gon.teams;
    $scope.getNumbers = function(team){
        var array = new Array(team.members_count);
        for(var i = 0;i>array.length;i++) array[i]= 1;
        return array;
    };
    $scope.org = function(){
        $location.path('/org');
    }
}
function inboxController($scope, $location) {
    var isReq = $location.path() === "/inbox/sent" ? false : true;
    $scope.nav = {
        sentClass: isReq ? '' : 'active',
        reqClass: isReq ? 'active' : ''
    }

    $scope.nav.clicked = function(sentPage) {
        $scope.nav.sentClass = sentPage ? 'active' : '';
        $scope.nav.reqClass = sentPage ? '' : 'active';
    }
};

function requestSentController($scope) {
    var NO_RESPONSE_MESSAGE = "No Response Yet";
    var DECLINE_MESSAGE = "Declined";
    var ACCEPT_MESSAGE = "Accepted";
    $scope.requests = gon.sent_requests;
    $scope.msgClass = function($index){
        var request = $scope.requests[$index];
        if(request.status == NO_RESPONSE_MESSAGE) return "";
        return request.status == ACCEPT_MESSAGE ? {"color": "rgb(128, 212, 161)" } : {"color": "#fc7b89" };
    }
};

function requestReceivedController($scope) {
    var NO_RESPONSE_MESSAGE = "No Response Yet";
    var DECLINE_MESSAGE = "Declined";
    var ACCEPT_MESSAGE = "Accepted";
    $scope.requests = gon.all_request;
    $scope.is_no_response = function($index){
        var request = $scope.requests[$index];
        return request.status == NO_RESPONSE_MESSAGE;
    };
    $scope.msgClass = function($index){
        var request = $scope.requests[$index];
        return request.status == ACCEPT_MESSAGE ? {"color": "rgb(128, 212, 161)" } : {"color": "#fc7b89" };
    }
    $scope.removeRequest = function($index){
        var request = $scope.requests[$index];
        $.ajax({
            url: "request/decline/" + request.id,
            type: "POST",
            success: function(){
                request.status = DECLINE_MESSAGE;
                $scope.$apply();
            }
        })
    };
    $scope.accept = function($index){
        var request = $scope.requests[$index];
        $.ajax({
            url: "request/accept/" + request.id,
            type: "POST",
            success: function(){
                request.status = ACCEPT_MESSAGE;
                $scope.$apply();
            }
        })
    };
}

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
    $scope.profile_image_url = gon.profile.avatar;
    $scope.profile = function(){
      $location.path('profile');
    };
    $scope.welcome_message = function(){
        var name = gon.profile.name.split(" ")[0];
        var str = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        return "Hello, " + str;
    };
    $scope.signout = function(){
        $.ajax({
            url: "/user/sign_out",
            type: "POST",
            success: function(data){
                $scope.is_user_sign_in = false;
                $scope.$apply();
                alert('Sign out success');
            }
        })
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
        avl_teams: gon.teams,
        avl_loc: [
            '950 Elm San Bruno',
            '850 Cherry San Bruno',
            '640 California Sunnyvale',
            '860 California Sunnyvale'
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
                    owner_id: gon.current_user.id
                }
            },
            success: function(data){
                $scope.invite.selected = {
                    team: '',
                    time: '',
                    loc: '',
                    message: ''
                }
                alert('public invite sent!');
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
        var location = $location;
        $.ajax({
            url: "/user/login",
            type: "POST",
            dataType: "json",
            data: {
                user_data: $scope.user_data
            },
            success: function(data){
                location.path('/main');
                $scope.$apply();
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

function headerCtrl($scope,$location){
    $scope.home = function(){
        $location.path('main');
    }
}