const fs = require("fs");
const path = require("path");

const storageDir = __dirname;
const usersFile = path.join(storageDir, "users.json");

function ensureUsersStore() {
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2), "utf8");
  }
}

function readUsers() {
  ensureUsersStore();
  const parsed = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  return Array.isArray(parsed.users) ? parsed.users : [];
}

function writeUsers(users) {
  ensureUsersStore();
  fs.writeFileSync(usersFile, JSON.stringify({ users }, null, 2), "utf8");
}

module.exports = {
  ensureUsersStore,
  readUsers,
  writeUsers,
  usersFile
};
