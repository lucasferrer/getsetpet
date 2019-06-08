var ctxStatus = document.getElementById("myPieChart").getContext('2d');
var chartStatus = new Chart(ctxStatus, {
  type: 'doughnut',
  data: {
    labels: ['grave', 'alerta', 'ok'],
    datasets: [{
      data: [],
      backgroundColor: ['#e74a3b', '#f6c23e', '#1cc88a'],
      hoverBackgroundColor: ['darkred', 'yellow', 'green'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,

    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,

  },
});

var chartHistorico = new Chart(document.getElementById("chartHistoricoStatus"), {

  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: [],
      label: "Ok",
      borderColor: "#1cc88a",
      fill: false,
      borderWidth: 4,
    }, {
      data: [],
      label: "Alerta",
      borderColor: "#f6c23e",
      fill: false,
      borderWidth: 4,
    }, {
      data: [],
      label: "Grave",
      borderColor: "#e74a3b",
      fill: false,
      borderWidth: 4,
    },
    ]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Quantidades de cada ocorrência por dia',
      fontsize: 18
    }
  }
});

$(document).ready(function () {
  setTimeout(function () { initMap(); }, 1000)
})


function atualizaChartStatusPieComParametro(dados) {

  grave = 0
  alerta = 0
  ok = 0
  for (i = 0; i < dados.length; i++) {
    if (dados[i] == "Grave") {
      grave++
    }
    else if (dados[i] == "Alerta") {
      alerta++
    }
    else if (dados[i] == "Ok") {
      ok++
    }

    chartStatus.data.datasets[0].data = [grave, alerta, ok];
    chartStatus.update()

  }

}

function atualizaChartHistorico(){
  $.ajax({
    method: "GET",
    url: "/dashboard/historicoStatus/",

})
    .done(function (data) {
        dados = data;
        chartHistorico.data.datasets[0].data = data.qtdOk;
        chartHistorico.data.datasets[1].data = data.qtdAlerta;
        chartHistorico.data.datasets[2].data = data.qtdGrave;      
        chartHistorico.data.labels = ['30/06','29/06','28/06','27/06','26/06','25/06','24/06',]
        
        chartHistorico.update();
    })

}

setInterval(atualizaChartHistorico, 10000);

var markers = []
function getStatus(geocoder, map) {

  var httpLastStatus = new XMLHttpRequest();
  httpLastStatus.open("GET", '/dashboard/laststatus', false);
  httpLastStatus.send(null);

  var objLastStatus = JSON.parse(httpLastStatus.responseText);

  var markerTitle = []
  var icons = []
  for (i = 0; i < objLastStatus.ram.length; i++) {
    if (objLastStatus.ram[i] == "Grave") {
      markerTitle.push(objLastStatus.ram[i])
      icons.push(objLastStatus.ram[i] + ".png")
      continue;
    }
    else if (objLastStatus.hd[i] == "Grave") {
      markerTitle.push(objLastStatus.hd[i])
      icons.push(objLastStatus.hd[i] + ".png")
      continue;
    }
    else if (objLastStatus.cpu[i] == "Grave") {
      markerTitle.push(objLastStatus.cpu[i])
      icons.push(objLastStatus.cpu[i] + ".png")
      continue;
    }
    else if (objLastStatus.ram[i] == "Alerta") {
      markerTitle.push(objLastStatus.ram[i])
      icons.push(objLastStatus.ram[i] + ".png")
      continue;
    }
    else if (objLastStatus.hd[i] == "Alerta") {
      markerTitle.push(objLastStatus.hd[i])
      icons.push(objLastStatus.hd[i] + ".png")
      continue;
    }
    else if (objLastStatus.cpu[i] == "Alerta") {
      markerTitle.push(objLastStatus.cpu[i])
      icons.push(objLastStatus.cpu[i] + ".png")
      continue;
    }
    else {
      markerTitle.push("Ok")
      icons.push("Ok.png")
      continue;
    }
  }

  var address = objLastStatus.endereco;

  for (i = 0; i < address.length; i++) {
    geocodeAddress(geocoder, map, address, markerTitle, icons, objLastStatus, i);
  }
  // markers = []
  atualizaChartStatusPieComParametro(markerTitle);

}
// CRIAÇÃO GOOGLE MAPS DA LOCALIDADE 

function initMap() {
  var map = new google.maps.Map(document.getElementById('google-maps'), {
    zoom: 13,
    center: { lat: -34.397, lng: 150.644 },
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
  if (d.getHours() >= 18 || d.getHours() <= 5) {
    styles = stylesNight
  }
  map.setOptions({ styles: styles })

  // CONEXÃO COM BANCO PARA PEGAR STATUS DAS LOCALIDADES

  getStatus(geocoder, map)
  setInterval(function () { getStatus(geocoder, map); }, 60000)

}


function geocodeAddress(geocoder, resultsMap, address, markerTitle, icons, objLastStatus, i) {
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


      var windowContent = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h2 id="firstHeading" class="firstHeading">' + objLastStatus.nome[i] + '</h2>' +
        '<div id="bodyContent">' +
        '<p><b>Status HD:</b> ' + objLastStatus.hd[i] +
        '</p>' +
        '<p><b>Status CPU:</b> ' + objLastStatus.cpu[i] +
        '</p>' +
        '<p><b>Status RAM:</b> ' + objLastStatus.ram[i] +
        '</p>' +
        '<p>Para maiores informações acesse: <br><a href="/dashboard/chart">' +
        'Dashboard localidade</a> ' +
        '</p>' +
        '</div>' +
        '</div>';

      var contentString = windowContent;

      var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 250
      });

      var titleMarker = markerTitle[i]
      // console.log(titleMarker)

      // marker.setMap(null)

      // Deletes all markers in the array by removing references to them.
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
        title: titleMarker,
        icon: baseIconUrl
      });
      marker.addListener('click', function () {
        if (lastWindow) lastWindow.close();
        infowindow.open(resultsMap, marker);
        lastWindow = infowindow;
        // infowindow.open(resultsMap, marker);
      });
      markers.push(marker)
      // console.log(marker)

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

}
if (markers.length != 0) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = []
}

