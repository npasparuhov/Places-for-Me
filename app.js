var map, infowindow, index=0, locations = 0;
var earth_r = 6371000;
var latitude = 25.780427;
var longitude = -80.191623;
var ref = new Firebase("https://mapdata.firebaseio.com/"); //create database

function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: new google.maps.LatLng(25.780427, longitude)
    });

    infowindow = new google.maps.InfoWindow();

    var local = setInterval(function(){
        var service = new google.maps.places.PlacesService(map);
        var request = {
            location: new google.maps.LatLng(latitude, longitude),
            radius: 300,
            types: ['cafe', 'restaurant', 'gas_station', 'store', 'gym', 'night_club']
        };

        service.nearbySearch(request, callback);
        latitude = latitude + (500 / earth_r) * (180 / Math.PI);
        index++;
        console.log(index + "     " + locations);
        if(index % 100 == 0){ 
            longitude = longitude - (500 / earth_r) * (180 / Math.PI) / Math.cos(latitude * Math.PI/180);
            latitude = 25.780427;
        }
        if(index == 100)clearInterval(local);
    }, 500);

    function callback(result, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){
            for(var i = 0; i<result.length; i++){
                createMarker(result[i]);
                locations++;
            }
        }
    }
    
    function createMarker(place){
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });
        google.maps.event.addListener(marker, 'click', function(){
            infowindow.setContent(place.name + "\n" + place.vicinity);
            infowindow.open(map, this);
        });
    }
}

function postData(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            console.log(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "https://simpledb.firebaseio.com/proba", true); // true for asynchronous 
    xmlHttp.send(null);
}


google.maps.event.addDomListener(window, 'load', initialize);