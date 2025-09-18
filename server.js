const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "students.json");


app.use(express.json());

// Read students from file
function readStudents() {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
}

// Write students to file
function writeStudents(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
}

// POST /api/students - Add a new student
app.post("/api/students", (req, res) => {
  const { name, age, course, year, status } = req.body;

  if (!name || !course || !year) {
    return res.status(400).json({ error: "name, course and year are required" });
  }

  if (typeof age !== "number" || age <= 0) {
    return res.status(400).json({ error: "age must be a number > 0" });
  }

  const students = readStudents();
  // Generate a simple numeric id
  const newId = students.length > 0 ? students[students.length - 1].id + 1 : 1;
  const newStudent = {
    id: newId,
    name,
    age,
    course,
    year,
    status: status || "active"
  };

  students.push(newStudent);
  writeStudents(students);

  res.status(201).json(newStudent);
});

// GET /api/students - Get all students
app.get("/api/students", (req, res) => {
  const students = readStudents();
  res.json(students);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
