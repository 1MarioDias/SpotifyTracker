# SpotifyTracker - SPA Gamificada de Tracking e Collages

## Descrição  
Aplicação SPA desenvolvida em Vue 3 para acompanhar a atividade musical dos utilizadores, com gamificação e criação de collages de álbuns e artistas baseadas na escuta.

## Tecnologias  
- Vue 3 + Vite  
- Vue Router  
- Pinia para gestão de estado global  
- json-server para mock API local  
- LastFM e Spotify APIs para dados musicais  
- Vitest para testes unitários  

## Funcionalidades  
- Tracking gamificado: XP, níveis, badges, progresso de objetivos  
- CRUD de objetivos e registo de ações do utilizador  
- Dashboard com estatísticas personalizadas  
- Criação de collages personalizadas de álbuns e artistas  
- Filtros temporais para análise das collages  
- Integração com APIs externas para dados musicais  

## Como Executar Localmente  

### Pré-requisitos  
- Node.js instalado (versão recomendada ≥16)  
- API key válida LastFM (e/ou Spotify)  

### Passos para instalação  
```bash
npm install
npm run mock-server
npm run dev
```


### Estrutura da API Mock  
- `/goals` — objetivos do utilizador  
- `/actions` — registo de ações realizadas  
- `/collages` — collages criadas com filtros  
- `/users` — dados dos utilizadores  

## Testes  
- Executar testes com:
```bash
npm run test
```