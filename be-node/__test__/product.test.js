import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../index.js' // or export the app from index.js

describe('Product API - Node.js', () => {
    beforeEach(async () => {
        await request(app).get('/reset') // clear db before each test
    })

    it('should create a product', async () => {
        const res = await request(app).post('/products').send({
            name: 'Node Shirt',
            description: 'Cool node.js merch',
            price: 49.99
        })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('id')
        expect(res.body.price).toBe(49.99)
    })

    it('should reject product with price <= 0', async () => {
        const res = await request(app).post('/products').send({
            name: 'Bad Product',
            description: 'Invalid price',
            price: 0
        })
        expect(res.statusCode).toBe(400)
        expect(res.body.error).toMatch(/price must be greater than 0/)
    })

    it('should list all products', async () => {
        await request(app).post('/products').send({
            name: 'Item A',
            description: 'First',
            price: 10
        })
        const res = await request(app).get('/products')
        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(1)
        expect(res.body[0].name).toBe('Item A')
    })
})
