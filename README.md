# EcoDigital 🌿

> Plataforma de gamificação para promover hábitos digitais sustentáveis no ambiente corporativo e acadêmico.

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 💻 Sobre o Projeto

[cite_start]O **EcoDigital** é um sistema desenvolvido como parte da disciplina de *Análise e Projetos de Sistemas II* da **Universidade Cidade de São Paulo (UNICID)**[cite: 1, 2].

[cite_start]O objetivo principal é auxiliar grandes empresas e usuários a gerenciar metas de sustentabilidade (ESG), oferecendo ferramentas práticas para monitorar e reduzir a pegada de carbono digital[cite: 635, 636]. [cite_start]O sistema utiliza gamificação (missões, pontuação e recompensas) para incentivar a "limpeza digital" e o uso consciente da tecnologia[cite: 535, 536].

## 🛠 Tecnologias Utilizadas

[cite_start]O projeto foi desenvolvido utilizando uma arquitetura moderna e escalável [cite: 705-713]:

* **Backend (BaaS):** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
* **Frontend Web (Dashboard):** [React](https://react.dev/) com [Next.js](https://nextjs.org/) e TypeScript
* **Frontend Mobile (App):** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)

## ✨ Funcionalidades Principais

[cite_start]O sistema é dividido em módulos funcionais baseados nos requisitos do projeto [cite: 17-114]:

### 🔐 Autenticação e Perfil
* Cadastro e Login seguro com validação de e-mail.
* Recuperação de senha.
* [cite_start]Conformidade com a **LGPD** (criptografia e controle de dados)[cite: 116].

### 🎮 Gamificação e Missões
* **Gerenciamento de Missões:** Usuários aceitam desafios (ex: "Limpar caixa de spam") e acompanham o progresso.
* **Sistema de Recompensas:** Conclusão de missões gera XP e badges (ex: "Eco Explorer", "Guardião Digital").
* **Ranking:** Visualização de pontuação e engajamento.

### 📊 Dashboard Administrativo (Web)
* Gestão de colaboradores e usuários.
* Relatórios de atividades e impacto ambiental.
* Visualização de métricas de sustentabilidade.

## 📂 Estrutura do Projeto

Este repositório funciona como um *monorepo*, contendo tanto a aplicação web quanto a mobile:

```bash
EcoDigital/
├── painel-web/         # Código do Dashboard (Next.js)
│   └── dashboard/      # Raiz do projeto Web
├── ecodigital-app/     # Código do Aplicativo Mobile (React Native/Expo)
└── README.md           # Documentação
