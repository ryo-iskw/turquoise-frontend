export type ClientGetResponse = {
  id: number
  name: string
  users: number
  status: string
}

export type SalesGetResponse = {
  items: string
  month: string
  channel: '直販' | '通販'
  categories: 'TOPS' | 'OP'
  sales: number
}
