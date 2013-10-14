var app = angular.module('maps', []);

app.controller('Index', function($scope, $http) {

    var map;
    var openInfoWindow;

    $scope.toggleGroup = function(obj) {
        obj.Show = !obj.Show;
    };

    $scope.showMarkers = function(locations) {
        locations.forEach(function(loc) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(loc.Latitude, loc.Longitude),
                map: map,
                title: loc.Name,
                animation: google.maps.Animation.DROP
            });

            var contentString = '<a href="/Location/Details/' + loc.Id + '">' + loc.Name + '</a>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString,
            });

            google.maps.event.addListener(marker, 'click', function() {
                if (openInfoWindow != null) {
                    openInfoWindow.close();
                }
                openInfoWindow = infowindow;
                infowindow.open(map, marker);
            });
        });
    };

    $scope.initializeMap = function () {
        var mapOptions = {
            zoom: 7,
            center: new google.maps.LatLng(47.22, -120.72),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map($('#map-canvas')[0], mapOptions);
    };

    $scope.initializeMap();

    $http.get('/api/location').success(function (data) {
        $scope.showMarkers(data);
    }).error(function (data) { alert(data); });

    $http.get('/api/category').success(function (data) {
        data.forEach(function(cat) {
            cat.Show = true;
        });
        $scope.categories = data;
    });
});
