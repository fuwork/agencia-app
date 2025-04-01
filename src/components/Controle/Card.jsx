import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { Calendar } from 'react-bootstrap-icons'
import { supabase } from '../../services/supabase'
import CampanhasModal from './Modal' // Importe o modal de campanhas

export default function AgencyCard() {
  const [clientes, setClientes] = useState([])
  const [carteiras, setCarteiras] = useState([])
  const [campanhas, setCampanhas] = useState([])
  
  // Estado para controlar o modal de campanhas
  const [showCampanhasModal, setShowCampanhasModal] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)

  useEffect(() => {
    async function fetchDados() {
      // Buscar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*')

      // Buscar carteiras
      const { data: carteirasData, error: carteirasError } = await supabase
        .from('carteira')
        .select('*')

      // Buscar campanhas
      const { data: campanhasData, error: campanhasError } = await supabase
        .from('campanhas')
        .select('*')

      if (clientesError) console.error('Erro ao buscar clientes:', clientesError)
      if (carteirasError) console.error('Erro ao buscar carteiras:', carteirasError)
      if (campanhasError) console.error('Erro ao buscar campanhas:', campanhasError)

      if (clientesData) setClientes(clientesData)
      if (carteirasData) setCarteiras(carteirasData)
      if (campanhasData) setCampanhas(campanhasData)
    }

    fetchDados()
  }, [])

  // Função para abrir o modal de campanhas
  const handleClienteClick = (cliente) => {
    setSelectedCliente(cliente)
    setShowCampanhasModal(true)
  }

  // Função para fechar o modal de campanhas
  const handleCloseCampanhasModal = () => {
    setShowCampanhasModal(false)
    setSelectedCliente(null)
  }

  return (
    <div>
      {clientes.map(cliente => {
        const carteira = carteiras.find(c => c.client_id === cliente.id)
        const campanha = campanhas.find(c => c.client_id === cliente.id)

        return (
          <Card 
            key={cliente.id}
            className="h-100 agency-card shadow-sm"
            style={{ cursor: 'pointer', marginBottom: '15px' }}
          >
            <Card.Body>
              <Card.Title 
                onClick={() => handleClienteClick(cliente)}
                style={{ cursor: 'pointer' }}
              >
                {cliente.nome}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Contrato: {campanha?.campaign_id || 'Não definido'}
              </Card.Subtitle>
              <div className="d-flex justify-content-between mt-3">
                <small className="text-muted">
                  {carteira?.moeda === 'BRL' ? 'R$' : carteira?.moeda || 'R$'} 
                   {' '}
                   {Number(carteira?.credito || 0).toLocaleString('pt-BR', {
                   minimumFractionDigits: 2,
                   maximumFractionDigits: 2
                  })}
                </small>
                <small className="text-muted">
                  <Calendar className="me-1" />
                  {campanha?.date_start 
                    ? new Date(campanha.date_start).toLocaleDateString() 
                    : 'Data não definida'}
                </small>
              </div>
            </Card.Body>
          </Card>
        )
      })}

      {/* Modal de Campanhas */}
      {selectedCliente && (
        <CampanhasModal 
          show={showCampanhasModal}
          onHide={handleCloseCampanhasModal}
          clientes={selectedCliente}
        />
      )}
    </div>
  )
}