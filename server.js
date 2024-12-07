// server.js

const express = require('express');
const vite = require('vite');
const cors = require('cors'); // cors 미들웨어 추가

const app = express();
const PORT = 3015;

// CORS 미들웨어를 사용하여 모든 도메인에서 접근 허용
app.use(cors());

// Express 서버가 5173 포트에서 실행되도록 설정
app.listen(PORT, async () => {
    console.log(`Express server is listening on port ${PORT}`);

    // Vite 개발 서버 실행
    const viteServer = await vite.createServer({
        server: { port: PORT } // Express 서버와 동일한 포트로 설정
    });
    await viteServer.listen(PORT); // Express 서버의 포트로 Vite 서버 실행
    console.log(`Vite development server is running at http://localhost:${PORT}`);
});

// 게임 시작을 처리하는 엔드포인트
app.get('/start-game', (req, res) => {
    console.log('게임이 시작되었습니다.');
    res.sendStatus(200);
});

