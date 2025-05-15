import { describe, it, expect } from 'vitest'

import { filterOrders } from '../src'

const sampleData = [
  {
    user_id: 1,
    name: 'João Silva',
    orders: [
      {
        order_id: 1001,
        date: '2021-01-01',
        total: 379.00,
        products: [
          { product_id: 1, value: '256.00' },
          { product_id: 2, value: '123.00' }
        ]
      },
      {
        order_id: 1002,
        date: '2021-02-01',
        total: 199.00,
        products: [
          { product_id: 3, value: '199.00' }
        ]
      }
    ]
  },
  {
    user_id: 2,
    name: 'Maria Souza',
    orders: [
      {
        order_id: 2001,
        date: '2021-03-15',
        total: 312.00,
        products: [
          { product_id: 4, value: '312.00' }
        ]
      }
    ]
  }
]

describe('filterOrders', () => {
  it('deve retornar todos os pedidos se nenhum filtro for aplicado', () => {
    const result = filterOrders(sampleData)
    expect(result.length).toBe(2)
    expect(result[0].orders.length).toBe(2)
    expect(result[1].orders.length).toBe(1)
  })

  it('deve filtrar por order_id', () => {
    const result = filterOrders(sampleData, '1001')
    expect(result.length).toBe(1)
    expect(result[0].orders[0].order_id).toBe(1001)
  })

  it('deve filtrar por intervalo de datas', () => {
    const result = filterOrders(sampleData, undefined, '2021-02-01', '2021-03-31')
    expect(result.length).toBe(2)
    expect(result[0].orders.length).toBe(1)
    expect(result[1].orders.length).toBe(1)
  })
})
