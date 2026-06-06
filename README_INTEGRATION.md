# TechManager - Integração Backend & Frontend

Este projeto foi integrado para conectar o frontend React (TypeScript) com o backend Spring Boot (Java). Abaixo estão os detalhes da integração realizada.

## 🚀 Como Executar

### Backend (Spring Boot)
1. Certifique-se de ter o Java 17+ e Maven instalados.
2. Navegue até a raiz do projeto.
3. Execute o comando:
   ```bash
   mvn spring-boot:run
   ```
4. O servidor iniciará em `https://localhost:8443` (conforme configurado no `application.properties`).

### Frontend (React)
1. Navegue até a pasta `techmanager`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. O frontend estará disponível em `http://localhost:5173`.

## 🛠 Detalhes da Integração

### 1. Serviço de API Centralizado
Foi criado o arquivo `techmanager/src/services/api.ts` que centraliza todas as chamadas ao backend usando `fetch`. Ele gerencia:
- **Autenticação**: Inclusão automática do token Bearer no cabeçalho.
- **Tratamento de Erros**: Captura de status HTTP e mensagens de erro do backend.
- **Endpoints**: Mapeamento completo dos controladores de Clientes, Técnicos, Chamados e Backups.

### 2. Autenticação
- **Login**: Integrado com `/auth/login`. Salva o token JWT no `localStorage`.
- **Registro**: Integrado com `/auth/register`. Permite a criação de novas contas de clientes.

### 3. Gerenciamento Administrativo
- **Clientes**: Listagem via `/admin/customer/findAll` e remoção via `/admin/customer/delete/{id}`.
- **Técnicos**: Listagem via `/admin/technical/findAll`, criação via `/admin/technical/create` e remoção via `/admin/technical/delete/{id}`.

### 4. Chamados Técnicos (Tickets)
- **Abertura**: Integrado com `/ticket/create`.
- **Fluxo de Trabalho**: Implementada a lógica para Iniciar (`/ticket/start/{id}`) e Finalizar (`/ticket/finish/{id}`) chamados diretamente na tela de detalhes.
- **Listagem**: Todos os chamados são buscados dinamicamente via `/ticket/findAll`.

### 5. Backups
- **Manual**: Gatilho via `/api/backups/trigger`.
- **Restauração**: Integrado com `/api/backups/restore`.

## 📝 Notas de Desenvolvimento
- O frontend agora utiliza estados dinâmicos que são sincronizados com o backend ao carregar a aplicação.
- Adicionado um **Loader de Sincronização** global no `App.tsx` para melhorar a experiência do usuário durante as chamadas assíncronas.
- Os padrões de nomenclatura do backend (ex: `Customer`, `Technical`, `Ticket`) foram rigorosamente seguidos na camada de serviço do frontend.
