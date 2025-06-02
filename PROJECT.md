# 🌾 Brain Agriculture – Cadastro de Produtores Rurais  
> **Aplicação Full-stack em monorepo** – React 18 + Redux Toolkit / NestJS 10 + PostgreSQL

---

## 📑 Sumário
1. [Visão Geral](#-visão-geral)  
2. [Funcionalidades Principais](#-funcionalidades-principais)  
3. [Requisitos de Negócio](#-requisitos-de-negócio)  
4. [Tecnologias & Boas Práticas](#-tecnologias--boas-práticas)  
5. [Estrutura do Repositório](#-estrutura-do-repositório)  
6. [Começando](#-começando)  
7. [Scripts Disponíveis](#-scripts-disponíveis)  
8. [Testes & Cobertura](#-testes--cobertura)  
9. [Docker / Deploy Local](#-docker--deploy-local)  
10. [Deploy em Produção](#-deploy-em-produção)  
11. [Observabilidade](#-observabilidade)  
12. [Critérios de Avaliação](#-critérios-de-avaliação)  
13. [Contribuindo](#-contribuindo)  
14. [Licença](#-licença)

---

## ✨ Visão Geral
Este projeto demonstra a implementação completa do teste técnico **Brain Agriculture**.  
Ele cobre **frontend**, **backend** e **infraestrutura**, validando regras de domínio agrícolas e exibindo um dashboard analítico.

---

## 🚀 Funcionalidades Principais
| Categoria                | Descrição                                                                           |
|--------------------------|-------------------------------------------------------------------------------------|
| **CRUD Produtor**        | Cadastrar, editar, listar e excluir produtores rurais                               |
| **Validações**           | CPF/CNPJ, área agricultável + vegetação ≤ área total                                |
| **Múltiplas Fazendas**   | Um produtor pode possuir 0 … N propriedades                                         |
| **Culturas por Safra**   | Cada fazenda registra 0 … N culturas em diferentes safras                           |
| **Dashboard**            | Totais de fazendas/hectares + 3 gráficos de pizza (estado | cultura | uso do solo)  |
| **API REST**             | Endpoints versionados e documentados via Swagger                                    |
| **Testes**               | Unitários, integração e E2E com cobertura ≥ 80 %                                    |
| **Deploy Docker**        | Stack completa sob `docker-compose` (frontend, backend, Postgres)                   |

---

## 📋 Requisitos de Negócio
| Requisito                                   | Regra                                                                      |
|---------------------------------------------|----------------------------------------------------------------------------|
| Validação de documento                      | CPF ou CNPJ válido                                                         |
| Integridade de áreas                        | `areaAgricultável + areaVegetação` **não** pode exceder `areaTotal`        |
| Relacionamentos                             | Produtor **1-N** Fazenda ; Fazenda **N-M** Culturas por Safra              |
| Dashboard                                   | - Quantidade de fazendas  <br>- Hectares totais <br>- Gráficos de pizza     |

---

## ⚙️ Tecnologias & Boas Práticas
| Camada    | Tech Stack                                                                          |
|-----------|-------------------------------------------------------------------------------------|
| Frontend  | React 18, **Redux Toolkit**, RTK Query, Styled-Components, Vite, TypeScript, Jest   |
| Backend   | NestJS 10, TypeORM, PostgreSQL 15, class-validator, Swagger, Jest + Supertest    |
| Infra     | Docker / Docker-Compose, pnpm Workspaces, Husky + lint-staged    |
| Qualidade | ESLint, Prettier, Conventional Commits, SOLID, Clean Code, Arquitetura em camadas   |
| Observab. | Pino logger, Prometheus metrics (`/metrics`), Health-check (`/health`)              |

---

## 📂 Estrutura do Repositório
