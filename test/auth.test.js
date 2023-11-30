import supertest from "supertest"
import { app } from "../src/application/web.js"
import { logger } from "../src/application/logging.js"
import { createTestUser, removeTestUser } from "./test-util.js"
import bcrypt from "bcrypt"

describe('POST /api/users/login', function () {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can login', async () => {
        const result = await supertest(app)
            .post('/api/users/login')
            .send({
                email: "test@test.com",
                password: "rahasia"
            })

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
        expect(result.body.data.token).not.toBe("test")
    })

    it('should reject login if request is invalid', async () => {
        const result = await supertest(app)
            .post('/api/users/login')
            .send({
                email: "",
                password: ""
            })

        logger.info(result.body)

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })

    it('should reject login if password is wrong', async () => {
        const result = await supertest(app)
            .post('/api/users/login')
            .send({
                email: "test@test.com",
                password: "salah"
            })

        logger.info(result.body)

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })

    it('should reject login if username is wrong', async () => {
        const result = await supertest(app)
            .post('/api/users/login')
            .send({
                email: "salah",
                password: "salah"
            })

        logger.info(result.body)

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })

    it('should can get new access token', async () => {
        const result = await supertest(app)
            .post('/api/users/refresh')
            .set('Authorization', 'Bearer token')
        
        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
    })

    it('should reject new access token if refresh token wrong', async () => {
        const result = await supertest(app)
            .post('/api/users/refresh')
            .set('Authorization', 'Bearer salah')
        
        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})