export function filterOrders(data: any[], order_id?: string, start?: string, end?: string) {
  const filteredUsers = data.map(user => {
    const orders = user.orders.filter((order: any) => {
      const matchId = order_id ? order.order_id.toString() === order_id : true
      const matchDate = (!start || order.date >= start) && (!end || order.date <= end)
      return matchId && matchDate
    })
    return { ...user, orders }
  }).filter(u => u.orders.length > 0)

  return filteredUsers
}