# Projeto Synapse v3.0: Documentação Técnica

**Versão:** 1.0
**Última Atualização:** 23 de Setembro de 2025

## 1. Visão Geral e Princípios

O Synapse v3.0 é uma reescrita completa da plataforma, projetada com uma nova arquitetura de banco de dados e frontend para garantir escalabilidade, clareza organizacional e privacidade de dados. O sistema é construído sobre quatro pilares fundamentais que separam as responsabilidades e os contextos de dados.

- **Plataforma:** Next.js 14+ (App Router)
- **Banco de Dados:** Firestore (Google Cloud)
- **Estilização:** Tailwind CSS
- **Componentes UI:** ShadCN/UI

---

## 2. Arquitetura do Banco de Dados (Firestore)

A estrutura de dados é organizada em quatro pilares principais para garantir um modelo multi-tenant robusto e isolado.

### 2.1. 🪐 Pilar 1: O Ecossistema (system)
Gerencia a plataforma Synapse e seus clientes (tenants).

- **`/tenants/{propertyId}`**: Registra cada pousada que utiliza a plataforma.
  - `name`: `string`
  - `plan`: `"premium" | "basic"`
  - `status`: `"active" | "suspended"`
  - `ownerUid`: `string` (Firebase Auth UID)
  - `createdAt`: `timestamp`

- **`/platformAdmins/{adminUid}`**: Gerencia os administradores da plataforma Synapse.
  - `email`: `string`
  - `role`: `"superadmin" | "support"`

### 2.2. 🏡 Pilar 2: A Propriedade (properties)
O coração de cada pousada, contendo todas as suas configurações e dados operacionais.

- **`/properties/{propertyId}`**: Documento central que define uma pousada.
  - `profile`: `object` (Dados públicos, endereço, contato)
  - `customization`: `object` (Cores, fontes)
  - `settings`: `object` (Regras de negócio e módulos ativados)

- **Subcoleções de `/properties/{propertyId}/`**:
  - **`catalog/{itemId}`**: Inventário de itens que um hóspede pode solicitar (produtos, serviços).
  - **`resources/{resourceId}`**: Inventário de recursos que um hóspede pode agendar (jacuzzi, limpeza).
  - **`content/{contentId}`**: O CMS da pousada (guias, políticas, eventos).
  - **`cabins/{cabinId}`**: O inventário de acomodações.
  - **`staff/{staffMemberId}`**: Gerenciamento da equipe e suas permissões.
  - **`messageTemplates/{templateId}`**: Modelos de mensagens para comunicação.

### 2.3. 👤 Pilar 3: O Hóspede (guests)
O CRM da pousada, com o histórico e preferências de cada cliente.

- **`/properties/{propertyId}/guests/{guestCPF}`**: Armazena os dados de um hóspede. O ID é o CPF.
  - `identity`: `object` (Dados pessoais)
  - `history`: `object` (Histórico de estadias e gastos)
  - `notes`: `object` (Preferências, avisos)

### 2.4. 🛎️ Pilar 4: A Estadia (stays)
O container da experiência do hóspede, conectando um Hóspede a uma Propriedade por um período.

- **`/properties/{propertyId}/stays/{stayId}`**: O registro mestre de uma hospedagem.
  - `guestRef`: `reference` (Aponta para `/guests/{guestCPF}`)
  - `cabinRef`: `reference` (Aponta para `/cabins/{cabinId}`)
  - `checkIn`, `checkOut`: `timestamp`
  - `status`: `"active" | "upcoming" | "completed" | "cancelled"`

- **Subcoleções de `/properties/{propertyId}/stays/{stayId}/`**:
  - **`orders/{orderId}`**: Histórico de tudo que o hóspede pediu.
  - **`bookings/{bookingId}`**: Histórico de tudo que o hóspede agendou.
  - **`timeline/{eventId}`**: Linha do tempo de eventos importantes da estadia.
  - **`communications/{communicationId}`**: Registro de todas as mensagens enviadas.

---

## 3. Arquitetura do Frontend (Next.js)

### 3.1. Estrutura de Pastas

A estrutura de pastas espelha os pilares da arquitetura de dados, usando Route Groups para separar os contextos.

```plaintext
/
├── /app
│   ├── (plataforma)      # 🪐 Interface dos Admins da Synapse
│   ├── (propriedade)     # 🏡 Interface da Pousada (Dono/Staff)
│   ├── (hospede)         # 👤 Portal do Hóspede
│   ├── (auth)            # Telas de Login, Pré-Check-in, etc.
│   └── /api              # Rotas de API
│
├── /components
│   ├── /ui               # Componentes de UI genéricos (ShadCN)
│   ├── /plataforma       # Componentes do painel da plataforma
│   ├── /propriedade      # Componentes do painel da pousada
│   ├── /hospede          # Componentes do portal do hóspede
│   └── /shared           # Componentes compartilhados
│
├── /lib
│   ├── /firebase         # Configuração e helpers do Firebase
│   ├── /hooks            # Hooks React customizados
│   └── /utils.ts         # Funções utilitárias
│
├── /styles
└── /types
    └── index.ts          # Definições TypeScript (Fonte da Verdade dos Dados)
```

### 3.2. Tecnologias e Bibliotecas

- **Framework:** Next.js
- **Linguagem:** TypeScript
- **Banco de Dados:** Firebase SDK v9+ (modular)
- **UI:** React
- **Estilização:** Tailwind CSS
- **Componentes:** ShadCN/UI
- **Validação de Formulários:** Zod com React Hook Form (Recomendado)

---

## 4. Estratégia de Autenticação

- **4.1. Hóspede:** Acesso sem senha, via link mágico ou código único, utilizando o CPF do titular da reserva e o ID da estadia (`stayId`). A sessão é válida apenas para o contexto daquela estadia.

- **4.2. Staff da Propriedade:** Autenticação via E-mail e Senha (Firebase Auth). As permissões são definidas pelo campo `role` no documento do staff (`/properties/{propertyId}/staff/{staffMemberId}`).

- **4.3. Administrador da Plataforma:** Autenticação via E-mail e Senha (Firebase Auth). O acesso ao painel da plataforma é concedido apenas se o UID do usuário autenticado existir na coleção `/platformAdmins/{adminUid}`.

---

## 5. Configuração do Ambiente

### 5.1. Variáveis de Ambiente (`.env.local`)
Crie um arquivo `.env.local` na raiz do projeto seguindo o modelo abaixo.

```bash
# .env.example

# Firebase - Client Side (usado no navegador)
NEXT_PUBLIC_FIREBASE_API_KEY="xxx"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="xxx"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="xxx"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="xxx"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="xxx"
NEXT_PUBLIC_FIREBASE_APP_ID="xxx"

# Firebase - Server Side (usado nas API routes e Server Actions)
# Use a string JSON de uma linha ou base64
FIREBASE_SERVICE_ACCOUNT_JSON="xxx"

# Outras chaves de API (Ex: WhatsApp, E-mail, etc)
WHATSAPP_API_TOKEN="xxx"
```

---

## 6. Dados Iniciais para Desenvolvimento (Seed Data)

Para facilitar os testes e demonstrações, o sistema será inicializado com dois tenants pré-configurados.

### 6.1. Tenants Iniciais

- **Tenant 1 (Desenvolvimento):**
  - **ID:** `pousada-fazenda-digital`
  - **Nome:** Pousada Fazenda Digital
  - **Plano:** `premium`
  - **Status:** `active`

- **Tenant 2 (Demonstração):**
  - **ID:** `pousada-paraiso-das-aguas`
  - **Nome:** Pousada Paraíso das Águas
  - **Plano:** `premium`
  - **Status:** `active`

---

## 7. Tipos e Contratos de Dados

A fonte da verdade para todas as estruturas de dados utilizadas na aplicação é o arquivo `/types/index.ts`. Ele contém todas as interfaces TypeScript que mapeiam as coleções e documentos do Firestore. Manter este arquivo atualizado é crucial para a integridade do projeto.