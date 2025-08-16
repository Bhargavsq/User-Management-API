const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const usersFile = path.join(__dirname, "../data/users.json");

// Helper: Read users.json
const readUsers = () => {
    if (!fs.existsSync(usersFile)) return [];
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
};

// Helper: Write users.json
const writeUsers = (data) => {
    fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
};

// GET all users
const getUsers = (req, res) => {
    const users = readUsers();
    res.json(users);
};

// GET single user
const getUser = (req, res) => {
    const users = readUsers();
    const user = users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
};

// CREATE new user
const createUser = (req, res) => {
    const users = readUsers();
    const newUser = { ...req.body, id: uuidv4() };
    users.push(newUser);
    writeUsers(users);
    res.send(`User created: ${newUser.firstName}`);
};

// DELETE user
const deleteUser = (req, res) => {
    const users = readUsers();
    const filtered = users.filter((u) => u.id !== req.params.id);
    if (users.length === filtered.length) {
        return res.status(404).send("User not found");
    }
    writeUsers(filtered);
    res.send(`User id ${req.params.id} deleted`);
};

// UPDATE user
const updateUser = (req, res) => {
    const users = readUsers();
    const index = users.findIndex((u) => u.id === req.params.id);
    if (index === -1) {
        return res.status(404).send("User not found");
    }
    users[index] = { ...users[index], ...req.body };
    writeUsers(users);
    res.send(`User id ${req.params.id} updated`);
};

module.exports = { getUsers, getUser, createUser, deleteUser, updateUser };
