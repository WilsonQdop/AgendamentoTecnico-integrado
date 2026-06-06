# Mapeamento de Integração Frontend-Backend: AgendamentosTecnico

Este documento detalha o mapeamento entre os componentes do frontend (React/TypeScript) e os endpoints do backend (Spring Boot) do projeto AgendamentosTecnico. O objetivo é identificar as conexões necessárias e as adaptações nos modelos de dados para garantir a comunicação correta entre as duas camadas.

## 1. Autenticação

### Frontend: `Login.tsx` e `Register.tsx`

- **`Login.tsx`**: Já possui uma integração parcial com o endpoint de login do backend.
  - **Endpoint Consumido**: `POST /auth/login`
  - **Dados Enviados**: `email`, `password`
  - **Dados Recebidos**: `token`, `name`
  - **Observações**: O token e o nome do usuário são salvos no `localStorage`. É crucial que este `authToken` seja utilizado como `Bearer Token` em todas as requisições subsequentes aos endpoints protegidos.

- **`Register.tsx`**: Atualmente, a tela de registro é 100% local e não interage com o backend.
  - **Endpoint a Consumir**: `POST /auth/register`
  - **Dados a Enviar**: `name`, `email`, `phone`, `password`, `passwordConfirmed`
  - **Discrepâncias**: O frontend não coleta `phone` nem `passwordConfirmed`, e a validação de senha é mais fraca que a exigida pelo backend. Será necessário adaptar o formulário e a lógica de envio.

### Backend: `AuthController.java`

- **`POST /auth/login`**: Aceita `LoginRequestDTO` (`email`, `password`) e retorna `ResponseDTO` (`name`, `token`).
- **`POST /auth/register`**: Aceita `RegisterRequestDTO` (`name`, `email`, `phone`, `password`, `passwordConfirmed`) e retorna `ResponseDTO`.
- **Segurança**: Ambos os endpoints são públicos (`permitAll()`) conforme `SecurityFilterConfig.java`.

## 2. Gerenciamento de Clientes

### Frontend: `Clientes.tsx`

- **Funcionalidades Atuais**: Adição e remoção de clientes são operações locais.
- **Modelo de Dados Local (`Client`)**: `id`, `name`, `company`, `email`, `phone`, `active`.
- **Discrepâncias com Backend**: O backend não possui o campo `company` diretamente no `CustomerRequestDTO` ou `CustomerResponseDTO`. Os IDs são UUIDs no backend, não `CLI-*`.

### Backend: `AdminController.java` (para ADMIN)

- **Listar Clientes**: `GET /admin/customer/findAll`
  - **Retorno**: `Stream<CustomerResponseDTO>` (`name`, `email`, `phone`, `role`).
  - **Observações**: Não retorna `company` nem `active`. Será necessário adaptar o frontend para exibir apenas os dados disponíveis ou buscar a `company` de outra forma (se houver).

- **Criar Cliente**: Não há um endpoint `POST /admin/customer/create` explícito no `AdminController.java` para clientes. O registro de novos usuários (que podem ser clientes) é feito via `POST /auth/register`.
  - **Implicação**: A funcionalidade de 'Novo Cliente' no frontend deve ser mapeada para o registro de um novo usuário, possivelmente com uma role `CUSTOMER` padrão, ou o backend precisa de um endpoint administrativo para criar clientes.

- **Remover Cliente**: `DELETE /admin/customer/delete/{id}`
  - **Parâmetro**: `id` (UUID).
  - **Observações**: O frontend precisará enviar o UUID correto e não o ID local `CLI-*`.

- **Atualizar Cliente**: `PATCH /admin/customer/update/{id}`
  - **Parâmetros**: `id` (UUID), `CustomerRequestDTO` (`name`, `email`, `phone`, `password`).
  - **Observações**: O frontend precisará enviar o UUID e os dados atualizados. O campo `password` é obrigatório no DTO de request, o que pode ser um problema para atualizações parciais sem alteração de senha.

## 3. Gerenciamento de Técnicos

### Frontend: `Tecnicos.tsx`

- **Funcionalidades Atuais**: Adição e remoção de técnicos são operações locais.
- **Modelo de Dados Local (`Technician`)**: `id`, `name`, `email`, `phone`, `specialty`, `status`, `ticketsCount`.
- **Discrepâncias com Backend**: O backend exige `password` e `passwordConfirmed` para criação/atualização de técnicos. Não há campos diretos para `specialty`, `status` ou `ticketsCount` nos DTOs administrativos.

### Backend: `AdminController.java` (para ADMIN)

- **Listar Técnicos**: `GET /admin/technical/findAll`
  - **Retorno**: `Stream<TechnicalResponseDTO>` (`name`, `email`, `phone`, `role`).
  - **Observações**: Não retorna `id`, `specialty`, `status` ou `ticketsCount`. Será necessário adaptar o frontend para exibir apenas os dados disponíveis ou derivar `status`/`ticketsCount` de outros endpoints (ex: `TicketController`). A `specialty` pode ser um desafio.

- **Criar Técnico**: `POST /admin/technical/create`
  - **Dados Enviados**: `CreateTechnicalRequestDTO` (`name`, `email`, `phone`, `password`, `passwordConfirmed`).
  - **Observações**: O frontend precisará coletar e enviar a senha e a confirmação de senha, além de garantir que a senha atenda aos requisitos de segurança do backend.

- **Remover Técnico**: `DELETE /admin/technical/delete/{id}`
  - **Parâmetro**: `id` (UUID).
  - **Observações**: O frontend precisará enviar o UUID correto.

- **Atualizar Técnico**: `PATCH /admin/technical/update/{id}`
  - **Parâmetros**: `id` (UUID), `CreateTechnicalRequestDTO` (`name`, `email`, `phone`, `password`, `passwordConfirmed`).
  - **Observações**: Similar à criação, exige senha e confirmação. O frontend precisará de uma estratégia para lidar com a atualização de dados sem exigir a reentrada da senha, ou o backend precisará de um DTO de atualização parcial.

## 4. Gerenciamento de Chamados

### Frontend: `Chamados.tsx` e `DetalheChamado.tsx`

- **Funcionalidades Atuais**: Criação, listagem e detalhe de chamados são operações locais.
- **Modelo de Dados Local (`Ticket`)**: `id`, `title`, `priority`, `category`, `location`, `equipment`, `description`, `clientId`, `clientName`, `assignedTechnicianId`, `baseValue`, `finalValue`, `status`, `creationDate`, `slaEstimate`, `files`, `updates`.

### Backend: `TicketController.java`

- **Criar Chamado**: `POST /ticket/create`
  - **Dados Enviados**: `CreateTicketRequestDTO` (`title`, `description`, `category`, `priority`).
  - **Discrepâncias**: O frontend coleta `location`, `equipment`, `clientId`, `baseValue`, `files`, que não estão no DTO de criação do backend. A `category` e `priority` do frontend são strings em português, enquanto o backend usa enums em inglês (`CategoryEnum`, `PriorityEnum`).

- **Listar Chamados (Todos)**: `GET /ticket/findAll` (Roles: TECHNICAL, ADMIN)
  - **Retorno**: `Stream<TicketSummaryResponseDTO>` (`id`, `title`, `category`, `priority`, `status`, `value`, `paymentConfirmed`, `createdAt`, `customerName`, `technicalName`).
  - **Discrepâncias**: O frontend exibe `clientName`, `assignedTechnicianId`, `finalValue`, `creationDate`, `slaEstimate`. O backend retorna `customerName`, `technicalName`, `value`, `createdAt`. Será necessário mapear e adaptar.

- **Listar Meus Chamados**: `GET /ticket/findMyTickets` (Roles: TECHNICAL, CUSTOMER)
  - **Retorno**: `Stream<TicketSummaryResponseDTO>`.

- **Detalhes do Chamado**: `GET /ticket/ticketDetails/{ticketId}` (Roles: TECHNICAL, CUSTOMER)
  - **Retorno**: `TicketDetailsResponseDTO` (`title`, `description`, `category`, `priority`, `status`, `baseHourlyRate`, `value`, `paymentConfirmed`, `createdAt`, `customerName`, `technicalName`).
  - **Discrepâncias**: O frontend espera `id`, `location`, `equipment`, `files`, `updates`, `slaEstimate`, que não estão neste DTO. O `baseHourlyRate` é novo. A timeline de `updates` e os arquivos (`files`) precisarão de endpoints separados ou adaptação.

- **Finalizar Chamado**: `PUT /ticket/finish/{ticketId}` (Role: TECHNICAL)
- **Iniciar Chamado**: `PUT /ticket/start/{ticketId}` (Role: TECHNICAL)
- **Pagamento do Cliente**: `PUT /ticket/payment/{ticketId}` (Role: CUSTOMER)

## 5. Gerenciamento de Backups

### Frontend: `Backup.tsx`

- **Funcionalidades Atuais**: Trigger manual de backup e histórico são locais.
- **Modelo de Dados Local (`BackupHistory`)**: `id`, `type`, `size`, `status`, `date`.

### Backend: `BackupController.java`

- **Trigger Manual**: `POST /api/backups/trigger`
  - **Retorno**: `Map<String, String>` (`message`).

- **Agendar Backup**: `POST /api/backups/schedule` (Role: ADMIN)
  - **Dados Enviados**: `ScheduleBackupRequest`.
  - **Retorno**: `ScheduleBackupResponse`.

- **Cancelar Agendamento**: `DELETE /api/backups/schedule/cancel` (Role: ADMIN)
  - **Retorno**: `ScheduleBackupResponse`.

- **Restaurar Backup**: `POST /api/backups/restore?arquivo={fileName}`
  - **Parâmetro**: `fileName`.
  - **Retorno**: `Map<String, String>` (`message`).

## Próximos Passos

Com base neste mapeamento, a próxima fase envolverá a modificação dos componentes do frontend para:

1.  Utilizar o `authToken` do `localStorage` em todas as requisições autenticadas.
2.  Adaptar os formulários de criação/atualização para enviar os dados no formato esperado pelo backend.
3.  Ajustar a exibição das listas e detalhes para consumir os dados retornados pelos DTOs do backend.
4.  Implementar as chamadas HTTP (`fetch` ou `axios`) para cada endpoint mapeado.
5.  Tratar as discrepâncias de dados (ex: `company`, `specialty`, `files`, `updates`) seja adaptando o frontend, solicitando ajustes no backend ou buscando soluções alternativas.
