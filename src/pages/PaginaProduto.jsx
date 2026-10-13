import { Link, useParams } from 'react-router'
import { useState } from 'react'

export default function PaginaProduto({ produtos, onAdicionar, onAdicionarNaListaDeEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [formulario, setFormulario] = useState({ nome: '', email: '' })
  const [mensagemEspera, setMensagemEspera] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const precoValido = Number.isFinite(Number(produto.price)) && Number(produto.price) > 0
  const esgotado = produto.estoque === 0 || !precoValido

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        item.estoque > 0 &&
        Number.isFinite(Number(item.price))
    )
    .slice(0, 4)

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">{Number(produto.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={esgotado}
          >
            {precoValido ? 'Adicionar ao carrinho' : 'Indisponível'}
          </button>

          {esgotado && (
            <form
              className="aviso-esgotado"
              onSubmit={(evento) => {
                evento.preventDefault()

                if (!formulario.nome.trim() || !formulario.email.trim()) {
                  setMensagemEspera('Preencha nome e e-mail para receber o aviso.')
                  return
                }

                const cadastrado = onAdicionarNaListaDeEspera(
                  produto.id,
                  formulario.nome,
                  formulario.email
                )

                if (cadastrado) {
                  setMensagemEspera('Você foi adicionado à lista de espera.')
                  setFormulario({ nome: '', email: '' })
                }
              }}
            >
              <h2>Produto esgotado</h2>
              <p>Deixe seu nome e e-mail para receber um aviso quando ele voltar.</p>

              <input
                type="text"
                placeholder="Seu nome"
                value={formulario.nome}
                onChange={(evento) =>
                  setFormulario((anterior) => ({ ...anterior, nome: evento.target.value }))
                }
              />
              <input
                type="email"
                placeholder="Seu e-mail"
                value={formulario.email}
                onChange={(evento) =>
                  setFormulario((anterior) => ({ ...anterior, email: evento.target.value }))
                }
              />
              <button type="submit" className="botao botao-secundario">
                Avise-me quando chegar
              </button>

              {mensagemEspera && <p className="mensagem-cupom">{mensagemEspera}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button className="botao" onClick={() => onAdicionar(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
