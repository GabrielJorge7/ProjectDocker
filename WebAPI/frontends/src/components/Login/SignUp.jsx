import React, { useState } from 'react';
import api from '../../service/api';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações básicas
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('E-mail inválido.');
      return;
    }
    if (password.length < 8) {
      setError('Senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (!/^\(\d{2}\)\d{4,5}-\d{4}$/.test(phone)) {
      setError('Telefone deve estar no formato (99)99999-9999');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('api/User/Create', {
        nameUser: name,
        emailUser: email,
        passwordUser: password,
        phoneUser: phone,
      });
      alert(response.data.message || 'Usuário cadastrado com sucesso!');
       setName('');
      setEmail('');
      setPassword('');
      setPhone('');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const messages = Object.values(serverErrors).flat();
        setError(messages.join(' | '));
      } else {
        setError('Erro ao cadastrar. Verifique os dados e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
      <input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default SignUp;
