import express from "express"
import { publicRouter } from "../routes/public-api.js"
import { roleRouter } from "../routes/role-api.js"
import { userRouter } from "../routes/user-api.js"
import { kategoriRouter } from "../routes/kategori-api.js"
import { jenisKategoriRouter } from "../routes/jenis_kategori-api.js"
import { errorMiddleware } from "../middleware/error-middleware.js"
import { notfoundMiddleware } from "../middleware/not-found-middleware.js"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())


const apiPrefix = "/api"

// Public routes API (user & admin)
app.use(apiPrefix, publicRouter)

// Admin routes API (admin only)
app.use(apiPrefix, userRouter)
app.use(apiPrefix, roleRouter)
app.use(apiPrefix, kategoriRouter)
app.use(apiPrefix, jenisKategoriRouter)

app.use(notfoundMiddleware)
app.use(errorMiddleware)

export { app }