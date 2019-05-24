$('#localidade').change(function () {

    selecionado = parseInt($('#localidade option:selected').val());


    // limparCampos();

    var httpLoja = new XMLHttpRequest();
    httpLoja.open("GET", '/dashboard/loja/' + selecionado, false);
    httpLoja.send(null);

    var objLoja = JSON.parse(httpLoja.responseText);

    var arrayLoja = [];
    var arrayLojaId = [];

    var lojas = document.getElementById("loja");
    lojas.textContent = "";


    if (objLoja.length == 0) {
        var semLoja = document.createElement("option");
        semLoja.textContent = "Não há laboratórios cadastrados"
        semLoja.value = null;
        semLoja.disabled = true;
        semLoja.selected = true;

        lojas.appendChild(semLoja);

        return;
    }

    for (var i = 0; i < objLoja.length; i++) {
        arrayLoja[i] = objLoja[i].nome;
        arrayLojaId[i] = objLoja[i].id;

        if (i == 0) {
            var lojaPadrao = document.createElement("option");
            lojaPadrao.textContent = "Selecione um Laboratório"
            lojaPadrao.value = null;
            lojaPadrao.disabled = true;
            lojaPadrao.selected = true;

            lojas.appendChild(lojaPadrao);

        }

        var loja = document.createElement("option");
        var optLoja = arrayLoja[i]
        var optLojaId = arrayLojaId[i]
        loja.textContent = optLoja;
        loja.value = optLojaId;

        lojas.appendChild(loja);
    }

})
// CHARTS DECLARATION AND FUNCTIONS

Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// CHART USO DO HD
var ctxHd = document.getElementById("myPieChart").getContext('2d');
var chartHd = new Chart(ctxHd, {
    type: 'doughnut',
    data: {
        labels: ["Usado", "Livre"],
        datasets: [{
            data: [],
            backgroundColor: ['#e74a3b', '#f6c23e'],
            hoverBackgroundColor: ['red', 'yellow'],
            hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
    },
    options: {
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
            display: true
        },
        cutoutPercentage: 80,
    },
});


// DATA A SER RECEBIDA DO BANCO, E JOGADA PARA ARRAY

// CHART DE CONSUMO DE CPU
var ctxCpu = document.getElementById("myAreaChart").getContext('2d');
var cfgChartCpu =
{
    type: 'line',
    data: {
        datasets: [{
            label: "Cpu",
            borderColor: 'rgb(255, 0, 0)'
        }]
    },
    options: {
        animation: {
            duration: 0
        },
        scales: {
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Consumo em %'
                },
                ticks: {
                    beginAtZero: true,
                    steps: 5,
                    stepValue: 5,
                    max: 100
                }
            }]
        }
    }
};
var chartCpu = new Chart(ctxCpu, cfgChartCpu);


$('#loja').change(function () {
    limparCampos()
    selecionado = parseInt($('#loja option:selected').val());


    atualizaChartCPUComParametro(selecionado)
    atualizaChartHdComParametro(selecionado)


})
function atualizaChartCPUComParametro(selecionado) {
    if (isNaN(selecionado)) {
        limparCampos()
        return;
    }

    $.ajax({
        method: "GET",
        url: "/dashboard/cpu/" + selecionado,

    })
        .done(function (data) {
            dados = data;
            if (dados.cpu.length == 0) {
                limparCampos();
                return;
            }
            else {
                chartCpu.data.datasets[0].data = dados.cpu;
                chartCpu.data.labels = dados.hora;
            }
            chartCpu.update()
        })

}
function atualizaChartHdComParametro(selecionado) {
    if (isNaN(selecionado)) {
        limparCampos()
        return;
    }

    $.ajax({
        method: "GET",
        url: "/dashboard/hd/" + selecionado,

    })
        .done(function (data) {
            dados = data;
            if (dados.livre.length == 0) {
                limparCampos();
                return;
            }
            else {
                chartHd.data.datasets[0].data = [dados.livre, dados.utilizado]
            }
            chartHd.update()
        })

}

function limparCampos() {
    var arrayVazio = [];
    chartCpu.data.datasets[0].data = arrayVazio;

    chartCpu.update();


    // document.getElementById('tempDashboard').innerHTML = "";
    // document.getElementById('umiDashboard').innerHTML = "";

    // document.getElementById('mediaUmi').innerHTML = "";
    // document.getElementById('maxUmi').innerHTML = "";
    // document.getElementById('minUmi').innerHTML = "";

    // document.getElementById('mediaTemp').innerHTML = "";
    // document.getElementById('maxTemp').innerHTML = "";
    // document.getElementById('minTemp').innerHTML = "";

    // document.getElementById('nomeArduino').innerHTML = "";

    // document.getElementById("mensagemArduino").innerHTML = `<b>Selecione um Refrigerador.</b>`;

    // document.getElementById('logradouroLoc').innerHTML = "";
    // document.getElementById('cidadeLoc').innerHTML = "";
    // document.getElementById('bairroLoc').innerHTML = "";

    // var arrayVazio = [];
    // chartTemp.data.datasets[0].data = arrayVazio;
    // chartUmi.data.datasets[0].data = arrayVazio;
    // chartTemp.update();
    // chartUmi.update();

    // contadorTempMax = 0;
    // contadorTempMin = 0;
    // contadorUmiMax = 0;
    // contadorUmiMin = 0;


}