// controllers/userController.js
const User = require("../models/usersModel");

// Lấy danh sách thuyền viên
const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
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
