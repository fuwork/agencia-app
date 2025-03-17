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
import { supabase } from '../services/supabase';

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

const { Title, Text } = Typography;
const { Footer, Content } = Layout;

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '', // Estado para armazenar a mensagem de erro
    };
  }

  onFinish = async (values) => {
    const { email, password } = values;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Erro ao fazer login:', error.message);
        this.setState({ errorMessage: 'E-mail ou senha inválidos.' }); // Atualiza o estado com a mensagem de erro
        return;
      }

      console.log('Usuário logado:', data.user);
      this.props.history.push('/dashboard'); // Redireciona para a rota /dashboard
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      this.setState({ errorMessage: 'Ocorreu um erro ao tentar fazer login.' }); // Mensagem genérica para outros erros
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const { errorMessage } = this.state; // Acessa a mensagem de erro do estado

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
                {errorMessage && ( // Exibe a mensagem de erro se existir
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
                        message: "Porfavor, Digite seu e-mail!",
                      },
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
                        message: "Porfavor, Digite sua senha!",
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
                    >
                      ENTRAR
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