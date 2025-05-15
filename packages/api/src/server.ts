import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'

import { join } from 'path'
import { fileURLToPath } from 'url'

import { parseLine, normalizeData, filterOrders } from '@normalizer/core'

const fastify = Fastify()
fastify.register(multipart)

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')
fastify.register(fastifyStatic, {
  root: join(__dirname, '../public'),
  prefix: '/',
})

let ordersData: any[] = []

fastify.post('/upload', async (request, reply) => {
  const data = await (request as any).file()
  if (!data) return reply.status(400).send({ error: 'File not found' })

  const content = await data.toBuffer()
  const lines = content.toString().split('\n').filter(Boolean)
  const parsed = lines.map(parseLine)
  ordersData = normalizeData(parsed)
  return { success: true, count: ordersData.length }
})

fastify.get('/orders', async (request, reply) => {
  const { order_id, start_date, end_date } = request.query as {
    order_id?: string
    start_date?: string
    end_date?: string
  }

  const filtered = filterOrders(ordersData, order_id, start_date, end_date)
  return filtered
})

fastify.listen({ port: 3000 }, () => {
  console.log('Server running at http://localhost:3000')
})
