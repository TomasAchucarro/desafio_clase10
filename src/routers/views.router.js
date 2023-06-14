import { Router } from "express"
import productManager from "../productManager.js"

const router = Router()
const readProducts = await productManager.getProducts()

router.get("/", (req, res) => {
    res.render("home", {
        title: "Products Handlebars",
        products: readProducts
    })
})

router.get("/realTimeProducts", (req, res) => {
    res.render("realTimeProducts", {
        title: "Products Websocket",
        products: readProducts
    })
})

export default router