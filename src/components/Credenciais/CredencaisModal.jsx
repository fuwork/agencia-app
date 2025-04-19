// src/components/configuracao/CredenciaisForm.jsx

import { Form, Input, message, Select, Button } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { encrypt } from "../../utils/CredentialEncryptor";

const { Option } = Select;

export default function CredenciaisForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase.from("clientes").select("*");
      if (error) throw error;
      setClientes(data);
    } catch (err) {
      console.error("Erro ao Buscar Clientes", err);
      message.error("Erro ao Buscar Clientes");
    }
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      const encrypted = await encrypt(
        {
          token: values.token,
          code_meta: values.code_meta,
        },
        process.env.REACT_APP_SECRET_KEY
      );

      const payload = {
        cliente: values.cliente,
        token: encrypted.ciphertext,
        code_meta: encrypted.ciphertext,
      };

      await supabase.from("credenciais").insert([payload]);

      message.success("Credencial cadastrada com sucesso!");
      form.resetFields();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      message.error("Erro ao cadastrar credencial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 20 }}>Adicionar Credencial</h2>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item name="cliente" label="Cliente" rules={[{ required: true }]}>
          <Select placeholder="Selecione o Cliente">
            {clientes.map((cliente) => (
              <Option key={cliente.id} value={cliente.nome}>
                {cliente.nome}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="token" label="Token" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="code_meta" label="Code Meta" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
