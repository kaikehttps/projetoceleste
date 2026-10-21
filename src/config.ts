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

  /**
   * Música de fundo que começa na tela de entrada e segue baixinha pelo site.
   * Coloque o arquivo em public/audio/ com este nome. Se o arquivo não existir,
   * a entrada mostra só "Entrar" e o botão de música não aparece.
   */
  music: {
    src: 'audio/musica-tema.m4a',
    /** Volume na tela de entrada (0 a 1). A trilha original é bem alta (-10 LUFS). */
    menuVolume: 0.24,
    /** Volume de fundo enquanto a pessoa navega pelo site (0 a 1). */
    volume: 0.06,
    title: 'Main Menu — Original Theme',
    file: 'music_title_155bpm',
    copyright: 'Valve Software — Deadlock',
    /** Vídeo de referência e seus créditos. */
    reference: {
      url: 'https://www.youtube.com/watch?v=WkGDC3idX1E',
      channel: { name: 'Dead Air', href: 'https://www.youtube.com/@DeadlockAir' },
      people: [
        { role: 'Edição', name: 'Jacky Powers', href: 'https://www.youtube.com/@DeadAirJacky' },
        { role: 'Design gráfico', name: 'Daisy Powers', href: 'https://www.youtube.com/@DeadAirDaisy' },
      ],
    },
  },
}
