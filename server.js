const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Папка для хранения файлов
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Устанавливаем настройки для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Папка для хранения файлов
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Сохраняем файлы с уникальными именами
  }
});

// Ограничения и фильтры для файлов
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Ограничение размера файла (например, 10 МБ)
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("Тип файла не поддерживается."), false);
    }
  }
}).array("pit-11[]"); // Массив файлов для pit-11

// Статические файлы (CSS и JS)
app.use(express.static("public"));

// Парсим данные из формы
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Маршрут для обработки формы
app.post("/", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send("Ошибка загрузки файла.");
    }

    console.log(req.body); // Логируем данные формы
    console.log(req.files); // Логируем загруженные файлы

    // Отправляем ответ пользователю
    res.send("Форма успешно отправлена!");
  });
});

// Маршрут для отправки главной страницы
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
