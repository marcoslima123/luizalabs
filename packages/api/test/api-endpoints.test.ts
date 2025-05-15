import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { parseLine, normalizeData, filterOrders } from '@normalizer/core'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let app

beforeAll(async () => {
  app = Fastify()
  app.register(multipart)

  let ordersData: any[] = []

  app.post('/upload', async (request, reply) => {
    const data = await request.file()
    if (!data) return reply.status(400).send({ error: 'File not found' })

    const content = await data.toBuffer()
    const lines = content.toString().split('\n').filter(Boolean)
    const parsed = lines.map(parseLine)
    ordersData = normalizeData(parsed)
    return { success: true, count: ordersData.length }
  })

  app.get('/orders', async (request, reply) => {
    const { order_id, start_date, end_date } = request.query
    const filtered = filterOrders(ordersData, order_id, start_date, end_date)
    return filtered
  })

  await app.listen({ port: 4000 })
})

afterAll(async () => {
  await app.close()
})

describe('API Integration', () => {
  it('deve aceitar upload de arquivo e responder com sucesso', async () => {
    const formBoundary = '----VitestFormBoundary'
    const filePath = path.join(__dirname, 'fixtures', 'pedidos.txt')
    const fileContent = fs.readFileSync(filePath)

    const body = Buffer.concat([
      Buffer.from(`--${formBoundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="file"; filename="pedidos.txt"\r\n`),
      Buffer.from(`Content-Type: text/plain\r\n\r\n`),
      fileContent,
      Buffer.from(`\r\n--${formBoundary}--\r\n`)
    ])

    const res = await fetch('http://localhost:4000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formBoundary}`,
        'Content-Length': body.length.toString()
      },
      body
    })

    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
  })

  it('deve retornar pedidos normalizados via /orders', async () => {
    const res = await fetch('http://localhost:4000/orders')
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })
})
