// api/admin.js - API endpoints cho khu vực quản trị
const express = require('express');
const router = express.Router();

// Dữ liệu mẫu cho admin (trong thực tế nên dùng database)
let packages = [
  { id: 1, name: "Gói cơ bản", price: 199000, description: "Gói code cơ bản phù hợp cho người mới bắt đầu", active: true },
  { id: 2, name: "Gói chuyên nghiệp", price: 499000, description: "Gói code chuyên nghiệp với nhiều tính năng", active: true },
  { id: 3, name: "Gói doanh nghiệp", price: 999000, description: "Gói code đầy đủ cho doanh nghiệp", active: true }
];

let users = [
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "user", joined: "2023-01-15" },
  { id: 2, name: "Trần Thị B", email: "b@example.com", role: "user", joined: "2023-02-20" },
  { id: 3, name: "Admin", email: "admin@example.com", role: "admin", joined: "2023-01-01" }
];

let orders = [
  { id: 1, userId: 1, packageId: 1, date: "2023-03-10", amount: 199000, status: "completed" },
  { id: 2, userId: 2, packageId: 2, date: "2023-03-15", amount: 499000, status: "completed" },
  { id: 3, userId: 1, packageId: 3, date: "2023-04-01", amount: 999000, status: "pending" }
];

// Middleware để kiểm tra quyền admin (đơn giản hóa)
const requireAdmin = (req, res, next) => {
  // Trong thực tế, kiểm tra JWT token hoặc session
  const token = req.headers.authorization;
  
  if (token === "admin-token-123") {
    next();
  } else {
    res.status(403).json({ error: "Bạn không có quyền truy cập khu vực admin" });
  }
};

// Sử dụng middleware requireAdmin cho tất cả routes
router.use(requireAdmin);

// Lấy danh sách gói code
router.get('/packages', (req, res) => {
  res.json(packages);
});

// Thêm gói code mới
router.post('/packages', (req, res) => {
  // Trong thực tế, dữ liệu sẽ được lấy từ req.body
  const newPackage = {
    id: packages.length + 1,
    name: req.body.name || "Gói mới",
    price: req.body.price || 0,
    description: req.body.description || "Mô tả gói code",
    active: true
  };
  
  packages.push(newPackage);
  res.json({ message: "Thêm gói code thành công", package: newPackage });
});

// Cập nhật gói code
router.put('/packages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const packageIndex = packages.findIndex(p => p.id === id);
  
  if (packageIndex === -1) {
    return res.status(404).json({ error: "Không tìm thấy gói code" });
  }
  
  // Cập nhật thông tin
  if (req.body.name) packages[packageIndex].name = req.body.name;
  if (req.body.price) packages[packageIndex].price = req.body.price;
  if (req.body.description) packages[packageIndex].description = req.body.description;
  if (req.body.active !== undefined) packages[packageIndex].active = req.body.active;
  
  res.json({ message: "Cập nhật gói code thành công", package: packages[packageIndex] });
});

// Xóa gói code
router.delete('/packages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const packageIndex = packages.findIndex(p => p.id === id);
  
  if (packageIndex === -1) {
    return res.status(404).json({ error: "Không tìm thấy gói code" });
  }
  
  packages.splice(packageIndex, 1);
  res.json({ message: "Xóa gói code thành công" });
});

// Lấy danh sách người dùng
router.get('/users', (req, res) => {
  res.json(users);
});

// Lấy thông tin chi tiết người dùng
router.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ error: "Không tìm thấy người dùng" });
  }
  
  // Lấy đơn hàng của user
  const userOrders = orders.filter(o => o.userId === id);
  
  res.json({ user, orders: userOrders });
});

// Lấy danh sách đơn hàng
router.get('/orders', (req, res) => {
  // Kết hợp thông tin user và package vào mỗi order
  const ordersWithDetails = orders.map(order => {
    const user = users.find(u => u.id === order.userId);
    const package = packages.find(p => p.id === order.packageId);
    
    return {
      ...order,
      userName: user ? user.name : "Unknown",
      packageName: package ? package.name : "Unknown"
    };
  });
  
  res.json(ordersWithDetails);
});

// Cập nhật trạng thái đơn hàng
router.put('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const orderIndex = orders.findIndex(o => o.id === id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
  }
  
  if (req.body.status) {
    orders[orderIndex].status = req.body.status;
  }
  
  res.json({ message: "Cập nhật đơn hàng thành công", order: orders[orderIndex] });
});

// Lấy thống kê
router.get('/stats', (req, res) => {
  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, order) => sum + order.amount, 0);
  
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  
  res.json({
    totalRevenue,
    totalUsers,
    totalOrders,
    pendingOrders
  });
});

module.exports = router;
