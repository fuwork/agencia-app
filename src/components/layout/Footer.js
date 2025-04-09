import { Layout, Row} from "antd";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">
          <div className="copyright">
          <p>&copy; {new Date().getFullYear()} - <b>Fuwork</b> Todos os direitos reservados.</p>
          </div>
      </Row>
    </AntFooter>
  );
}

export default Footer;
