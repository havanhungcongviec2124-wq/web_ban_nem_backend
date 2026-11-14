/**
 * Trả lỗi máy chủ cho client mà không lộ chi tiết kỹ thuật
 * (tên collection, lỗi Mongo, stack trace, chuỗi kết nối...).
 * Chi tiết chỉ ghi vào log của Worker để người vận hành xem.
 */
const serverError = (res, error) => {
  console.error("[api-error]", error?.stack || error?.message || error);
  return res.status(500).json({
    success: false,
    message: "Hệ thống đang bận, vui lòng thử lại sau.",
  });
};

module.exports = { serverError };
