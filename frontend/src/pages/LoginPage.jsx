import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useAuth } from '../main.jsx';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('fan@worldcup.local');
  const [password, setPassword] = useState('fan1234');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/reservations');
    } catch {
      setError('로그인 정보를 확인해주세요.');
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-panel" onSubmit={submit}>
        <LockKeyhole size={30} />
        <h1>{mode === 'login' ? '로그인' : '회원가입'}</h1>
        <div className="segmented">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>로그인</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>회원가입</button>
        </div>
        {mode === 'register' && (
          <label>
            이름
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
        )}
        <label>
          이메일
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          비밀번호
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="primary-button wide" type="submit">{mode === 'login' ? '로그인' : '가입하기'}</button>
      </form>
    </div>
  );
}
