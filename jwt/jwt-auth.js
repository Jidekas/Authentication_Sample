import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const SECRET_KEY = "mysecretkey";

const user = {
    id: 2,
    username: "user2",
    password: "password",
    name: "James Bond"
}

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === user.username && password === user.password) {
        const token = jwt.sign(
            { id: user.id, username: user.username, name: user.name }, 
            SECRET_KEY, 
            { expiresIn: '1h'}
        );
        res.json({ message: "Login successful", token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user;
        next();
    } catch (err) {
        res.status(403).json({ message: "Forbidden" });
    }
}

app.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: `Welcome ${req.user.name}` });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});