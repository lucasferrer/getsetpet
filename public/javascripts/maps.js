// CRIAÇÃO GOOGLE MAPS DA LOCALIDADE 
$(document).ready(function () {
  setTimeout(function () { initMap(); }, 1000)
})

function initMap() {
  var map = new google.maps.Map(document.getElementById('google-maps'), {
    zoom: 15,
    center: { lat: -34.397, lng: 150.644 }
  });
  var geocoder = new google.maps.Geocoder();

  var styles =
    [
      {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      }
    ]

  var stylesNight = [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }]
    },
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }]
    }

  ]
  var d = new Date()
  if (d.getHours() >= 18) {
    styles = stylesNight
  }
  map.setOptions({ styles: styles })

  var address = [`Rua: Coronel José Venâncio Dias,549 , Vila Jaraguá  - SP`,
    `Rua: Coronel José Venâncio Dias,749 , Vila Jaraguá  - SP`,
    `Rua: Coronel José Venâncio Dias,249 , Vila Jaraguá  - SP`];
  var markerTitle = ["Ok", "Grave", "Alerta"]
  var icons = ["ok.png", "problem.png", "alert.png"]
  var windowContent = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h2 id="firstHeading" class="firstHeading">PetShop João</h2>' +
    '<div id="bodyContent">' +
    '<p><b>Status:</b> Com problemas' +
    '</p>' +
    '<p>Para maiores informações acesse: <br><a href="/chart">' +
    'Dashboard localidade</a> ' +
    '</p>' +
    '</div>' +
    '</div>';


  for (i = 0; i < address.length; i++) {
    geocodeAddress(geocoder, map, address, markerTitle, icons, windowContent, i);
  }
}

function geocodeAddress(geocoder, resultsMap, address, markerTitle, icons, windowContent, i) {
  // var baseIconUrl = "img/"
  var baseIconUrl = {
    url: "img/" + icons[i], // url
    scaledSize: new google.maps.Size(35, 35), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  geocoder.geocode({ 'address': address[i] }, function (results, status) {
    lastWindow = null;
    // console.log(results)
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
        icon: baseIconUrl
      });
      // console.log(marker)
      marker.addListener('click', function () {
        if (lastWindow) lastWindow.close();
        infowindow.open(resultsMap, marker);
        lastWindow = infowindow;
        // infowindow.open(resultsMap, marker);
      });

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

}

