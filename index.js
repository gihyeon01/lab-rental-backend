
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 예약 스키마
const rentalSchema = new mongoose.Schema({
  date: String,
  startTime: String,
  endTime: String,
  equipment: String,
  name: String,
  status: String, // 승인, 반려, 대기
  memo: String,
  admin: String
});

const Rental = mongoose.model('Rental', rentalSchema);

// 공지사항 스키마
const noticeSchema = new mongoose.Schema({
  content: String,
  updatedAt: Date
});

const Notice = mongoose.model('Notice', noticeSchema);

// 예약 추가
app.post("/reservation", async (req, res) => {
  const rental = new Rental({ ...req.body, status: "대기" });
  await rental.save();
  res.send({ message: "신청 완료" });
});

// 예약 전체 조회
app.get("/reservation", async (req, res) => {
  const list = await Rental.find().sort({ date: 1, startTime: 1 });
  res.send(list);
});

// 예약 상태 변경
app.put("/reservation/:id", async (req, res) => {
  await Rental.findByIdAndUpdate(req.params.id, { $set: req.body });
  res.send({ message: "수정 완료" });
});

// 예약 삭제
app.delete("/reservation/:id", async (req, res) => {
  await Rental.findByIdAndDelete(req.params.id);
  res.send({ message: "삭제 완료" });
});

// 전체 삭제
app.delete("/reservation/all", async (req, res) => {
  await Rental.deleteMany({});
  res.send({ message: "전체 삭제 완료" });
});

// 공지사항 가져오기
app.get("/notice", async (req, res) => {
  const notice = await Notice.findOne().sort({ updatedAt: -1 });
  res.send(notice);
});

// 공지사항 저장
app.post("/notice", async (req, res) => {
  const n = new Notice({ content: req.body.content, updatedAt: new Date() });
  await n.save();
  res.send({ message: "공지 저장 완료" });
});

app.listen(5000, () => {
  console.log("✅ 서버 실행 중: http://localhost:5000");
});
