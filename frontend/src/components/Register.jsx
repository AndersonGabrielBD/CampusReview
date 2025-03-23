import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

const Register = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { nome, email, senha };

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Usuário registrado com sucesso!");
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMessage(data.error || "Erro ao registrar usuário");
      }
    } catch (error) {
      setMessage("Erro ao conectar com o servidor");
    }
  };
  const haveAccount = () =>{
    setTimeout(() => {
      navigate('/');
    }, 500);
  }

  return (
    <div>
      <div className="logo"><h1>CampusReview</h1></div>

      <div className="form">
        <p className="pReview">Se registre para começar a avaliar!</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
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
          <button type="submit">Registrar</button>
          <a onClick={haveAccount} > ja tem uma conta?</a>
        </form>

        {message && <p className={message === "Usuário registrado com sucesso!" ? "success" : "p-error"}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
