import { describe, it, expect } from "vitest"

import { parseLine, normalizeData } from "../src"

describe("parseLine", () => {
  it("deve converter uma linha fixa em objeto", () => {
    const line =
      "0000000001" +
      "João Silva".padEnd(45, " ") +
      "0000001001" +
      "0000000001" +
      "000000025600" +
      "20210101";
    const parsed = parseLine(line)

    expect(parsed).toEqual({
      user_id: 1,
      name: "João Silva",
      order_id: 1001,
      product_id: 1,
      value: 256.0,
      date: "2021-01-01",
    })
  })
})

describe("normalizeData", () => {
  it("deve agrupar produtos por usuário e pedido corretamente", () => {
    const lines = [
      {
        user_id: 1,
        name: "João Silva",
        order_id: 1001,
        product_id: 1,
        value: 256.0,
        date: "2021-01-01",
      },
      {
        user_id: 1,
        name: "João Silva",
        order_id: 1001,
        product_id: 2,
        value: 123.0,
        date: "2021-01-01",
      },
    ];

    const result = normalizeData(lines);
    expect(result).toEqual([
      {
        user_id: 1,
        name: "João Silva",
        orders: [
          {
            order_id: 1001,
            date: "2021-01-01",
            total: 379.0,
            products: [
              { product_id: 1, value: "256.00" },
              { product_id: 2, value: "123.00" },
            ],
          },
        ],
      },
    ])
  })
})
