// controllers/userController.js
const User = require("../models/usersModel");

// Lấy danh sách thuyền viên với phân trang
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Lấy danh sách người dùng từ MongoDB
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Sắp xếp danh sách users theo id theo thứ tự số
    users.sort((a, b) => {
      // Chuyển 'P' thành số, loại bỏ ký tự 'P' và so sánh
      const numA = parseInt(a.id.replace("P", ""), 10);
      const numB = parseInt(b.id.replace("P", ""), 10);
      return numA - numB;
    });

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Tạo thuyền viên mới
const createUser = async (req, res) => {
  const { id, name, birthday, phone, visitting, status } = req.body;
  const existingUser = await User.findOne({
    id,
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this ID already exists" });
  }

  const user = new User({ id, name, birthday, phone, visitting, status });
  await user.save();
  res.status(201).json(user);
  console.log(`User ${id} created successfully`);
};

// Cập nhật thông tin thuyền viên
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // ID từ URL
    const { name, birthday, phone, visitting, status } = req.body;

    // Tìm user theo trường `id` tùy chỉnh
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cập nhật dữ liệu
    user.name = name !== undefined ? name.toUpperCase() : user.name;
    user.birthday = birthday !== undefined ? birthday : user.birthday;
    user.phone = phone !== undefined ? phone : user.phone;
    user.visitting = visitting !== undefined ? visitting : user.visitting;
    user.status = status !== undefined ? status : user.status;

    // Lưu thay đổi
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Xóa thuyền viên
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // ID từ URL

    // Tìm user theo trường `id` tùy chỉnh
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xóa user
    await user.deleteOne({ id });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Tìm kiếm thuyền viên
const searchUser = async (req, res) => {
  try {
    const { query } = req.query; // Query từ URL

    // Tìm user theo nhiều trường
    const users = await User.find({
      $or: [
        { id: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { birthday: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { visitting: { $regex: query, $options: "i" } },
        { status: isNaN(query) ? undefined : Number(query) },
      ].filter(Boolean),
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, searchUser };
