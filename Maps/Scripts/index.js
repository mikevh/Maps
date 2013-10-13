var map;
var openInfoWindow;

function initialize() {
    var mapOptions = {
        zoom: 7,
        center: new google.maps.LatLng(47.22, -120.72),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map($('#map-canvas')[0], mapOptions);
}

function showMarkers(locations) {
    locations.forEach(function (loc) {
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

        google.maps.event.addListener(marker, 'click', function () {
            if (openInfoWindow != null) {
                openInfoWindow.close();
            }
            openInfoWindow = infowindow;
            infowindow.open(map, marker);
        });
    });
}

$(function () {
    initialize();

    $.get('/api/location', function (data) {
        showMarkers(data);
    });
});