const moment = require("moment-timezone");

// Hàm format ngày từ UTC sang múi giờ Việt Nam (Asia/Ho_Chi_Minh)
const formatDate = {
  formatDateTime(datetime) {
    return moment(datetime)
      .tz("Asia/Ho_Chi_Minh")
      .format("DD/MM/YYYY - HH:mm:ss");
  },
};

module.exports = formatDate;
