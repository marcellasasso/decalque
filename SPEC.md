# Decalque — Spec

App web para copiar desenhos: a câmera traseira do iPhone mostra o papel e uma imagem
fica sobreposta com opacidade ajustável. Uso pessoal, custo zero, sem App Store.

## Contexto de uso

- iPhone 15, Chrome (iOS — motor WebKit), instalado via "Adicionar à Tela de Início".
- Celular fixo num suporte ~20 cm acima do papel, em pé (retrato), câmera traseira.
- A 20 cm: lente 1x enxerga ~18 × 25 cm; lente 0.5x cobre uma A4 inteira (com leve distorção).
- Conteúdo copiado: majoritariamente desenhos/ilustrações.

## Requisitos

### Câmera
- R1. Câmera traseira em tempo real, mostrando o **quadro inteiro** (sem cortar laterais;
  `object-fit: contain`). A faixa livre embaixo abriga a barra de controles.
- R2. Botão alterna entre as lentes traseiras disponíveis (1x ↔ 0.5x); a escolha é lembrada.
- R3. Ao voltar do segundo plano, a câmera religa sozinha.
- R4. Mensagem clara se a permissão da câmera for negada.

### Imagem sobreposta
- R5. Escolher imagem via seletor do sistema (Fototeca, Tirar Foto, Arquivos).
- R6. Opacidade ajustável por slider, sempre visível — inclusive com a imagem travada.
- R7. Gestos: mover (1 dedo), redimensionar (pinça), girar (2 dedos).
- R8. Botão espelhar (inverter na horizontal).
- R8b. Botão "Sem giro": a pinça só redimensiona, mantendo o ângulo atual.
- R8c. Botão centralizar: volta a imagem ao centro, tamanho e ângulo originais.
- R9. Botão travar: desativa os gestos de posicionamento para evitar toques acidentais.
- R10. Modo preto e branco (liga/desliga).

### Interface
- R11. Barra inferior: slider de opacidade + botões (imagem · P&B · espelhar · lente · travar · esconder).
- R12. Esconder controles: tela limpa; um toque traz a barra de volta.
- R13. Somente retrato.

### Persistência e conforto
- R14. Guarda só a **última** imagem + posição, escala, rotação, espelhamento, opacidade,
  P&B e lente — localmente (IndexedDB), sem servidor. Ao reabrir, tudo é restaurado.
- R15. Tela sempre acesa enquanto o app está aberto (Wake Lock API).
- R16. PWA: nome "Decalque", ícone de lápis, abre em tela cheia pela tela de início.

### Fora de escopo (por enquanto)
- Modo "só contornos" (detecção de bordas) e cor das linhas.
- Histórico de várias imagens.
- Paisagem.

## Stack e hospedagem

- React + TypeScript + Vite. Gestos com `@use-gesture/react`. Sem outras dependências de runtime.
- Repositório público no GitHub; deploy no GitHub Pages via GitHub Actions a cada push na `main`.
- Testes no iPhone direto pela URL do GitHub Pages (câmera exige HTTPS).

## Arquitetura

Princípios: componentes pequenos e com uma responsabilidade; lógica de navegador
(câmera, gestos, armazenamento, wake lock) em hooks/módulos, fora dos componentes;
`App` só compõe; tipos explícitos, sem `any`.

```
src/
  main.tsx
  App.tsx                    # composição e estado de alto nível
  types.ts                   # OverlaySettings, Transform, etc.
  components/
    CameraView.tsx           # <video> da câmera
    OverlayImage.tsx         # imagem sobreposta + transform + gestos
    ControlBar.tsx           # barra inferior (layout)
    OpacitySlider.tsx
    ImagePickerButton.tsx
    IconButton.tsx
    CameraError.tsx
  hooks/
    useCamera.ts             # getUserMedia, troca de lente, religar ao voltar
    useOverlayGestures.ts    # mover/pinça/girar via @use-gesture
    usePersistedSettings.ts  # carrega/salva no IndexedDB
    useWakeLock.ts
  lib/
    storage.ts               # acesso ao IndexedDB
```

## Entregas

Cada entrega termina com deploy e teste no iPhone.

| # | Entrega | Requisitos | Validar no iPhone |
|---|---------|-----------|-------------------|
| 1 | Prova de vida | R1, R4, R5, R6, R13, deploy | Câmera abre no Chrome e pelo ícone; imagem visível por cima |
| 2 | Alinhar | R7, R8, R9, R11, R12 | Alinhar com o papel é fácil; gestos fluidos |
| 3 | Conforto | R2, R3, R10, R14, R15, R16 | Sair/voltar restaura tudo; 20 min desenhando sem a tela apagar |
