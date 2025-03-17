import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import eChart from "./configs/eChart";
import { clienteService } from "../../services/clienteService";
import { pagamentoService } from "../../services/pagamentoService";

function EChart() {
  const { Title, Paragraph } = Typography;

  const [stats, setStats] = useState({
    totalClientes: 0,
    totalPagamentos: 0,
    valorTotalPagamentos: 0,
    pagamentosPendentes: 0,
    pagamentosConcluidos: 0,
  });

  const [loading, setLoading] = useState(true);

  // Busca os dados dos clientes e pagamentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientes, pagamentos] = await Promise.all([
          clienteService.getAll(),
          pagamentoService.getAll(),
        ]);

        const valorTotal = pagamentos.reduce((acc, p) => acc + (parseFloat(p.valor) || 0), 0);
        const pendentes = pagamentos.filter((p) => p.status === 'pendente').length;
        const concluidos = pagamentos.filter((p) => p.status === 'concluido').length;

        setStats({
          totalClientes: clientes.length,
          totalPagamentos: pagamentos.length,
          valorTotalPagamentos: valorTotal,
          pagamentosPendentes: pendentes,
          pagamentosConcluidos: concluidos,
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Carregando dashboard...</div>;
  }

  const items = [
    {
      Title: stats.totalClientes,
      user: "Clientes",
    },
    {
      Title: stats.valorTotalPagamentos.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      user: "Total Vendas",
    },
  ];

  return (
    <>
      <div id="chart">
        <ReactApexChart
          className="bar-chart"
          options={eChart.options}
          series={eChart.series}
          type="bar"
          height={220}
        />
      </div>
      <div className="chart-vistior">
        <Title level={5}>Vendas</Title>
        <Paragraph className="lastweek">
        </Paragraph>
        <Paragraph className="lastweek">
          Total de vendas por mês
        </Paragraph>
        <Row gutter>
          {items.map((v, index) => (
            <Col xs={6} xl={6} sm={6} md={6} key={index}>
              <div className="chart-visitor-count">
                <Title level={4}>{v.Title}</Title>
                <span>{v.user}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default EChart;
