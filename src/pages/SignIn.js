import React, { Component } from "react";
import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
} from "antd";
import { withRouter } from 'react-router-dom';
import signinbg from "../assets/images/FUWORK.png";
import authService from '../services/authService'; // Importando o serviço de autenticação

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

const { Title, Text } = Typography;
const { Footer, Content } = Layout;

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      isLoading: false
    };
  }

  componentDidMount() {
    // Limpa qualquer token existente ao carregar a página de login
    localStorage.removeItem('authToken');
  }

  onFinish = async (values) => {
    const { email, password } = values;
    this.setState({ isLoading: true, errorMessage: '' });

    try {
      await authService.login(email, password);
      this.props.history.push('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      this.setState({ 
        errorMessage: error.message === 'Invalid login credentials'
          ? 'E-mail ou senha inválidos.'
          : 'Ocorreu um erro ao tentar fazer login.'
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const { errorMessage, isLoading } = this.state;

    return (
      <>
        <Layout className="layout-default layout-signin">
          <Content className="signin">
            <Row gutter={[15, 0]} justify="space-around">
              <Col
                xs={{ span: 24, offset: 0 }}
                lg={{ span: 6, offset: 2 }}
                md={{ span: 12 }}
              >
                <Title className="mb-15">Bem vindo ao CRM-Fuwork</Title>
                <Title className="font-regular text-muted" level={5}>
                  Digite seu e-mail e senha
                </Title>
                {errorMessage && (
                  <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>
                    {errorMessage}
                  </Text>
                )}
                <Form
                  onFinish={this.onFinish}
                  onFinishFailed={this.onFinishFailed}
                  layout="vertical"
                  className="row-col"
                >
                  <Form.Item
                    className="username"
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, digite seu e-mail!",
                      },
                      {
                        type: 'email',
                        message: "Por favor, digite um e-mail válido!",
                      }
                    ]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>

                  <Form.Item
                    className="username"
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, digite sua senha!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>

                  <Form.Item
                    name="remember"
                    className="aligin-center"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked onChange={onChange} />
                    Lembrar-me
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      {isLoading ? 'AUTENTICANDO...' : 'ENTRAR'}
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col
                className="sign-img"
                style={{ padding: 8 }}
                xs={{ span: 10 }}
                lg={{ span: 6}}
                md={{ span: 6 }}
              >
                <img src={signinbg} alt="" />
              </Col>
            </Row>
          </Content>
          <Footer>
            <Menu mode="horizontal" className="menu-nav-social">
            </Menu>
            <div className="copyright">
              <p>&copy; {new Date().getFullYear()} - <b>Fuwork</b> Todos os direitos reservados.</p>
            </div>
          </Footer>
        </Layout>
      </>
    );
  }
}

export default withRouter(SignIn);