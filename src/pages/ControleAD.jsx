import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { supabase } from '../services/supabase';
import Card from '../components/Controle/Card';
import CampaignsModal from '../components/Controle/Modal';

const ControlePage = () => {
  const [clientes, setclientes] = useState([]);
  const [filteredclientes, setFilteredclientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetchclientes();
  }, []);

  useEffect(() => {
    const filtered = clientes.filter(cliente => 
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredclientes(filtered);
  }, [searchTerm, clientes]);

  const fetchclientes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        ;
      
      if (error) throw error;
      
      setclientes(data);
      setFilteredclientes(data);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClienteClick = (cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  return (
    <Container className="py-4">
      <Button  
        onClick={() => history.goBack()}
        className="mb-3"
      >
        &larr; Voltar
      </Button>
      
      <h1 className="mb-4">Controle de Campanhas por Cliente</h1>
      
      <Row className="mb-4">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Pesquisar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Button variant="primary" onClick={fetchclientes} className="w-100">
            Buscar
          </Button>
        </Col>
      </Row>
      
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredclientes.map(cliente => (
            <Col key={cliente.id}>
              <Card 
                cliente={cliente} 
                onClick={() => handleClienteClick(cliente)}
              />
            </Col>
          ))}
        </Row>
      )}
      
      {selectedCliente && (
        <CampaignsModal
          show={showModal}
          onHide={() => setShowModal(false)}
          cliente={selectedCliente}
        />
      )}
    </Container>
  );
};

export default ControlePage;