import express from "express";
import cartsRouter from "./routers/carts.router.js";
import { Server } from "socket.io";
import viewsRouter from "./routers/views.router.js";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import productManager from "./productManager.js";

const app = express();

const httpServer = app.listen(8080, () => console.log("Server Up"));
const io = new Server(httpServer);

app.set("socketio", io);

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

io.on("connection", (socket) => {
  console.log("Successful Connection");
  socket.on("productList", (data) => {
    io.emit("updatedProducts", data);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.static("./public"));
app.use(express.json());
app.use("/", viewsRouter);

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
