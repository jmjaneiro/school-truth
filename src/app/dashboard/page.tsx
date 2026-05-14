import { redirect } from "next/navigation";

// O dashboard antigo com dados mock foi removido.
// Redireccionamos para a nova página de resultados que contém os dados reais.
export default function DashboardPage() {
  redirect("/resultados");
}
