// config/multer.js
const multer = require("multer");

// ডিস্ক স্টোরেজ কনফিগারেশন (লোকাল টেম্প ফাইল সেভ করার জন্য)
const storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // সর্বোচ্চ 5MB ফাইল সাইজ
});

// 👉 শুধুমাত্র upload এক্সপোর্ট করবেন
module.exports = upload;