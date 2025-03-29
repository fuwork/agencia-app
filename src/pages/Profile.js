import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Popover, Button } from 'antd'; 

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  
  useEffect(() => {
    // Buscar o usuário atual
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    
    fetchUser();
    
    // Listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setVisible(false);
    // Redireciona para a página de signin após o logout
    history.push('/sign-in');
  };
  
  const content = (
    <div className="user-profile-popover">
      <p>Email: {user?.email}</p>
      <p>ID: {user?.id}</p>
      <Button onClick={handleLogout} type="primary" danger>
        Sair
      </Button>
    </div>
  );
  
 // const profile = <span className="profile-icon">👤 </span>;
  
  const handleClick = (e) => {
    if (user) {
      e.preventDefault();
    } else {

      history.push('/sign-in');
    }
  };
  
  return (
    <Popover
      content={content}
      title="Perfil do Usuário"
      trigger="click"
      visible={visible && user}
      onVisibleChange={setVisible}
    >
      <Link to="#" className="btn-sign-in" onClick={handleClick}>
        <span>{user ? user.email.split('@')[0] : 'Login'}</span>
      </Link>
    </Popover>
  );
};

export default UserProfile;