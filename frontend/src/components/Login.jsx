import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, senha };

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Login bem-sucedido!");
        setTimeout(() => {
          navigate('/faculdades'); 
        }, 1000); 
      } else {
        setMessage(data.error || "Erro ao fazer login");
      }
    } catch (error) {
      setMessage("Erro ao conectar com o servidor");
    }
  };
  const haveAccount = () =>{
    setTimeout(() => {
      navigate('/register');
    }, 500);
  }

  return (
    <div className='formLogin'>
      <div className="logoLogin">
        <h1>CampusReview</h1>
      </div>
      <p className="pReviewLogin">Faça o login para começar a avaliar!</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <a onClick={haveAccount} > Ainda não tem uma conta?</a>

      </form>
      {message && <p className={message === "Login bem-sucedido!" ? 'success' : 'p-error'}>{message}</p>}
    </div>
  );
};

export default Login;
