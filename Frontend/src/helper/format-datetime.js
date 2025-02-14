import moment from "moment-timezone";

// Hàm format ngày từ UTC sang múi giờ Việt Nam (Asia/Ho_Chi_Minh)
const formatDate = {
  formatDateTime(datetime) {
    return moment(datetime)
      .tz("Asia/Ho_Chi_Minh")
      .format("DD/MM/YYYY - HH:mm:ss");
  },

  formatDate(datetime) {
    return moment(datetime).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
  },

  formatTime(datetime) {
    return moment(datetime).tz("Asia/Ho_Chi_Minh").format("HH:mm");
  },

  formateDateSort(datetime) {
    return moment(datetime).tz("Asia/Ho_Chi_Minh").format("YYYY/MM/DD");
  },
};
export default formatDate;
