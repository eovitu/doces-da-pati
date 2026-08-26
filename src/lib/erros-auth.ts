import { firebaseConfigurado } from "./firebase";

export const MENSAGEM_CONFIG =
  "O login está indisponível nesta versão do site: falta a configuração do Firebase. " +
  "Isso é um problema de publicação, não da sua senha.";

/**
 * Traduz o erro do Firebase Auth para uma frase que a Patricia entenda.
 *
 * O código bruto (`auth/...`) nunca vai para a tela — vai só para o console,
 * onde ajuda a diagnosticar sem contar a ninguém se o email existe ou não.
 * Por isso credencial errada, usuário inexistente e email malformado caem
 * todos na mesma mensagem: dizer qual dos três foi entrega informação de
 * conta para quem estiver tentando adivinhar.
 */
export function mensagemDeErroDeLogin(erro: unknown): string {
  const codigo =
    typeof erro === "object" && erro !== null && "code" in erro
      ? String((erro as { code: unknown }).code)
      : "";

  console.error("Falha no login administrativo:", codigo || erro);

  switch (codigo) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Não foi possível entrar. Verifique seu email e senha.";
    case "auth/user-disabled":
      return "Esta conta está desativada.";
    case "auth/too-many-requests":
      return "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.";
    case "auth/network-request-failed":
      return "Sem conexão com a internet. Tente de novo.";
    case "auth/invalid-api-key":
    case "auth/api-key-not-valid":
    case "auth/configuration-not-found":
      return MENSAGEM_CONFIG;
    case "auth/operation-not-allowed":
      return "O login por email e senha não está habilitado no Firebase deste projeto.";
    default:
      // Erro que não é de senha: não acusar a Patricia de errar a senha.
      return firebaseConfigurado
        ? "Não foi possível entrar agora. Tente de novo em instantes."
        : MENSAGEM_CONFIG;
  }
}

