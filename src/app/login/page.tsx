"use client";

import { useState } from "react";
import { ArrowRight, Mail, Lock, ShieldAlert, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const action = isLogin ? login : signup;
      const result = await action(formData);
      
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else if ((result as any)?.message) {
        setSuccessMessage((result as any).message);
        setIsLoading(false);
      } else if (result?.success) {
        window.location.href = (result as any).redirect || '/onboarding';
      }
    } catch (err) {
      setError("Ocorreu um erro ao comunicar com o servidor.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 font-sans relative overflow-hidden">
      {/* Background Video */}
      <video 
        autoPlay preload="none" 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 mix-blend-screen pointer-events-none"
      >
        <source src="/media/login.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay z-0 pointer-events-none"></div>

      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse z-0" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 group">
            <h1 className="text-3xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform">
              SchoolTruth<span className="text-blue-500">.</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Bem-vindo de volta" : "Crie a sua conta"}
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            {isLogin 
              ? "Aceda à inteligência comunitária escolar." 
              : "Junte-se a milhares de pais e descubra a verdade."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl flex items-start text-rose-400 text-sm">
            <ShieldAlert className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-start text-emerald-400 text-sm">
            <Mail className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
            <p>{successMessage}</p>
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                name="email"
                required
                placeholder="O seu endereço de email" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                name="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>
          </div>

          {!isLogin && (
            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 border border-slate-800 rounded-xl bg-slate-900/30 cursor-pointer hover:bg-slate-800/50 transition-colors">
                <input 
                  type="checkbox" 
                  name="honor"
                  required 
                  className="mt-1 w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-950"
                />
                <span className="text-sm text-slate-400 font-medium leading-relaxed">
                  <strong className="text-white">Compromisso de Honra:</strong> Declaro solenemente que sou encarregado de educação e que a informação que irei submeter reflete a minha experiência verídica.
                </span>
              </label>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl transition-all flex justify-center items-center shadow-lg shadow-blue-900/50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? "Entrar na plataforma" : "Criar conta e avançar"} 
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800 pt-6">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}
          </p>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="mt-3 flex items-center justify-center w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all"
          >
            {isLogin ? (
              <><UserPlus className="w-4 h-4 mr-2" /> Criar nova conta</>
            ) : (
              <><LogIn className="w-4 h-4 mr-2" /> Iniciar sessão</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
