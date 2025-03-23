import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const FaculdadesList = () => {
  const [faculdades, setFaculdades] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchFaculdades = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/');
          return;
        }

        const response = await fetch('http://localhost:5000/faculdades', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFaculdades(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar faculdades:', error);
      }
    };

    fetchFaculdades();
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); 
  };

  if (loading) {
    return <p>Carregando faculdades...</p>;
  }

  return (
    <div className="faculdades-list">
      <h2>Lista de Faculdades</h2>
      
      <button onClick={handleLogout}>Logout</button> 
      <ul>
        {faculdades.map((faculdade) => (
          <li key={faculdade.id}>
            <h3>{faculdade.nome}</h3>
            <p>{faculdade.localizacao}</p>
            <p>{faculdade.descricao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FaculdadesList;
