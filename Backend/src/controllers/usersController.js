// controllers/userController.js
const User = require("../models/usersModel");
const ExcelJS = require("exceljs");
// Lấy thông tin một thuyền viên theo ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL

    // Tìm user theo ID
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
  if (id === undefined || name === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
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

// Export users to Excel
const exportUsersToExcel = async (req, res) => {
  try {
    const users = await User.find();
    users.sort((a, b) => {
      // Chuyển 'P' thành số, loại bỏ ký tự 'P' và so sánh
      const numA = parseInt(a.id.replace("P", ""), 10);
      const numB = parseInt(b.id.replace("P", ""), 10);
      return numA - numB;
    });
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DS_HoaTieu");

    // Add columns to the worksheet

    worksheet.columns = [
      { header: "STT", key: "no", width: 5 },
      { header: "MÃ HOA TIÊU", key: "id", width: 10 },
      { header: "HỌ VÀ TÊN", key: "name", width: 30 },
      { header: "NGÀY SINH", key: "birthday", width: 15 },
      { header: "SĐT", key: "phone", width: 15 },
      { header: "VỊ TRÍ", key: "visitting", width: 15 },
    ];

    // Add rows to the worksheet
    users.forEach((user, index) => {
      worksheet.addRow({
        no: index + 1,
        id: user.id,
        name: user.name,
        birthday: user.birthday,
        phone: user.phone,
        visitting: user.visitting,
      });
    });

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set the response headers and send the buffer
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUser,
  exportUsersToExcel,
  getUserById,
};
