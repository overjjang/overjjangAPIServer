const serverState = require('./models/chart.model'); // 모델 경로 수정
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const {MongooseError} = require("mongoose");
require('dotenv').config();
// const fetch = require('node-fetch');
const apiUrl = "https://api.mcsrvstat.us/3/";
const DB_URL = process.env.DB_URL;
const serverIPs = JSON.parse(fs.readFileSync('./servers.json', 'utf-8'));


// MongoDB 연결
mongoose.connect(DB_URL, {})
    .then(() => console.log('MongoDB 연결 성공'))
    .catch((error) => console.error('MongoDB 연결 실패:', error));

async function getData() {
    const date = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
    try{
        const data = await serverState.findOne({date: date });
        console.log(data);
        return data;
    } catch (error) {
        console.error("데이터 조회 오류:", error);
    }
}
// 레코드 생성 함수
async function createRecord() {
    const date = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
    try {
        for (const serverIP of serverIPs) {
            if (await serverState.findOne({ serverName: serverIP, date: date })) {
                console.log("이미 레코드가 존재합니다:", serverIP, date);
                continue;
            }
            await serverState.create({
                serverName: serverIP,
                date: date,
                history: [] // history 필드 초기화
            });
            console.log("레코드 생성 완료:", serverIP, date);
        }
    } catch (error) {
        console.error("레코드 생성 오류:", error);
    }
}

// 서버 상태 기록 함수
async function recordServerStatus() {
    try {
        for (const serverIP of serverIPs) {
            const response = await fetch(apiUrl + serverIP);
            const data = await response.json();
            const time = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[1];
            const date = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
            console.log("date:",date);

            const isServerOn = data.online;
            const userCount = isServerOn ? data.players.online : 0;

            // 날짜별로 서버 상태 업데이트
            const updateResult = await serverState.findOneAndUpdate(
                { serverName: serverIP, date: new Date(date) },
                {
                    $push: { history: { time: time, userCount: userCount, isServerOn: isServerOn } }
                },
                { new: true, upsert: true } // upsert를 사용하여 없으면 새로 생성
            );
            console.log("서버 상태 기록 업데이트 주소:", serverIP, "\n시각:", time, " 켜짐(Y/N):", isServerOn ? "Y" : "N", " 유저 수:", userCount);
        }
    } catch (error) {
        if (error instanceof MongooseError) {
            console.error("MongoDB 연결 오류 재연결 시도:", error);
            mongoose.connect(DB_URL, {})
                .then(() => console.log('MongoDB 연결 성공'))
                .catch((error) => console.error('MongoDB 연결 실패:', error));
        }
        console.error("서버 상태 기록 오류:", error);
    }
}


module.exports = {recordServerStatus, createRecord};