import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../service/api';
import Cookies from 'js-cookie';
import { Eye, EyeSlash } from "@phosphor-icons/react";

const SignIn = ({ onSignUpClick }) => {
  const [emailUser, setEmailUser] = useState('');
  const [passwordUser, setPasswordUser] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validações básicas
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailUser)) {
      setError('E-mail inválido.');
      return;
    }
    if (passwordUser.length < 8) {
      setError('Senha deve ter pelo menos 8 caracteres.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('api/User/Login', {
        Email: emailUser,
        Password: passwordUser
      });

      if (response.status === 200) {
        Cookies.set('login', 'ativo', { expires: 1 });
        navigate('/inicio');
      } else {
        setError(response.data?.message || 'Falha ao realizar o login.');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || 'Falha ao realizar o login. Verifique suas credenciais e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col w-3/4 min-h-screen px-12 justify-center'>
      <div className='flex justify-center mb-14'>
        <h1 className='text-4xl text-[#2D2D2D] font-semibold'>Bem vindo(a)!</h1>
      </div>
      <div className='flex text-lg'>
        <h2>
          Ainda não possui uma conta?
          <span
            className="underline hover:cursor-pointer hover:text-[#BD1A37] px-1"
            onClick={onSignUpClick}
          >
            Clique aqui para criar a sua conta.
          </span>
          É de graça, leva poucos minutos.
        </h2>
      </div>

      {error && <div className='text-red-500 mb-4'>{error}</div>}

      <form onSubmit={handleSubmit} className='flex flex-col gap-y-4 mt-8 text-[#2D2D2D]'>
        <h3 className='text-2xl'>Email:</h3>
        <input
          type="email"
          value={emailUser}
          onChange={(e) => {
            setEmailUser(e.target.value);
            setError('');
          }}
          className='h-[50px] border-[2px] border-[#D9D9D9] rounded-md px-3 text-lg'
          required
        />
        <h3 className='text-2xl'>Senha:</h3>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            value={passwordUser}
            onChange={(e) => {
              setPasswordUser(e.target.value);
              setError('');
            }}
            className='h-[50px] border-[2px] border-[#D9D9D9] rounded-md px-3 text-lg pr-10 w-full'
            required
          />
          <button
            type='button'
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className='absolute right-2 top-1/2 transform -translate-y-1/2'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={30} /> : <EyeSlash size={30} />}
          </button>
        </div>
        <button
          type='submit'
          className='h-[55px] bg-[#BD1A37] text-2xl text-white mt-[70px]'
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
