import express from "express";
import session from "express-session";

const app = express();

app.use(express.json());

app.use(
    session({  
        secret: "mysecretkey",
        resave: false,
        saveUninitialized: false
    })
)
const user = {
    id: 1,
    username: "user",
    password: "password",
    name: "John Doe"
}

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === user.username && password === user.password) {
        req.session.user = { id: user.id, username: user.username, name: user.name }
        res.json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
})

app.get("/profile", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: `welcome ${req.session.user.name}` });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});