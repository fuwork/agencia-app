import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { supabase } from '../services/supabase';
import AgencyCard from '../components/Controle/Card';
import CampaignsModal from '../components/Controle/Modal';

const ControlePage = () => {
  const [agencias, setagencias] = useState([]);
  const [filteredagencias, setFilteredagencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetchagencias();
  }, []);

  useEffect(() => {
    const filtered = agencias.filter(agency => 
      agency.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredagencias(filtered);
  }, [searchTerm, agencias]);

  const fetchagencias = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agencias')
        .select('*');
      
      if (error) throw error;
      
      setagencias(data);
      setFilteredagencias(data);
    } catch (error) {
      console.error('Error fetching agencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgencyClick = (agency) => {
    setSelectedAgency(agency);
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
      
      <h1 className="mb-4">Controle de Campanhas por Agência</h1>
      
      <Row className="mb-4">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Pesquisar agência..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Button variant="primary" onClick={fetchagencias} className="w-100">
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
          {filteredagencias.map(agency => (
            <Col key={agency.id}>
              <AgencyCard 
                agency={agency} 
                onClick={() => handleAgencyClick(agency)}
              />
            </Col>
          ))}
        </Row>
      )}
      
      {selectedAgency && (
        <CampaignsModal
          show={showModal}
          onHide={() => setShowModal(false)}
          agency={selectedAgency}
        />
      )}
    </Container>
  );
};

export default ControlePage;