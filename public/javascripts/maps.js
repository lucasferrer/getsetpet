// CRIAÇÃO GOOGLE MAPS DA LOCALIDADE 
$(document).ready(function() {
    setTimeout(function(){ initMap(); }, 1000)
})

function initMap() {
    var map = new google.maps.Map(document.getElementById('google-maps'), {
        zoom: 16,
        center: { lat: -34.397, lng: 150.644 }
    });
    var geocoder = new google.maps.Geocoder();
    
    var styles = 
        [
          {
            featureType: 'poi.business',
            stylers: [{visibility: 'off'}]
          },
          {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          }
        ]
      
      var stylesNight = [
         {
            featureType: 'poi.business',
            stylers: [{visibility: 'off'}]
          },
          {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          },
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
        
      ]
      var d = new Date()
    if(d.getHours() >= 18){
        styles = stylesNight
    }
    map.setOptions({styles: styles})
    
    var address = [`Rua: Coronel José Venâncio Dias,549 , Vila Jaraguá  - SP`,
     `Rua: Coronel José Venâncio Dias,749 , Vila Jaraguá  - SP`,
      `Rua: Coronel José Venâncio Dias,249 , Vila Jaraguá  - SP`];
    var markerTitle = ["Alerta","Ok", "Grave"]
    var icons = ["ylw-diamond.png","grn-diamond.png", "red-diamond.png"]
    var windowContent = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
    '<div id="bodyContent">'+
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    '</p>'+
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
    '(last visited June 22, 2009).</p>'+
    '</div>'+
    '</div>';


    for (i = 0; i < address.length; i++){
    geocodeAddress(geocoder, map, address, markerTitle, icons,  windowContent, i);
    }
}

function geocodeAddress(geocoder, resultsMap, address, markerTitle, icons, windowContent , i) {
  var baseIconUrl = "http://maps.google.com/mapfiles/kml/paddle/"
    
        geocoder.geocode({ 'address': address[i] }, function (results, status) {
            console.log(results)
            if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            
            
            var contentString = windowContent;
      
        var infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 200
        });

            var titleMarker = markerTitle[i]
            // console.log(titleMarker)
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
                title: titleMarker,
                icon: baseIconUrl + icons[i]
            });
            // console.log(marker)
            marker.addListener('click', function() {
                infowindow.open(resultsMap, marker);
              });
        
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

}

      