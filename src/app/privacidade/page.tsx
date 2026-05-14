import Link from "next/link";
import { ArrowLeft, Shield, Mail } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade — SchoolTruth",
  description: "Política de Privacidade e RGPD da plataforma SchoolTruth.",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-300">
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-20 w-full">
        <Link href="/" className="text-blue-500 hover:text-blue-400 font-bold mb-8 inline-flex items-center text-sm bg-slate-900/80 px-4 py-2 rounded-full backdrop-blur-md border border-slate-800">
          ← Voltar ao início
        </Link>
        
        <div className="bg-slate-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl mt-6">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shadow-inner shadow-blue-500/20">
                <Shield className="w-7 h-7" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                Política de Privacidade
              </h1>
            </div>
            
            <div className="prose prose-invert prose-lg text-slate-300 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-white mb-3">1. Responsável pelo Tratamento</h2>
                <p className="leading-relaxed">
                  A SchoolTruth é uma plataforma independente de inteligência comunitária escolar, operada em Portugal. O responsável pelo tratamento dos dados pessoais é o administrador da plataforma, contactável através do endereço em baixo no ponto 9.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">2. Dados Recolhidos</h2>
                <p className="leading-relaxed">Recolhemos os seguintes dados pessoais:</p>
                <ul className="list-disc list-inside space-y-2 mt-3 text-slate-400">
                  <li><strong className="text-white">Email:</strong> Para autenticação e verificação de identidade.</li>
                  <li><strong className="text-white">Inicial do filho/a:</strong> Para diferenciar avaliações de múltiplos filhos (não identifica o menor).</li>
                  <li><strong className="text-white">Respostas ao inquérito:</strong> Opiniões numéricas (escala 1-3) sobre a experiência escolar.</li>
                  <li><strong className="text-white">Texto livre (opcional):</strong> Comentário aberto e anónimo, sujeito a moderação.</li>
                  <li><strong className="text-white">Consentimento de contacto (opcional):</strong> Se aceita ser contactado para detalhar a experiência.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">3. Finalidade do Tratamento</h2>
                <p className="leading-relaxed">
                  Os dados são tratados exclusivamente para gerar indicadores agregados e anónimos sobre a qualidade percebida das escolas em Portugal, no âmbito do modelo &quot;Give-to-Get&quot;. Os resultados publicados nunca permitem identificar utilizadores individuais.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">4. Base Legal</h2>
                <p className="leading-relaxed">
                  O tratamento é realizado com base no consentimento informado do utilizador (artigo 6.º, n.º 1, alínea a) do RGPD), prestado no momento do registo através do Compromisso de Honra.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">5. Conservação dos Dados</h2>
                <p className="leading-relaxed">
                  Os dados pessoais são conservados enquanto a conta do utilizador estiver ativa. As avaliações submetidas permanecem na plataforma de forma anonimizada após a eliminação da conta, não sendo possível associá-las ao utilizador original.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">6. Direitos do Titular</h2>
                <p className="leading-relaxed">Nos termos do RGPD, tem direito a:</p>
                <ul className="list-disc list-inside space-y-2 mt-3 text-slate-400">
                  <li><strong className="text-white">Acesso:</strong> Solicitar uma cópia dos dados que temos sobre si.</li>
                  <li><strong className="text-white">Retificação:</strong> Corrigir dados inexatos.</li>
                  <li><strong className="text-white">Eliminação:</strong> Solicitar a eliminação da sua conta e dados pessoais associados.</li>
                  <li><strong className="text-white">Portabilidade:</strong> Receber os seus dados num formato estruturado.</li>
                  <li><strong className="text-white">Oposição:</strong> Opor-se ao tratamento dos seus dados.</li>
                </ul>
                <p className="leading-relaxed mt-3">
                  Para exercer qualquer destes direitos, envie um pedido para o email de contacto indicado abaixo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">7. Segurança</h2>
                <p className="leading-relaxed">
                  Os dados são armazenados em servidores seguros (Supabase, infraestrutura AWS), com encriptação em trânsito (TLS) e em repouso. O acesso à base de dados é protegido por Row Level Security (RLS) e autenticação por token JWT.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">8. Partilha com Terceiros</h2>
                <p className="leading-relaxed">
                  A SchoolTruth não vende, partilha ou transfere dados pessoais a terceiros. Os dados agregados e anonimizados podem ser utilizados para fins estatísticos ou de investigação académica.
                </p>
              </section>

              <section className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-3 italic">9. Contacto</h2>
                <p className="leading-relaxed">
                  Para qualquer questão relacionada com esta política, com o tratamento dos seus dados, ou sugestões/comunicação de erros por favor utilize o seguinte endereço <a href="mailto:janeiro.jm@gmail.com?subject=Feedback%20SchoolTruth" className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center align-middle ml-1" title="Enviar Email"><Mail className="w-5 h-5" /></a>
                </p>
              </section>

              <p className="text-sm text-slate-500 mt-8 border-t border-slate-800 pt-6">
                Última atualização: Maio de 2026. Esta política pode ser atualizada periodicamente. Notificaremos os utilizadores registados por email de quaisquer alterações substanciais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
