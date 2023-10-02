window.addEventListener("load", function(event) {
    const crypto1Textarea = document.getElementById("crypto1");
    const crypto2Textarea = document.getElementById("crypto2");
    const liveRadio = document.getElementById("live");
    const hourRadio = document.getElementById("hour");
    const hoursRadio = document.getElementById("hours");
    const daysRadio = document.getElementById("days");
    const textarea1 = document.getElementById('crypto1');
    const textarea2 = document.getElementById('crypto2');
    let ctx = document.getElementById('chart').getContext('2d');
    const divElement = document.getElementById("infoContainer");
    const url_template = 'https://min-api.cryptocompare.com/data/';
    let url = '';

    const but1 = document.getElementById('butPDF');
    but1.addEventListener("click", function(event) {
        var currentDateTime = moment().format('YYYY-MM-DD/HH-mm');
        const name = crypto1Textarea.value + '_' + crypto2Textarea.value + '_' + currentDateTime;
        var canvas = document.getElementById('chart');
        var imgData = canvas.toDataURL('image/png');
        var docDefinition = {};
        docDefinition.pageSize = {
            width: 900, // висота А4
            height: 500, // ширина А4
            rotate: 90 // поворот на 90 градусів (перевернута сторінка)
        };

        docDefinition.content = []
        docDefinition.content = [{
            image: imgData,
            alignment: 'center', // розміщення по центру сторінки
            fit: [docDefinition.pageSize.width - 50, docDefinition.pageSize.height] // збільшити зображення до розмірів сторінки
        }];
        var pdfDoc = pdfMake.createPdf(docDefinition);

        pdfDoc.download(name);
    });

    // Отримання даних з API CryptoCompare
    async function fetchData(URL) {
        const response = await fetch(URL);
        const data = await response.json();
        if (data.Response === 'Success')
            return data.Data.Data;
        else
            return false;
    }

    // Форматування даних для графіка
    function formatData(apiData) {
        const labels = apiData.map(entry => formatDate(entry.time));
        const prices = apiData.map(entry => entry.close);
        return { labels, prices };
    }

    function formatDate(timestamp) {
        if (hourRadio.checked) {
            const date = new Date(timestamp * 1000);
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}0`;
        }
        if (hoursRadio.checked) {
            const date = new Date(timestamp * 1000);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}/${date.getHours()}:${date.getMinutes()}0`;
        }
        if (daysRadio.checked) {
            const date = new Date(timestamp * 1000);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        }
    }


    async function createChart() {
        const apiData = await fetchData(url);
        console.log(url);
        if (apiData !== false) {
            but1.style.display = "block";
            const imgElement = document.createElement('img');
            const targetDiv = document.getElementById('img');
            const formattedData = formatData(apiData);
            const firstPrice = apiData[0].close;
            const lastPrice = apiData[apiData.length - 1].close;
            const price = lastPrice;
            const changeData = firstPrice - lastPrice;
            const change = (-changeData / firstPrice) * 100;
            targetDiv.innerHTML = "";
            const ur = 'https://raw.githubusercontent.com/rainner/binance-watch/master/public/images/icons/' + crypto1Textarea.value.toLowerCase() + '_.png'

            fetch(ur)
                .then(response => {
                    if (response.ok) {
                        imgElement.src = ur;
                    } else {
                        imgElement.src = 'https://images.freeimages.com/images/large-previews/0c2/blank-coin-1236479.jpg';
                    }
                })
                .catch(error => {
                    imgElement.src = 'https://images.freeimages.com/images/large-previews/0c2/blank-coin-1236479.jpg';
                });


            imgElement.src = ur;
            targetDiv.appendChild(imgElement);
            divElement.style.display = "block";
            divElement.style.display = "flex";
            divElement.style.justifyContent = "space-evenly";
            document.getElementById("price").textContent = price;
            document.getElementById("change").textContent = change.toFixed(2) + '%';

            let ctx = document.getElementById('chart').getContext('2d');
            let name_of_pair = document.getElementById("crypto1").value.toUpperCase() + "/" + document.getElementById("crypto2").value.toUpperCase();

            const totalDuration = 3000;
            const delayBetweenPoints = totalDuration / formattedData.prices.length;
            const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
            const animation = {
                x: {
                    type: 'number',
                    easing: 'linear',
                    duration: delayBetweenPoints,
                    from: NaN, // the point is initially skipped
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
                y: {
                    type: 'number',
                    easing: 'linear',
                    duration: delayBetweenPoints,
                    from: previousY,
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.yStarted) {
                            return 0;
                        }
                        ctx.yStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                }
            };
            let chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: formattedData.labels,
                    datasets: [{
                        label: name_of_pair,
                        backgroundColor: ['red'],
                        borderColor: 'blue',
                        fill: false,
                        data: formattedData.prices,
                    }]
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Price'
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'date'
                        }
                    }]

                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'CRYPTO CURRENCY',
                            font: {
                                size: 25
                            }
                        }
                    },
                    animation,
                    interaction: {
                        intersect: false
                    }
                }
            });
        } else {
            alert("Такої пари криптовалют немає в базі даних або введені помилкові дані!");
        }
    }


    liveRadio.addEventListener("click", function(event) {
        if (this.checked) {
            divElement.style.display = "none";
            but1.style.display = "none";
            // Встановлюємо атрибут disabled на елементі textarea
            textarea1.disabled = true;
            textarea2.disabled = true;
            document.getElementById("canv").innerHTML = '<canvas class="my-4 w-100" id="chart" width="900" height="380"></canvas>';
            let ctx = document.getElementById('chart').getContext('2d');
            let chart;


            async function fetchData() {
                const url_template = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=';
                const url = url_template + document.getElementById("crypto1").value.toLowerCase() + '&tsyms=' + document.getElementById("crypto2").value.toLowerCase() + '&api_key=e394b34279526e6ffc622b79aabb5c583903419bf3875bb5e62eca8dea8e61c3';
                const response = await fetch(url);
                const data = await response.json();
                if (data.Response === 'Error') {
                    alert("Такої пари криптовалют немає в базі даних або введені помилкові дані!");
                    clearInterval(timerId);
                    document.getElementById("canv").innerHTML = '<canvas class="my-4 w-100" id="chart" width="900" height="380"></canvas>';
                    textarea1.disabled = false;
                    textarea2.disabled = false;
                }

                const objectName = 'data';
                const propertyKeys = Object.keys(eval(objectName));
                const propertyValues = Object.values(eval(objectName));
                const new_obj = propertyValues[0];

                const new_arr = Object.values(eval(new_obj));
                const result = new_arr[0];
                const val = result;

                updateChart(val);
            }



            function updateChart(val) {
                if (!chart) {
                    let name_of_pair = document.getElementById("crypto1").value.toUpperCase() + "/" + document.getElementById("crypto2").value.toUpperCase();
                    chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: [],
                            datasets: [{
                                label: name_of_pair,
                                backgroundColor: 'blue',
                                borderColor: 'red',
                                fill: false,
                                data: []
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Price'
                                    }
                                }],
                                xAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Time'
                                    }
                                }]
                            }
                        }
                    });
                }
                const time = new Date().toLocaleTimeString();
                chart.data.labels.push(time);
                chart.data.datasets[0].data.push(val);
                chart.update();
            }
            const timerId = setInterval(fetchData, 1000);
        }
    });

    hourRadio.addEventListener("click", function(event) {
        if (this.checked) {
            divElement.style.display = "none";
            but1.style.display = "none";
            textarea1.disabled = false;
            textarea2.disabled = false;
            document.getElementById("canv").innerHTML = '<canvas class="my-4 w-100" id="chart" width="900" height="380"></canvas>';
            let crypto1Name = crypto1Textarea.value;
            let crypto2Name = crypto2Textarea.value;
            url = url_template + 'v2/histominute?fsym=' + crypto1Name.toLowerCase() + '&tsym=' + crypto2Name.toLowerCase() + '&limit=60';
            createChart();
        }
    });

    hoursRadio.addEventListener("click", function(event) {
        if (this.checked) {
            divElement.style.display = "none";
            but1.style.display = "none";
            document.getElementById("canv").innerHTML = '<canvas class="my-4 w-100" id="chart" width="900" height="380"></canvas>';
            textarea1.disabled = false;
            textarea2.disabled = false;
            let userInput = prompt("Введіть проміжок часу у годинах:");
            let number = +userInput;
            if (number < 2 || number > 2000) {
                alert("Число годин для дослідження має бути не менше 2 та не більше 2000!");
            } else {
                let crypto1Name = crypto1Textarea.value;
                let crypto2Name = crypto2Textarea.value;
                url = url_template + 'v2/histohour?fsym=' + crypto1Name + '&tsym=' + crypto2Name + '&limit=' + number;
                createChart();
            }
        }
    });

    daysRadio.addEventListener("click", function(event) {
        if (this.checked) {
            divElement.style.display = "none";
            but1.style.display = "none";
            document.getElementById("canv").innerHTML = '<canvas class="my-4 w-100" id="chart" width="900" height="380"></canvas>';
            textarea1.disabled = false;
            textarea2.disabled = false;
            let userInput = prompt("Введіть проміжок часу у днях:");
            let number = +userInput;
            if (number < 2 || number > 2000) {
                alert("Число днів для дослідження має бути не менше 2 та не більше 2000!");
            } else {
                let crypto1Name = crypto1Textarea.value;
                let crypto2Name = crypto2Textarea.value;
                url = url_template + 'v2/histoday?fsym=' + crypto1Name.toLowerCase() + '&tsym=' + crypto2Name.toLowerCase() + '&limit=' + number;
                createChart();
            }

        }
    });

});