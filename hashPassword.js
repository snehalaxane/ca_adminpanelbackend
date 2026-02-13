const bcrypt = require("bcryptjs");

const password = "admin123"; // 👈 choose admin password

bcrypt.hash(password, 10).then((hash) => {
  console.log("Hashed password:");
  console.log(hash);
});
