import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegistroPage = () => {
  const { registro } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [verPass, setVerPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmar)
      return setError('Las contraseñas no coinciden');
    if (form.password.length < 6)
      return setError('La contraseña debe tener al menos 6 caracteres');
    setLoading(true);
    try {
      await registro(form.nombre, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = (field) => ({
    value: form[field],
    onChange: e => setForm(p => ({ ...p, [field]: e.target.value })),
  });

  const Field = ({ label, field, type = 'text', placeholder, icon: Icon, extra }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12, color: '#9898b0', display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5a5a75', pointerEvents: 'none' }} />
        <input type={type} required placeholder={placeholder} {...inp(field)} style={{
          width: '100%', background: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)',
          color: '#f0f0f5', fontFamily: "'Outfit', sans-serif", fontSize: 14,
          padding: `11px ${extra ? '38px' : '14px'} 11px 38px`, borderRadius: 8, outline: 'none',
        }}
          onFocus={e => e.target.style.borderColor = 'rgba(230,57,70,0.4)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        {extra}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px',
      background: 'radial-gradient(ellipse at 70% 40%, rgba(230,57,70,0.08) 0%, transparent 60%)',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: '#111118', borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.08)', padding: '40px 36px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2,
            background: 'linear-gradient(90deg,#e63946,#ffd166)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CINE<span style={{ WebkitTextFillColor: '#ffd166' }}>JOSEITO</span></span>
          <p style={{ color: '#5a5a75', fontSize: 13, marginTop: 6 }}>Crea tu cuenta gratis</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 20,
            color: '#ff6b6b', fontSize: 13,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <Field label="Nombre" field="nombre" placeholder="Tu nombre" icon={User} />
          <Field label="Email"  field="email"  type="email" placeholder="tu@email.com" icon={Mail} />

          {/* Password con toggle */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#9898b0', display: 'block', marginBottom: 6 }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5a5a75', pointerEvents: 'none' }} />
              <input type={verPass ? 'text' : 'password'} required placeholder="Mínimo 6 caracteres" {...inp('password')} style={{
                width: '100%', background: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f0f0f5', fontFamily: "'Outfit', sans-serif", fontSize: 14,
                padding: '11px 38px 11px 38px', borderRadius: 8, outline: 'none',
              }}
                onFocus={e => e.target.style.borderColor = 'rgba(230,57,70,0.4)'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button type="button" onClick={() => setVerPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5a5a75' }}>
                {verPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirmar */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: '#9898b0', display: 'block', marginBottom: 6 }}>Confirmar contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5a5a75', pointerEvents: 'none' }} />
              <input type={verPass ? 'text' : 'password'} required placeholder="Repite la contraseña" {...inp('confirmar')} style={{
                width: '100%', background: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f0f0f5', fontFamily: "'Outfit', sans-serif", fontSize: 14,
                padding: '11px 14px 11px 38px', borderRadius: 8, outline: 'none',
              }}
                onFocus={e => e.target.style.borderColor = 'rgba(230,57,70,0.4)'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#9b1c26' : '#e63946',
            color: '#fff', border: 'none', padding: '12px',
            borderRadius: 8, fontFamily: "'Outfit', sans-serif",
            fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#5a5a75', fontSize: 13 }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#e63946', textDecoration: 'none', fontWeight: 500 }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistroPage;
