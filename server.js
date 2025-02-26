const app = require('./app');  // app.js에서 express 앱을 가져옴
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

