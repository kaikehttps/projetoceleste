/**
 * Configurações editáveis do portfólio.
 * Nada aqui é inventado: campos vazios simplesmente não aparecem no site.
 */
export const site = {
  author: 'Kaike Alves',

  /**
   * Link público do Projeto Celeste (canal, Discord, rede social…).
   * Enquanto estiver vazio, o botão "Conhecer o Projeto Celeste" fica oculto.
   * Ex.: 'https://www.youtube.com/@seu-canal'
   */
  projectCelesteUrl: '',

  /**
   * Seus contatos. Só aparecem no rodapé e no encerramento se preenchidos.
   * Ex.: { label: 'E-mail', href: 'mailto:voce@exemplo.com' }
   *      { label: 'Discord', href: 'https://discord.com/users/…' }
   */
  contacts: [] as { label: string; href: string }[],
}
