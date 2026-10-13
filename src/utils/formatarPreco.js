export function formatarPreco(valor) {
  const numero = Number(valor)

  if (!Number.isFinite(numero)) {
    return 'Preço indisponível'
  }

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
