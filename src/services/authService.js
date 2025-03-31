// src/services/authService.js
import { supabase } from './supabase';

class AuthService {
  // Verifica se há uma sessão ativa
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao obter sessão:', error.message);
        return null;
      }
      
      return data.session;
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      return null;
    }
  }

  // Verifica se o usuário está autenticado
  async isAuthenticated() {
    const session = await this.getSession();
    return !!session;
  }

  // Obtém o usuário atual
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Erro ao obter usuário:', error.message);
        return null;
      }
      
      return data.user;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  }

  // Faz login com email e senha
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro ao fazer login:', error.message);
        throw error;
      }
      
      if (data.session) {
        localStorage.setItem('authToken', data.session.access_token);
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  // Faz logout
  async logout() {
    try {
      localStorage.removeItem('authToken');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', error.message);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  // Configurar listener para mudanças de autenticação
  setupAuthListener(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

// Exporta uma instância única do serviço
export default new AuthService();