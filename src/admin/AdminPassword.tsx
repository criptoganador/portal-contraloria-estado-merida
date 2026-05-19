import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Eye, EyeOff, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AdminPassword() {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validación de fortaleza de contraseña
  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };
  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;
  const strengthLabel = ['', 'Muy débil', 'Débil', 'Aceptable', 'Buena', 'Excelente'][strengthScore];
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'][strengthScore];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    if (strengthScore < 3) {
      setError('La contraseña es demasiado débil. Mejora la fortaleza.');
      return;
    }

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/admin/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al cambiar la contraseña');
      }

      setSuccess('Contraseña actualizada correctamente. Usa la nueva contraseña en tu próximo inicio de sesión.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al conectar con el servidor.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <KeyRound className="w-7 h-7 text-amber-500" />
          Cambiar Contraseña
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Actualiza tu contraseña de administrador para mantener la seguridad del portal.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-950/40 border border-red-800/80 text-red-200 px-4 py-3.5 rounded-xl text-sm font-medium flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 px-4 py-3.5 rounded-xl text-sm font-medium flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Contraseña Actual</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ingresa tu contraseña actual"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Nueva Contraseña</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa la nueva contraseña"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      i <= strengthScore ? strengthColor : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-bold ${strengthScore >= 4 ? 'text-emerald-400' : strengthScore >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                {strengthLabel}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { key: 'length', label: 'Mínimo 8 caracteres' },
                { key: 'uppercase', label: 'Una letra mayúscula' },
                { key: 'lowercase', label: 'Una letra minúscula' },
                { key: 'number', label: 'Un número' },
                { key: 'special', label: 'Un carácter especial (!@#$)' },
              ].map(({ key, label }) => (
                <div key={key} className={`flex items-center gap-1.5 ${passwordChecks[key as keyof typeof passwordChecks] ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la nueva contraseña"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Las contraseñas no coinciden
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !currentPassword || !newPassword || !confirmPassword}
          className="w-full bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          <ShieldCheck className="w-5 h-5" />
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  );
}
