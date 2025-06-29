'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Kullanıcı rolüne göre yönlendirme yap
      const userResponse = await fetch('/api/auth/profile');
      const userData = await userResponse.json();
      
      if (userData.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Giriş Yap</h2>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">E-posta</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Şifre</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <Link href="/register" className="text-decoration-none">
                  Hesabınız yok mu? Kayıt olun
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
