export function parseLine(line: string) {
  return {
    user_id: parseInt(line.slice(0, 10)),
    name: line.slice(10, 55).trim(),
    order_id: parseInt(line.slice(55, 65)),
    product_id: parseInt(line.slice(65, 75)),
    value: parseFloat(line.slice(75, 87)) / 100,
    date: line.slice(87, 95).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
  }
}