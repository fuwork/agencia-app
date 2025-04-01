import React, { useState, useEffect } from 'react'
import { Modal, Table, Spinner, Badge, Button, Form, Row, Col, InputGroup } from 'react-bootstrap'
import { supabase } from '../../services/supabase'

export default function CampanhasModal({ show, onHide, clientes }) {
  const [campanhas, setCampanhas] = useState([])
  const [campanhasFiltradas, setCampanhasFiltradas] = useState([])
  const [carteira, setCarteira] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  
  // Estados para os filtros
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroId, setFiltroId] = useState('')
  const [filtroDataInicio, setFiltroDataInicio] = useState('')
  const [filtroDataFim, setFiltroDataFim] = useState('')

  useEffect(() => {
    if (show && clientes) {
      fetchCampanhas()
    }
  }, [show, clientes,])

  // Efeito para aplicar os filtros quando mudam
  useEffect(() => {
    aplicarFiltros()
  }, [filtroStatus, filtroId, filtroDataInicio, filtroDataFim, campanhas, carteira])

  const fetchCampanhas = async () => {
    setLoading(true)
    setErro(null)
    try {
      // Busca detalhada com join para pegar informações relacionadas
      const { data, error } = await supabase
        .from('campanhas')
        .select(`
          ad_id,
          campaign_id,
          date_start,
          date_stop,
          client_id,
          spend,
          reach,
          clicks,
          cpm,
          ctr,
          unique_clicks,
          impressions,
          clientes:client_id (
            nome,
            codigo
          )
        `)
        .eq('client_id', clientes.id)
      
      if (error) throw error

      const { data: carteira, error: carteiraError } = await supabase
        .from('carteira')
        .select('*')
        .eq('cliente_id', clientes.id)
    
      if (carteiraError) throw carteiraError
      
      setCampanhas(data || [])
      setCampanhasFiltradas(data || [])
      setCarteira(carteira[0] || { credito: 0 })
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error)
      setErro(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Função para normalizar datas
  const normalizarData = (dataString, fimDoDia = false) => {
    if (!dataString) return null
    
    const data = new Date(dataString)
    if (fimDoDia) {
      data.setHours(23, 59, 59, 999)
    } else {
      data.setHours(0, 0, 0, 0)
    }
    return data
  }

  // Função para verificar se uma campanha está ativa
  const isAtiva = (dataFim, creditoCarteira) => {
    if (!dataFim || creditoCarteira <= 0) return false
    
    const hoje = new Date()
    const dataTermino = normalizarData(dataFim, true)
    
    return dataTermino > hoje
  }

// Função para obter badge de status
const getStatusBadge = (dataFim, creditoCarteira) => {
  const hoje = new Date();
  
  const dataTermino = typeof dataFim === 'string' ? new Date(dataFim) : dataFim;
  
  // Verifica se a data de término já passou E se o crédito é maior que zero
  const dataExpirada = dataTermino && dataTermino < hoje;
  const semCredito = creditoCarteira <= 0;
  
  // Está ativa apenas se tiver crédito E a data não estiver expirada
  const ativa = !semCredito && !dataExpirada;
  
  return ativa ? 
    <Badge bg="success">Ativa</Badge> : 
    <Badge bg="secondary">Inativa</Badge>
}

  // Função para aplicar os filtros 
  const aplicarFiltros = () => {
    if (!campanhas.length) return
    
    const creditoCarteira = carteira?.credito || 0
    const hoje = new Date()
    
    let resultado = [...campanhas]
    
    // Filtro por status
    if (filtroStatus !== 'todos') {
      resultado = resultado.filter(campanha => {
        if (!campanha.date_stop) return false
        
        const dataFim = normalizarData(campanha.date_stop, true)
        const estaAtiva = dataFim > hoje && creditoCarteira > 0
        
        return filtroStatus === 'ativa' ? estaAtiva : !estaAtiva
      })
    }
    
    // Filtro por ID da campanha - VERSÃO CORRIGIDA
    if (filtroId.trim() !== '') {
      const idBusca = filtroId.trim().toLowerCase()
      
      resultado = resultado.filter(campanha => {
        // Verifica tanto ad_id quanto campaign_id como strings
        const adId = campanha.ad_id?.toString().toLowerCase() || ''
        const campaignId = campanha.campaign_id?.toString().toLowerCase() || ''
        
        return adId.includes(idBusca) || campaignId.includes(idBusca)
      })
    }
    
    // Filtro por data de início - CORRIGIDO (filtra apenas date_start)
  if (filtroDataInicio) {
    const dataInicioFiltro = new Date(filtroDataInicio)
    resultado = resultado.filter(campanhas => {
      if (!campanhas.date_start) return false
      const dataInicioCampanha = new Date(campanhas.date_start)
      return dataInicioCampanha >= dataInicioFiltro
    })
  }
  
  // Filtro por data de término - CORRIGIDO (filtra apenas date_stop)
  if (filtroDataFim) {
    const dataFimFiltro = new Date(filtroDataFim)
    resultado = resultado.filter(campanhas => {
      if (!campanhas.date_stop) return false
      const dataFimCampanha = new Date(campanhas.date_stop)
      return dataFimCampanha <= dataFimFiltro
    })
  }
    
    setCampanhasFiltradas(resultado)
  }

  // Função para lidar com a alteração do filtro de ID
  const handleIdFilterChange = (e) => {
    setFiltroId(e.target.value)
  }

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setFiltroStatus('todos')
    setFiltroId('')
    setFiltroDataInicio('')
    setFiltroDataFim('')
    setCampanhasFiltradas(campanhas)
  }

  // Função para formatar valor monetário
  const formatarMoeda = (valor) => {
    return valor?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }) || 'R$ 0,00'
  }

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Campanhas da Agência: {clientes.nome}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
        ) : erro ? (
          <div className="alert alert-danger">
            Erro ao carregar campanhas: {erro}
          </div>
        ) : campanhas.length === 0 ? (
          <div className="text-center">
            Nenhuma campanha encontrada para esta agência.
          </div>
        ) : (
          <>
            {/* Seção de Filtros */}
            <div className="mb-4 p-3 border rounded bg-light">
              <h5>Filtros</h5>
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select 
                      value={filtroStatus} 
                      onChange={(e) => setFiltroStatus(e.target.value)}
                    >
                      <option value="todos">Todos</option>
                      <option value="ativa">Ativa</option>
                      <option value="inativa">Inativa</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>ID da Campanha</Form.Label>
                    <InputGroup>
                      <Form.Control 
                        type="text" 
                        placeholder="Buscar por ID"
                        value={filtroId} 
                        onChange={handleIdFilterChange}
                      />
                      {filtroId && (
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setFiltroId('')}
                        >
                          ×
                        </Button>
                      )}
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Busca por ID da campanha ou ad ID
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Data de Início</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={filtroDataInicio} 
                      onChange={(e) => setFiltroDataInicio(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Data de Término</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={filtroDataFim} 
                      onChange={(e) => setFiltroDataFim(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" size="sm" onClick={limparFiltros} className="me-2">
                  Limpar Filtros
                </Button>
                <Button variant="primary" size="sm" onClick={aplicarFiltros}>
                  Aplicar Filtros
                </Button>
              </div>
            </div>

            {/* Informação sobre resultados */}
            <div className="mb-3 d-flex justify-content-between">
              <span>
                Exibindo {campanhasFiltradas.length} de {campanhas.length} campanhas
              </span>
              {carteira.credito < 20 && (
                <Badge bg="warning" text="dark">
                  Atenção: Saldo de crédito baixo (R$ {carteira.credito?.toFixed(2).replace('.', ',')})
                </Badge>
              )}
            </div>

            {/* Tabela de Campanhas */}
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID Campanha</th>
                    <th>Status</th>
                    <th>Valor Gasto</th>
                    <th>Início</th>
                    <th>Término</th>
                    <th>Alcance</th>
                    <th>Clicks</th>
                    <th>CPM</th>
                    <th>CTR</th>
                    <th>Click Unico</th>
                    <th>Impressão</th>
                  </tr>
                </thead>
                <tbody>
                  {campanhasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center">
                        Nenhuma campanha encontrada com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    campanhasFiltradas.map(campanha => (
                      <tr key={`${campanha.ad_id}-${campanha.campaign_id}`}>
                        <td>
                          {campanha.ad_id || 'N/D'}
                        </td>
                        <td>
                          {campanha.date_stop ? (
                            getStatusBadge(campanha.date_stop, carteira.credito)
                          ) : (
                            <Badge bg="warning" text="dark">Sem data</Badge>
                          )}
                        </td>
                        <td>
                          {formatarMoeda(parseFloat(campanha.spend))}
                          {carteira.credito < 10 && (
                            <span className="ms-2 text-danger">
                              (Saldo Baixo)
                            </span>
                          )}
                        </td>
                        <td>
                          {campanha.date_start 
                            ? new Date(campanha.date_start).toLocaleDateString('pt-BR') 
                            : 'N/D'}
                        </td>
                        <td>
                          {campanha.date_stop 
                            ? new Date(campanha.date_stop).toLocaleDateString('pt-BR') 
                            : 'N/D'}
                        </td>
                        <td>{campanha.reach?.toLocaleString('pt-BR') || '0'}</td>
                        <td>{campanha.clicks?.toLocaleString('pt-BR') || '0'}</td>
                        <td>{campanha.cpm ? parseFloat(campanha.cpm).toFixed(2) : '0.00'}</td>
                        <td>{campanha.ctr ? `${parseFloat(campanha.ctr).toFixed(2)}%` : '0.00%'}</td>
                        <td>{campanha.unique_clicks?.toLocaleString('pt-BR') || '0'}</td>
                        <td>{campanha.impressions?.toLocaleString('pt-BR') || '0'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}