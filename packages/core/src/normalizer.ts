export function normalizeData(lines: any[]) {
  const usersMap = new Map()

  for (const item of lines) {
    if (!usersMap.has(item.user_id)) {
      usersMap.set(item.user_id, { user_id: item.user_id, name: item.name, orders: [] })
    }
    const user = usersMap.get(item.user_id)

    let order = user.orders.find((o: any) => o.order_id === item.order_id)
    if (!order) {
      order = {
        order_id: item.order_id,
        date: item.date,
        total: 0,
        products: []
      }
      user.orders.push(order)
    }

    order.products.push({ product_id: item.product_id, value: item.value.toFixed(2) })
    order.total += item.value
    order.total = parseFloat(order.total.toFixed(2))
  }

  return Array.from(usersMap.values())
}