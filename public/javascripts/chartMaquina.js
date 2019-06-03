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
            responsive: true,
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


// CHART DE CONSUMO DE MEMORIA RAM options.scales.xAxes[1].max

var ctx = document.getElementById('myBarChart');
ctx.height = 300
var chartRam = new Chart(ctx, {
  type: 'horizontalBar',
  data: {
    labels: ['RAM'],
    datasets: [
      {
        label: 'Usado',
        // data: [67.8],
        backgroundColor: '#FF3333',
      },
      {
        label: 'Livre',
        // data: [20.7],
        backgroundColor: '#33FF33',
      }
    ]
  },
  options: {
      responsive: true,
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }]
    }
  }
  
});


$('#loja').change(function () {
    limparCampos()
    selecionado = parseInt($('#loja option:selected').val());
    atualizaChartCPUComParametro(selecionado)
    atualizaChartHdComParametro(selecionado)
    atualizaChartRamComParametro(selecionado)
    setInterval(function () {
        atualizaChartCPUComParametro(selecionado)
        atualizaChartHdComParametro(selecionado)
        atualizaChartRamComParametro(selecionado)
    }, 10000)


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
                chartCpu.data.labels = dados.date;
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
function atualizaChartRamComParametro(selecionado) {
    if (isNaN(selecionado)) {
        limparCampos()
        return;
    }

    $.ajax({
        method: "GET",
        url: "/dashboard/ram/" + selecionado,

    })
        .done(function (data) {
            dados = data;
            if (dados.livre.length == 0) {
                limparCampos();
                return;
            }
            else {
                chartRam.data.datasets[0].data = dados.utilizado
                chartRam.data.datasets[1].data = dados.livre
                // console.log(dados.utilizado + dados.livre)
                // chartRam.options.scales.xAxes[0].ticks.max =  parseInt(dados.utilizado) + parseInt(dados.livre)
                chartRam.options.scales.xAxes[0].ticks.fontSize =  18
            }
            chartRam.update()
        })

}

function limparCampos() {
    var arrayVazio = [];
    chartCpu.data.datasets[0].data = arrayVazio;
    chartRam.data.datasets[0].data = arrayVazio;
    chartRam.data.datasets[1].data = arrayVazio;
    chartHd.data.datasets[0].data = arrayVazio;

    chartCpu.update();

}