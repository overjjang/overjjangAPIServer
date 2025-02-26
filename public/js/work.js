const addOutput = (output) => {
    const outputElement = document.getElementById('ouput');
    outputElement.innerHTML += `<p>${output}</p>`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('button0').addEventListener('click', function() {
        console.log('서버 분석 1회 실행');
        fetch('/api/updateServerState', {
            method: 'POST'
        }).then(response => {
            if (response.status === 200) {
                alert(`실행 성공: ${response.status} ${response.statusText}`);
                addOutput(`실행 성공: ${response.status} ${response.statusText}`);
                console.log(response);
            } else {
                alert(`실행 실패: ${response.status} ${response.statusText}`);
                addOutput(`실행 실패: ${response.status} ${response.statusText}`);
        }
        }).catch(error => console.error('Error:', error));
    });
    document.getElementById('button1').addEventListener('click', function() {
        const repeatTime = document.getElementById("input0").value;
        if (!repeatTime) {
            alert('반복 시간을 입력하세요');
            return;
        }
        fetch('/api/scheduleCronJob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ repeatTime: repeatTime })
        }).catch(error => console.error('Error:', error));

        document.getElementById("button1").classList.add("disabled");
        document.getElementById('button4').classList.remove("disabled");
    });

    document.getElementById('button2').addEventListener('click', function() {
        alert('레코드 생성');
        fetch('/api/createRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ serverName: 'serverIP' }) // Ensure serverIP is defined or replace with actual value
        }).catch(error => console.error('Error:', error));
    });
    document.getElementById('button4').addEventListener('click', function() {
        alert('서버 분석 중지');
        fetch('/api/stopScheduledCronJob', {
            method: 'POST'
        }).catch(error => console.error('Error:', error));
        document.getElementById("button1").classList.remove("disabled");
        document.getElementById('button4').classList.add("disabled");
    });
    document.getElementById('button5').addEventListener('click', function() {
        const serverName = document.getElementById('input1').value;
        if (!serverName) {
            alert('서버 이름을 입력하세요');
            return;
        }
        console.log(serverName);
        alert('분석 서버 추가');
        fetch('/api/addServer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ serverName: serverName })
        }).catch(error => console.error('Error:', error));
    });
});