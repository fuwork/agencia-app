import { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Layout, Menu, Typography } from "antd";
import { Button } from 'react-bootstrap';
import CredenciaisForm from "../components/Credenciais/CredencaisModal";
import {
    KeyOutlined,
    SettingOutlined,
  } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Title, Paragraph } = Typography;

export default function Configuracoes() {
  const [activeKey, setActiveKey] = useState("credenciais");
  const history = useHistory();

  const renderContent = () => {
    switch (activeKey) {
      case "credenciais":
        return <CredenciaisForm />;
      case "outras":
        return <div>Outras configurações ainda não implementadas.</div>;
      default:
        return <div>Selecione uma opção</div>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
    <Sider
      width={240}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        paddingTop: 24,
      }}
    >
      <Title level={4} style={{ padding: "0 24px" }}>
        Configurações
      </Title>
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        onClick={(e) => setActiveKey(e.key)}
        style={{ marginTop: 24 }}
      >
        <Menu.Item key="credenciais" >
          Adicionar Credencial
        </Menu.Item>
        <Menu.Item key="outras" icon={<SettingOutlined />}>
          Outras Configurações
        </Menu.Item>
        <Menu.Item>
        <Button  
            onClick={() => history.goBack()}
            className="mb-3"
        >
            &larr; Voltar
        </Button>
        </Menu.Item>
      </Menu>
    </Sider>

    <Layout style={{ padding: "24px" }}>
      <Content style={{ maxWidth: 900, margin: "0 auto" }}>
        {renderContent()}
      </Content>
    </Layout>
  </Layout>
);
}
