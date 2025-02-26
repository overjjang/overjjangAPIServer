document.addEventListener('DOMContentLoaded', async function() {
    document.getElementById('input1').value = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];

    // 서버 목록 불러오기
    function getServerList(){
        fetch(`/api/getServers?date=${document.getElementById('input1').value}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for(const server of data){
                const option = document.createElement('option');
                option.value = server;
                option.textContent = server;
                document.getElementById('selset').appendChild(option);
            }
            return data;
        })
        .catch(error => console.error('Error:', error));
        }

        //서버 차트 데이터 불러오기
    async function getServerChartData(serverName,many=false) {
        try {
            const response = await fetch(`/api/getChartData?date=${document.getElementById('input1').value}&serverName=${serverName}`, {
                method: 'GET'
            });
            const chartData = await response.json();
            console.log('Fetched chart data:', chartData); // Log the fetched data

            if (!Array.isArray(chartData)) {
                throw new Error('Fetched data is not an array');
            }

            function formatTime(time) {
                const arr = time.split(':');
                console.log('arr:', arr);
                return `${arr[0]}:${arr[1]}`;
            }

            const chartContainer = document.getElementById("chartContainer");
            const canvasId = `myChart-${serverName}`;
            chartContainer.insertAdjacentHTML('beforeend', `<h2>${serverName}</h2><canvas id="${canvasId}"></canvas>`);

            const ctx = document.getElementById(canvasId).getContext('2d');

            const timeLabels = chartData.map(record => record.time);
            const userData = chartData.map(record => record.userCount);
            const isServerOnData = chartData.map(record => record.isServerOn);

            const backgroundColors = isServerOnData.map(isServerOn => isServerOn ? 'rgba(75, 192, 192, 0.2)' : 'rgba(122,122,122,0.2)');
            const borderColors = isServerOnData.map(isServerOn => isServerOn ? 'rgba(75, 192, 192, 1)' : 'rgb(90,90,90)');
            const borderDash = isServerOnData.map(isServerOn => isServerOn ? [] : [5, 15]);

            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timeLabels,
                    datasets: [{
                        label: 'User Count',
                        data: userData,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1,
                        cubicInterpolationMode: 'monotone',
                        tension: 1,
                        segment: {
                            borderColor: function(context) {
                                const index = context.p0DataIndex;
                                return isServerOnData[index] ? 'rgba(75, 192, 192, 1)' : 'rgb(90,90,90)';
                            },
                            borderDash: function(context) {
                                const index = context.p0DataIndex;
                                return isServerOnData[index] ? [] : [5, 5];
                            }
                        }
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    }

        getServerList();

        document.getElementById('button2').addEventListener('click',  async function () {
            document.getElementById('selset').innerHTML = '';
            getServerList();
        });

        document.getElementById('button1').addEventListener('click', async function () {
            console.log('서버 차트 데이터 불러오기');
            document.getElementById("chartContainer").innerHTML = '';
            await getServerChartData(document.getElementById("selset").value);
        });

        document.getElementById('allChart').addEventListener('click', async function () {
            const serverList = document.getElementById('selset');
            document.getElementById("chartContainer").innerHTML = '';
            for (let i = 0; i < serverList.length; i++) {
                console.log('서버 차트 데이터 불러오기:', serverList[i].value );
                await getServerChartData(serverList[i].value, true);
            }

        });
});