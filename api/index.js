const express = require('express');
const app = express();
const path = require('path');

// Phục vụ file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, '../public')));

// Middleware để parse JSON
app.use(express.json());

// Route chính
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Route cho user
app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/user.html'));
});

// Route cho admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// API endpoint để lấy dữ liệu gói code
app.get('/api/packages', (req, res) => {
  const packages = [
    { id: 1, name: "Gói cơ bản", price: 199000, description: "Gói code cơ bản phù hợp cho người mới bắt đầu" },
    { id: 2, name: "Gói chuyên nghiệp", price: 499000, description: "Gói code chuyên nghiệp với nhiều tính năng" },
    { id: 3, name: "Gói doanh nghiệp", price: 999000, description: "Gói code đầy đủ cho doanh nghiệp" }
  ];
  res.json(packages);
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// Export app cho Vercel
module.exports = app;
