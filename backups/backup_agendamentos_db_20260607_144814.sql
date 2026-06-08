--
-- PostgreSQL database dump
--

\restrict 7mtgOOmxQGjpbbFwcUvrST8X7JZ8DHSHEATRnuaL51qHJtFUkedLF6JqQKyFFK2

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.admin DROP CONSTRAINT IF EXISTS fksplda61kmlib6vk6qmwfv08dh;
ALTER TABLE IF EXISTS ONLY public.customer DROP CONSTRAINT IF EXISTS fkr9okrktxscw3omxi1wm7cg18u;
ALTER TABLE IF EXISTS ONLY public.ticket DROP CONSTRAINT IF EXISTS fkqje208cfaqxp1x61heksb01cl;
ALTER TABLE IF EXISTS ONLY public.ticket_history DROP CONSTRAINT IF EXISTS fkn172ccrihn09prjnpoyxabcgw;
ALTER TABLE IF EXISTS ONLY public.ticket DROP CONSTRAINT IF EXISTS fkmli0eqrecnnqvdgv3kcx7d9m8;
ALTER TABLE IF EXISTS ONLY public.password_history DROP CONSTRAINT IF EXISTS fk76ijovg2315k1fm4otyr3hmah;
ALTER TABLE IF EXISTS ONLY public.technical DROP CONSTRAINT IF EXISTS fk4vx29lwe09i019ehuw1gusvrc;
ALTER TABLE IF EXISTS ONLY public.ticket DROP CONSTRAINT IF EXISTS ticket_pkey;
ALTER TABLE IF EXISTS ONLY public.ticket_history DROP CONSTRAINT IF EXISTS ticket_history_pkey;
ALTER TABLE IF EXISTS ONLY public.technical DROP CONSTRAINT IF EXISTS technical_pkey;
ALTER TABLE IF EXISTS ONLY public.person DROP CONSTRAINT IF EXISTS person_pkey;
ALTER TABLE IF EXISTS ONLY public.person DROP CONSTRAINT IF EXISTS person_email_key;
ALTER TABLE IF EXISTS ONLY public.password_history DROP CONSTRAINT IF EXISTS password_history_pkey;
ALTER TABLE IF EXISTS ONLY public.customer DROP CONSTRAINT IF EXISTS customer_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_log DROP CONSTRAINT IF EXISTS audit_log_pkey;
ALTER TABLE IF EXISTS ONLY public.admin DROP CONSTRAINT IF EXISTS admin_pkey;
DROP TABLE IF EXISTS public.ticket_history;
DROP TABLE IF EXISTS public.ticket;
DROP TABLE IF EXISTS public.technical;
DROP TABLE IF EXISTS public.person;
DROP TABLE IF EXISTS public.password_history;
DROP TABLE IF EXISTS public.customer;
DROP TABLE IF EXISTS public.audit_log;
DROP TABLE IF EXISTS public.admin;
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: Qdop
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "Qdop";

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: Qdop
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: Qdop
--

CREATE TABLE public.admin (
    id uuid NOT NULL
);


ALTER TABLE public.admin OWNER TO "Qdop";

--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: Qdop
--

CREATE TABLE public.audit_log (
    created_at timestamp(6) without time zone NOT NULL,
    id uuid NOT NULL,
    action character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    target character varying(255),
    CONSTRAINT audit_log_action_check CHECK (((action)::text = ANY (ARRAY[('USER_CREATED'::character varying)::text, ('USER_UPDATED'::character varying)::text, ('USER_DELETED'::character varying)::text, ('LOGIN_SUCCESS'::character varying)::text, ('LOGIN_FAILED'::character varying)::text, ('LOGIN_BLOCKED'::character varying)::text, ('TICKET_CREATED'::character varying)::text, ('TICKET_CANCELED'::character varying)::text, ('TICKET_ASSIGNED'::character varying)::text, ('TICKET_STARTED'::character varying)::text, ('TICKET_FINISHED'::character varying)::text, ('TICKET_PAYMENT'::character varying)::text, ('TICKET_VIEWED'::character varying)::text, ('TICKET_FINISHED_PAYMENT_CANCELED'::character varying)::text, ('HISTORY_UPDATED'::character varying)::text])))
);


ALTER TABLE public.audit_log OWNER TO "Qdop";

--
-- Name: customer; Type: TABLE; Schema: public; Owner: Qdop
--

CREATE TABLE public.customer (
    id uuid NOT NULL
);


ALTER TABLE public.customer OWNER TO "Qdop";

--
-- Name: password_history; Type: TABLE; Schema: public; Owner: Qdop
--

CREATE TABLE public.password_history (
    created_at timestamp(6) without time zone NOT NULL,
    id uuid NOT NULL,
    person_id uuid NOT NULL,
    hashed_password character varying(255) NOT NULL
);


ALTER TABLE public.password_history OWNER TO "Qdop";

--
-- Name: person; Type: TABLE; Schema: public; Owner: Qdop
--

CREATE TABLE public.person (
    failed_login_attempts integer NOT NULL,
    created_at timestamp(6) without time zone,
    locked_until timestamp(6) without time zone,
    id uuid NOT NULL,
    email character varying(255),
    name character varying(255),
    password character varying(255),
    phone character varying(255),
    role character varying(255),
    CONSTRAINT person_role_check CHECK (((role)::text = ANY (ARRAY[('ADMIN'::character varying)::text, ('TECHNICAL'::character varying)::text, ('CUSTOMER'::character varying)::text])))
);


ALTER TABLE public.person OWNER TO "Qdop";

--
-- Name: technical; Type: TABLE; Schema: public; Owner: Qdop
--

CREATE TABLE public.technical (
    id uuid NOT NULL
);


ALTER TABLE public.technical OWNER TO "Qdop";

--
-- Name: ticket; Type: TABLE; Schema: public; Owner: Qdop
--

CREATE TABLE public.ticket (
    base_hourly_rate numeric(38,2),
    payment_confirmed boolean NOT NULL,
    value numeric(38,2),
    created_at timestamp(6) without time zone,
    finished_at timestamp(6) without time zone,
    started_at timestamp(6) without time zone,
    customer_id uuid,
    id uuid NOT NULL,
    technical_id uuid,
    category character varying(255),
    description character varying(255),
    priority character varying(255),
    status character varying(255),
    title character varying(255),
    CONSTRAINT ticket_category_check CHECK (((category)::text = ANY (ARRAY[('HARDWARE'::character varying)::text, ('SOFTWARE'::character varying)::text, ('NETWORK'::character varying)::text]))),
    CONSTRAINT ticket_priority_check CHECK (((priority)::text = ANY (ARRAY[('LOW'::character varying)::text, ('MEDIUM'::character varying)::text, ('HIGH'::character varying)::text]))),
    CONSTRAINT ticket_status_check CHECK (((status)::text = ANY (ARRAY[('OPEN'::character varying)::text, ('COMPLETED'::character varying)::text, ('CANCELED'::character varying)::text, ('ASSIGNED'::character varying)::text, ('PAYMENT_PENDING'::character varying)::text, ('IN_PROGRESS'::character varying)::text])))
);


ALTER TABLE public.ticket OWNER TO "Qdop";

--
-- Name: ticket_history; Type: TABLE; Schema: public; Owner: Qdop
--

CREATE TABLE public.ticket_history (
    change_date timestamp(6) without time zone,
    id uuid NOT NULL,
    ticket_id uuid,
    comment character varying(255),
    new_status character varying(255),
    old_status character varying(255),
    update_by character varying(255),
    CONSTRAINT ticket_history_new_status_check CHECK (((new_status)::text = ANY (ARRAY[('OPEN'::character varying)::text, ('COMPLETED'::character varying)::text, ('CANCELED'::character varying)::text, ('ASSIGNED'::character varying)::text, ('PAYMENT_PENDING'::character varying)::text, ('IN_PROGRESS'::character varying)::text]))),
    CONSTRAINT ticket_history_old_status_check CHECK (((old_status)::text = ANY (ARRAY[('OPEN'::character varying)::text, ('COMPLETED'::character varying)::text, ('CANCELED'::character varying)::text, ('ASSIGNED'::character varying)::text, ('PAYMENT_PENDING'::character varying)::text, ('IN_PROGRESS'::character varying)::text])))
);


ALTER TABLE public.ticket_history OWNER TO "Qdop";

--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.admin (id) FROM stdin;
6aebcc9d-aa45-4558-9c86-43c660ca886a
\.


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.audit_log (created_at, id, action, description, target) FROM stdin;
2026-06-07 01:51:40.549515	ec1b22f3-6bc3-4849-9545-30784ff01ed7	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-07 01:51:58.213696	1d6eaf7c-8ca1-42dd-8015-3ed7ff22391e	USER_CREATED	Técnico com o email 'wilson.tech@gmail.com' foi criado com sucesso pelo Admin	wilson.tech@gmail.com
2026-06-07 01:52:29.290493	3be1dc0a-c514-4faa-9c8c-5c439797579d	USER_CREATED	Usuário com o email 'fedendo@gmail.com' foi criado com sucesso	fedendo@gmail.com
2026-06-07 01:52:45.445391	5c9d0bc7-73ab-47a5-a9b9-2d42e483577c	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-07 01:52:52.626957	57887da9-818e-4fe9-a1e1-6522ea2cdaaa	TICKET_CREATED	Chamado criado: 'awwawa' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-07 01:53:00.688498	a3c59942-169c-4bc5-8ff6-12c2d20b6d4b	TICKET_ASSIGNED	Técnico 'wilson' assumiu o chamado 'awwawa' do cliente 'Fedendo'	wilson
2026-06-07 01:53:03.194651	a53dfe8c-4c96-4348-8918-763172225ba6	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 01:53:05.768555	4c90daf8-9027-45cb-86ee-d8bdbd832f73	TICKET_STARTED	Atendimento iniciado para o chamado 'awwawa'	wilson
2026-06-07 01:53:12.279123	db12f6a6-5223-430a-873e-0aa04d17a694	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 01:53:14.532922	121c3d14-43d2-4070-bd7f-e1077e2d2b58	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	80a26c21-594b-4066-b147-860d017c1167
2026-06-07 01:53:14.568038	ffbe5248-3891-4e07-af3b-063f254ec270	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:14:43.340152	f604325b-ba3a-4c17-9a0b-22bf35054361	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:14:53.485433	c056d51f-ab53-4efa-b8f0-cc941be67b49	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:14:57.030685	628e0d1d-2cf2-4004-8a34-31d59f354b6d	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	80a26c21-594b-4066-b147-860d017c1167
2026-06-07 02:14:57.058467	d28a071d-958f-4ba9-95dd-6564b0a650c5	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:17:31.676754	fda974f2-6c34-44c3-85a1-239af2d333c6	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:17:33.730193	571d2d60-6d23-4a73-9a8b-de02763bbb50	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	80a26c21-594b-4066-b147-860d017c1167
2026-06-07 02:17:33.755911	5ced75c2-99ad-4a2e-a4d5-905740bf45a7	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:17:41.674631	4be8d109-7938-4dd1-a4df-0d8c2a8b314c	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:17:45.520427	caedde09-44e6-4c68-b749-32498b1b2393	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	80a26c21-594b-4066-b147-860d017c1167
2026-06-07 02:17:45.547941	ddfd9262-08dc-4c96-be59-a46c4b5fc712	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:17:51.481915	bbf2b321-e109-457f-9f6d-fc3e4969b786	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:17:58.987626	dcef75d2-9014-4e51-9bf4-0b0b92a38bfa	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:19:50.057616	56c9f4e4-35d1-446d-b232-c9228ce4649d	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:19:50.601072	af6e7fc1-4bad-46bf-aacd-6e762207e783	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:19:50.6849	4fa21855-26c9-4b07-9e80-c21a70d4939a	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:19:58.291574	71559326-2337-412e-9aee-48fdebf187e8	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:19:58.351184	51385060-2c06-460c-9a26-16883446ac4e	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:19:58.430756	f92af7ec-7d9c-4509-8a16-73c7869b3521	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:20:05.501331	8a382814-3905-48c3-917c-32d78fe673eb	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	80a26c21-594b-4066-b147-860d017c1167
2026-06-07 02:20:05.535541	8635cb9c-934b-46a4-8b8d-452cf59faa12	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:27:17.361818	fdc5cf14-d9d2-4c77-97ac-ddd50fa3a52b	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:27:24.866427	d10186b9-4654-4485-a408-4cc04fc22b66	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:29:09.080534	e7272e3e-2187-4326-a410-c9fd32d638ca	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:31:10.866739	b8625ca7-ffaa-4f78-8447-6a44d1e94b7f	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:31:13.054941	917d684c-a8b2-4a4a-ba55-18edcda282d1	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	80a26c21-594b-4066-b147-860d017c1167
2026-06-07 02:31:13.07838	14c82409-8add-4faa-8184-64b17c1d2bbd	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:31:21.092334	bd701c55-5dd1-43f7-a86d-06e7cc476f94	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:31:30.617491	53966c8f-765e-4ab9-b172-6e3ce27ccd6f	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:31:30.66576	1e9b8f3f-7ab7-487f-a8bc-d0fe656bd563	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:31:30.68695	01cde625-71e7-4fdf-98cb-a99990966ddb	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:34:51.379782	c4c18b51-43f6-4a4f-99c4-465ab6d12e57	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:34:59.681581	f618490c-9ff5-477c-bfaf-7910ff23fd29	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:34:59.878662	39ec6f92-b85f-4cef-bcfd-c44a8353f3e7	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:34:59.946736	d6e9048f-5f4c-4b93-a323-4b572dde4b6e	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:35:06.784022	06dd4bbd-0872-4687-b190-6a396157fd45	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	80a26c21-594b-4066-b147-860d017c1167
2026-06-07 02:35:06.806212	24a29d86-9875-4f40-b627-db7f10414e62	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:35:08.256924	2fe1a04d-6057-4d02-b257-ef43a27deee4	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	80a26c21-594b-4066-b147-860d017c1167
2026-06-07 02:35:08.279267	68300c66-f3da-4d05-aac6-6b5b5e5aa888	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:35:59.066944	81ad08bf-565c-4191-aa35-c04870d77b2c	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:35:59.118812	158f8106-ea67-4482-9eb5-f2e6a0015ed9	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:35:59.140327	4c9bc861-7c9f-4fd3-a60d-4f95d384cc49	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:36:09.681191	f600c214-e5be-4230-aa5c-f06d8c81ebae	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	80a26c21-594b-4066-b147-860d017c1167
2026-06-07 02:36:09.710268	0cf40393-8b58-44bd-ba63-0850e8afe70b	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:36:15.061614	4e7fb21e-51ff-4511-8e29-ec0855bb7dcd	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	80a26c21-594b-4066-b147-860d017c1167
2026-06-07 02:36:15.087329	5b6c667a-709c-4857-b5b6-4455e0d43fd6	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 02:37:30.053479	2f4acf13-a108-4fa3-966a-e4ca50167c41	TICKET_CREATED	Chamado criado: 'sw' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-07 02:37:38.767605	a81c1ffc-b875-455f-ab16-f24fc66dcb6a	TICKET_ASSIGNED	Técnico 'wilson' assumiu o chamado 'sw' do cliente 'Fedendo'	wilson
2026-06-07 02:37:42.126901	53dae3ac-3bd9-4afb-bd57-2a89923bdf4d	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 02:37:42.158824	5dbc7c29-ab56-4f5f-baa1-f7b9f0323f79	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 02:37:42.177946	984012e7-4e7d-4949-92b8-42cfd93fc3c2	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 02:37:43.270258	7e0cd603-7bd2-443a-8252-74cb220374c1	TICKET_STARTED	Atendimento iniciado para o chamado 'sw'	wilson
2026-06-07 02:39:42.280268	edfb4889-e508-4520-a45f-019efff38a98	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:39:42.951982	c821db4b-3516-4071-acd3-c1d4df810d1d	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:39:43.042218	2ad7cddb-b1d3-4dd4-8f60-03c5eb7bde65	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:47:58.359603	3011071d-15e1-4b7a-9f6d-615379537ee0	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 02:47:58.396706	85d39058-65e4-4bea-b85d-c7de2e937e4e	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:56:13.457551	e9c0cd6c-2596-4b4e-827f-07dda0d6d428	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:56:13.792919	17bc68e7-7b34-4597-85ed-3247c2e049d0	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:56:13.868034	ef45ceec-f94e-4a2e-a154-848097391c1e	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 02:56:23.032148	095ffd2c-2746-454d-bc3d-0f3889e6e4f9	TICKET_CREATED	Chamado criado: 'dwadwa' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-07 02:56:30.511182	274f26f1-1bc2-4b3d-a8d5-bebf3387fa0f	TICKET_ASSIGNED	Técnico 'wilson' assumiu o chamado 'dwadwa' do cliente 'Fedendo'	wilson
2026-06-07 02:56:33.012567	974704f7-d328-4098-a9ad-888b49cdc9bf	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:33.24858	0ca2d78c-a8b7-42c5-bf0b-583956051a07	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:33.272304	0d74aaa6-060a-42a5-ae04-20fd3a902ea3	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:34.720457	19f9957a-9aef-437d-8963-098889da27f6	TICKET_STARTED	Atendimento iniciado para o chamado 'dwadwa'	wilson
2026-06-07 02:56:39.158086	0b93617e-ab3d-4192-a650-ce6e9715c3b2	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:39.683178	5a542752-55b6-4c12-b6d2-7b2ad8ca9f02	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:39.705255	64be21c8-f021-4136-a038-ed5d09a5bfa0	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:42.373949	615414f0-21a5-4ddc-9478-534a8b79f510	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	99d154f0-0fa4-4f42-af26-575db64d7b0d
2026-06-07 02:56:42.395897	fed90bd3-16df-4744-857d-b964e5062530	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:47.67553	e0d9b4b3-ea21-4445-a441-bcccaee43289	TICKET_CANCELED	Atendimento foi cancelado para o chamado 'dwadwa'	wilson
2026-06-07 02:56:52.453231	c0e0faeb-2bfc-4175-8755-4fcbc7b954dd	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:52.497323	2104fe52-9216-4350-a0a5-654e96535701	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:52.520588	e563d78d-d4d3-44a3-a7eb-2f06215cb888	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:54.490051	fbcc764c-b4da-4002-9c7e-64bc60aa7025	TICKET_FINISHED	Chamado 'dwadwa' finalizado. Valor calculado: R$ 180.0000	wilson
2026-06-07 02:56:58.458214	9ca6e0ae-acb0-45f4-bbb7-1224f770b362	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:58.553612	76f77619-1f75-4c6f-8f12-2efe100c5be0	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:56:58.574372	e489480a-1938-4054-9737-96e169f85a24	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:57:03.986408	d75346b9-60df-4fa4-8af4-bc6d12e1c8f2	TICKET_STARTED	Atendimento iniciado para o chamado 'dwadwa'	wilson
2026-06-07 02:57:15.339364	f6638708-65ac-4497-acb4-e361d6eeb134	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:57:15.386292	dd470d1c-197c-4d93-831a-504ce99108f8	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:57:15.408789	e4a024c6-2d12-4cad-8da8-d390f14fce39	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 02:57:19.816122	3710a122-56ac-4238-b6c8-49d1efdcb5e2	TICKET_FINISHED	Chamado 'dwadwa' finalizado. Valor calculado: R$ 180.0000	wilson
2026-06-07 02:57:26.233898	e5a39ea5-0832-44fb-bde6-d98d08134805	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 02:57:26.667399	773ef6fc-ba3e-4bcf-89c2-a696d721e476	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 02:57:26.689598	211d7080-3a7f-4607-b811-51ce8622d7b3	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:03:28.586747	42d01bc1-190f-43d2-afeb-b0d41b0242e3	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:03:28.677615	3b073d0c-9eaf-45b4-b35c-721e8c979939	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:03:28.699276	130c2795-cbfa-43ba-a28f-2e1a44a007df	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:09:29.681014	a8afda08-9609-475f-a15e-7bdf9c3a3b6b	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:09:29.735705	a86154f5-c438-47d3-b6b0-0db1b8ac0ff1	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:09:29.758047	29cab974-9627-48fa-b1a4-f06c1cf4efbc	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:17:59.663527	761a6413-2f38-4cba-b604-abc9ddb0e0e5	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 03:17:59.774762	d87836c4-ad41-4795-9370-6262792f9861	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 03:17:59.803329	07422e4d-ba24-48bd-85bc-d77f0898b1be	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 03:18:08.165649	ee3f8234-dbe6-4cc6-afbd-70b27502da2a	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:18:08.21563	0e7446cd-b571-4a33-90d0-7d5e82fa7e55	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:18:08.242861	2e659f92-062b-4cde-bbc5-80b4b36cebc8	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:18:34.140664	70415414-ea76-4d27-a0ff-6248dd9e5d39	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:18:34.525966	a05a6b29-427a-419b-b0a4-155b34622c4e	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:18:34.551735	5f97d65b-ea48-4d36-8eee-9926222a5493	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:22:04.894072	3067b6a9-572a-4dfb-90c9-8aef6ef6ca93	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:22:04.980347	4762e574-70a0-4edf-95e5-b831644389da	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:22:05.00444	744612a5-0b02-40cd-85ac-897e08e26ffa	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:22:37.007852	cbf3e75e-7a51-4557-814d-a63be7f4495e	TICKET_PAYMENT	Pagamento de R$ 180 confirmado para o chamado 'dwadwa'	Fedendo
2026-06-07 03:22:51.824839	2ae0ac13-4f89-42d6-8c3c-5d54851363ab	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:22:51.914836	7997b0c6-8162-4ca5-aa76-70c2673a3919	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:22:52.002005	f23fff38-07f0-48a1-bef1-194220c9b351	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:23:06.938455	1a3aea7f-04c1-4acd-a3af-a66d30f49112	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 03:23:07.040921	98b9f5af-f77c-43cd-9485-a9c1337a97c2	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 03:23:07.064552	af65b8aa-8b07-4e22-8a87-32758023eefb	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 03:23:16.979131	bb037ad6-10fe-4ce7-b677-350135565517	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 03:23:17.031718	10d9f9cf-049f-4ab5-9910-8fd3837224ce	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 03:23:17.052689	9c050bcc-89cf-446a-a38a-8ee9fd618387	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 03:23:24.067699	15dab72a-9321-489a-a24b-698c5544d05e	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	423cdf27-b331-46bf-af4c-dcb13995c3d6
2026-06-07 03:23:24.093036	f21aca2a-6b7b-45ce-99fc-f5b34cd6be4d	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 03:23:25.956714	2da989d7-cd89-45be-ac69-130a0e2084d5	TICKET_FINISHED	Chamado 'sw' finalizado. Valor calculado: R$ 180.0000	wilson
2026-06-07 03:23:36.841036	5d0f8822-6d6b-46e7-bbf8-0f719e6a71e6	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por Fedendo	Fedendo
2026-06-07 03:23:37.573921	f753899d-5416-4af4-a263-7beff9665cfe	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por Fedendo	Fedendo
2026-06-07 03:23:37.657534	26bd7ecf-e75f-4998-8923-ee96099bfaa8	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por Fedendo	Fedendo
2026-06-07 03:29:10.897548	58dec70d-c0e9-4382-bae3-b8ade0113bc7	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por Fedendo	Fedendo
2026-06-07 03:29:11.117919	5baa5145-46ac-4e4b-8f7a-3e47a8f0e109	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por Fedendo	Fedendo
2026-06-07 03:29:11.138773	670a100c-e287-42f0-b032-e0c7ee942fc2	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por Fedendo	Fedendo
2026-06-07 03:29:17.88573	769dcd78-0db5-4520-9a94-e7b2d3e119b6	TICKET_PAYMENT	Pagamento de R$ 180 confirmado para o chamado 'sw'	Fedendo
2026-06-07 03:32:17.355069	e7f7e6b8-01cf-4e21-8b8e-6aa3d4099428	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: wilson	wilson.tech@gmail.com
2026-06-07 03:32:27.698612	8907cd2a-2418-4260-a867-7726a9764123	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 03:32:27.743188	21cf08ff-cede-492e-b26c-2d969c761e78	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 03:32:27.764899	c0a342fc-0727-4927-b438-7c16623a2532	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 03:32:31.474612	797e02eb-0e9c-4724-86cd-11fc63d0b9bc	TICKET_FINISHED	Chamado 'awwawa' finalizado. Valor calculado: R$ 180.0000	wilson
2026-06-07 03:32:31.497484	8d32be6e-be37-4567-b289-34606b83f53d	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 03:32:41.08257	03f0a874-6757-4934-94a3-fd83edcea195	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 03:32:41.130167	ab2e8f2c-46e3-4d87-8411-3a1c2dc1d4e5	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 03:32:41.151389	66d1e526-d8a4-428b-bbfd-d638eff5aaa2	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 03:32:47.38036	f261eed4-84c1-406d-b656-b4b3883c68ea	TICKET_PAYMENT	Pagamento de R$ 180 confirmado para o chamado 'awwawa'	Fedendo
2026-06-07 03:32:47.40136	52ebbda6-bbf3-462f-acd9-09814a08ecf0	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por Fedendo	Fedendo
2026-06-07 03:33:01.304907	f86cf8ce-5b7c-4697-9cc7-1d408bd97c94	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 03:33:01.332821	762bc193-4193-4a40-9ef3-f9631928999c	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 03:33:01.353795	4577c722-5f03-46c6-9d80-e2732a2f4cef	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 03:33:03.75175	50f32346-77b9-44b3-a466-65cd9874c077	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 03:33:03.784625	0b42be9b-ac51-428b-b940-f261645aa681	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 03:33:03.804123	1ee09bba-a1bc-44f5-9a95-086986158d82	TICKET_VIEWED	Detalhes do chamado 'sw' visualizados por wilson	wilson
2026-06-07 03:33:05.992115	f26c2d48-3f13-46d4-84ce-8df2542f167f	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 03:33:06.018254	547bf3dd-a468-49f3-9e9f-32097b62ee0b	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 03:33:06.039719	9aaca198-68bc-4c4c-a12b-54a02bcfc8c5	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 03:33:15.858097	df1b1d99-e3a2-4cd9-bb34-aedb9179b42b	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:33:15.888477	97dd21ee-e889-49a7-9fbc-9b90f72628b9	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:33:15.908648	5c26897f-ddad-4719-9802-7c4e0bfcb18c	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por Fedendo	Fedendo
2026-06-07 03:33:33.658097	8d803904-bb22-43e3-97ae-9f076b5ee0dd	TICKET_CREATED	Chamado criado: 'OIOI' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-07 03:33:41.778451	1b5db877-6afa-481b-a070-3968a3b644f0	TICKET_CREATED	Chamado criado: 'aaaaaaaaaaaaaaa' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-07 03:33:49.28852	1cf1963e-87c5-416b-9f58-acbc708841ce	TICKET_ASSIGNED	Técnico 'wilson' assumiu o chamado 'aaaaaaaaaaaaaaa' do cliente 'Fedendo'	wilson
2026-06-07 03:34:06.725235	74f25530-0d11-4b78-957c-93558f5ac3be	LOGIN_FAILED	Senha incorreta para o usuário: WilsonAdmin | Tentativa 1 de 5 | Data/hora: 2026-06-07T03:34:06.724235800	admin@wilson.com
2026-06-07 03:34:10.082946	71548425-10bf-4f8a-b770-e2946cc7205b	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-07 03:35:46.169445	a5932be6-43a4-43cb-879e-de184739b674	USER_CREATED	Técnico com o email 'vicente.tech@gmail.com' foi criado com sucesso pelo Admin	vicente.tech@gmail.com
2026-06-07 03:35:57.121614	e25833c1-5906-4001-9565-b2ea28e78b35	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Vicente	vicente.tech@gmail.com
2026-06-07 03:36:10.156775	c205a713-d8d2-4ef7-92b1-950eefeaad04	TICKET_ASSIGNED	Técnico 'Vicente' assumiu o chamado 'OIOI' do cliente 'Fedendo'	Vicente
2026-06-07 03:36:15.867072	332b93ad-5083-4561-825d-20d2fa554006	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:36:16.072927	bca2fc12-23f0-4ae9-bed1-c8bfc1e43dff	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:36:16.098679	773867c5-e733-4e71-a939-b7a42989d7fb	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:39:59.63451	5fd2c26b-b31b-4ffa-b4d7-8f8fd7384b5b	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:39:59.670438	2d02b3b9-0d8a-449d-bf71-2c07615ed7d6	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:39:59.690845	d6661526-53c9-43e3-ba36-28e32b701bc1	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:05.751986	c367b9ee-bfe2-4512-9af7-841ecf9ebec2	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:05.779216	c1b069bf-89df-4f65-a7fa-b7d40846a1dd	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:05.798147	99f6939d-3d9f-4187-914a-1af63d9765a6	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:06.671017	d465425e-4959-4fa8-bd7a-8171cbbec886	TICKET_STARTED	Atendimento iniciado para o chamado 'aaaaaaaaaaaaaaa'	wilson
2026-06-07 03:40:06.691275	b29742ba-79c9-4e81-813c-4c4fbb564662	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:10.001638	9e335213-9f9b-4f17-8bb0-8444ac4d5c8a	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:10.031952	161f7b31-2f17-4496-b345-c77e261437c8	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:10.054823	5990e331-ca8f-434e-84e7-842ea81e5e46	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:14.923961	069c0ab9-49f3-4793-9f60-1b0f7cb46a48	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965
2026-06-07 03:40:14.946551	b9bb638e-42d3-4925-bbfb-75e6670732d5	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:19.052197	4585cacf-4f80-4f06-968f-be4142a80b63	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965
2026-06-07 03:40:19.071154	efad5566-fe1c-47dc-bafe-556c19853d4b	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:21.086011	aef958a3-7ba6-48c8-82f1-955eccfbfa92	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965
2026-06-07 03:40:21.106675	81a643ef-c3a7-4b69-8bb2-63651a22879f	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:22.109794	7d8b2821-e14c-40ab-9115-1807281f5986	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965
2026-06-07 03:40:22.12762	de6ad800-f8a6-4bf7-a993-28aa49cc9d0e	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:23.209503	b7d74f19-fe03-4fa2-b51a-a2dda86f5ced	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965
2026-06-07 03:40:23.22793	1615cc9b-b86f-4cfc-b236-cdd4fc3f04fc	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:24.33948	bfbf8532-22e6-45cb-b948-96793ef18684	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965
2026-06-07 03:40:24.357766	b9e55efc-357f-45bb-8595-4de458949c29	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:25.578789	048c89e9-faa8-49d8-86c5-b1b9a92f7bf2	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965
2026-06-07 03:40:25.598979	c97d9bca-a7a8-4b8a-9ac3-7e787881ae75	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:27.410085	93d0f909-a18d-4e76-b6ff-adaec94789ac	TICKET_CANCELED	Atendimento foi cancelado para o chamado 'aaaaaaaaaaaaaaa'	wilson
2026-06-07 03:40:27.429958	c147f26d-7ba5-417f-85d2-550d6e14e5a8	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:31.3292	9a1e2dec-f9b7-4ac7-b092-6f5027846737	TICKET_FINISHED	Chamado 'aaaaaaaaaaaaaaa' finalizado. Valor calculado: R$ 180.0000	wilson
2026-06-07 03:40:31.34876	7ac29891-d9cf-42fc-b507-1d3715cdbfd0	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 03:40:46.664707	30c9d896-c050-4e75-93bd-efeab6516863	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:40:46.694158	0ddf0473-74d1-4f8e-8174-8c15c15be6c6	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:40:46.711896	4ca56777-b29f-482f-b780-f0e35f379db3	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:40:47.973575	3a30f87a-1775-4fe4-822d-fb64b6d565b5	TICKET_STARTED	Atendimento iniciado para o chamado 'OIOI'	Vicente
2026-06-07 03:40:47.993321	de1f2201-a07a-404c-a446-21a05452ad08	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:40:50.741285	d89736e5-e532-428d-8342-0ce3892b1542	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:40:50.768608	94bd2ad1-4aa1-4038-b1c4-e45cb0bbbad5	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:40:50.788175	c010eb05-665c-426e-a07b-c035fc87cd8b	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:41:19.78677	b55433d3-5326-40a8-9931-74f94709707d	TICKET_CANCELED	Atendimento foi cancelado para o chamado 'OIOI'	Vicente
2026-06-07 03:41:19.81086	c9a8468f-fb79-4e35-837d-16861000baf0	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:41:24.291456	6d23807d-549c-40ec-a13d-90e868b1b72c	TICKET_CANCELED	Atendimento foi cancelado para o chamado 'OIOI'	Vicente
2026-06-07 03:41:24.311772	56a70b06-9616-4bbb-8b41-f5fed6196aaf	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:43:20.253452	965a2625-0026-4f42-a27d-81e075a5ab95	LOGIN_FAILED	Senha incorreta para o usuário: Vicente | Tentativa 1 de 5 | Data/hora: 2026-06-07T03:43:20.253451900	vicente.tech@gmail.com
2026-06-07 03:43:32.175899	92c22330-e1be-48f0-bb41-fae5f17cb386	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Vicente	vicente.tech@gmail.com
2026-06-07 03:44:01.600758	61d30e26-e978-4dd4-aa77-7106ce44352f	TICKET_CANCELED	Atendimento foi cancelado para o chamado 'OIOI'	Vicente
2026-06-07 03:45:02.258712	71dd2c31-7775-4e09-bbae-06321ab79dc5	TICKET_CANCELED	Atendimento foi cancelado para o chamado 'OIOI'	Vicente
2026-06-07 03:45:02.317887	baed4837-f83d-4038-a112-96ad60eb51dd	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:45:07.130971	8a1c05e8-6afe-4e44-988c-f1e1169862c0	TICKET_FINISHED_PAYMENT_CANCELED	Não pode alterar chamados já finalizado, concluidos ou aguardando pagamentos	fbf38bc7-5eaf-4c27-a0fc-e62ba91ba448
2026-06-07 03:45:13.195656	0c8f8792-76ba-471c-8204-a13f08227091	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:45:13.458028	a48cd792-10ee-4e8e-90ad-599db28b3270	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:45:13.531473	d7bd7117-1d00-4b7f-a620-8fa2e79b2d53	TICKET_VIEWED	Detalhes do chamado 'OIOI' visualizados por Vicente	Vicente
2026-06-07 03:46:11.245767	e493f0b0-5ba5-4361-9ccc-5eee9fa9adf9	USER_CREATED	Usuário com o email 'dwadwa@gmail.com' foi criado com sucesso	dwadwa@gmail.com
2026-06-07 03:46:32.314872	6b7b8feb-78a2-4bde-a3d0-1568946ca1fe	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: dwadwa	dwadwa@gmail.com
2026-06-07 03:46:48.030949	b2cafd13-853c-4acd-aecd-c56443e08edf	TICKET_CREATED	Chamado criado: 'swa' | Categoria: SOFTWARE | Prioridade: LOW	dwadwa
2026-06-07 04:00:16.597149	16bdf0b5-2061-4a34-b1f9-20430cab118b	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-08 04:23:32.506926	5767b4b0-b97a-4fcd-8f98-67595cd3865b	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-07 04:52:29.936099	a8b6767f-921f-4dff-8774-f08c80a8ff6c	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: wilson	wilson.tech@gmail.com
2026-06-07 05:06:47.3254	26fabff0-4d6d-48f0-8f0c-5b9490fba62e	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 05:06:47.368148	4c36ba8a-9612-4bca-a3c0-e97a13358cb5	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 05:06:47.438939	4dd9117e-f5ba-40f6-9fda-d2e36ffdbbf6	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 05:06:47.464319	80a099c0-7c7f-42d4-b88f-3b98fd339040	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 05:42:13.799136	7b03d820-add0-4cc4-8503-db1a136d6a29	TICKET_ASSIGNED	Técnico 'wilson' assumiu o chamado 'swa' do cliente 'dwadwa'	wilson
2026-06-07 05:46:24.196292	992e1b1e-c9aa-414c-b289-8b60058ccc1d	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 05:46:24.222984	17703e12-4cda-4240-aa77-8d116e5553d6	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 05:46:24.256363	c73eb127-8626-4421-8033-832fa084a0ae	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 05:46:24.275962	1e9fc365-8277-4cf8-a9c0-eb47762c4986	TICKET_VIEWED	Detalhes do chamado 'aaaaaaaaaaaaaaa' visualizados por wilson	wilson
2026-06-07 05:50:23.095589	05a563ef-c56c-4148-81ab-3f43413c085a	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-07 05:50:29.518469	a219b258-2eb2-4e4f-84b2-ea1f2beccd18	TICKET_CREATED	Chamado criado: 'wsw' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-07 05:50:40.752867	eb39eb17-8617-4ce9-bedf-343ca764ff77	TICKET_CREATED	Chamado criado: 'dwa' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-07 05:55:17.534221	b3083e8d-8ecb-4202-aac3-07b7d1049031	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-07 14:34:02.505979	11f617a4-50d7-4790-9dbd-335ca300196b	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-07 14:34:36.762873	7ee162b8-57f3-44ab-9f6e-54950f2952cc	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: wilson	wilson.tech@gmail.com
2026-06-07 14:36:53.121008	f9054f09-f2f4-4467-ae10-6a4712b528d9	LOGIN_FAILED	Tentativa de login com email não cadastrado: wilson@gmail.com	wilson@gmail.com
2026-06-07 14:36:57.95552	86f8a472-90c6-4e91-bf87-2fc39fe28e07	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-07 14:38:07.964701	80148ffe-7d06-415c-a0e4-9179fdbba412	TICKET_CREATED	Chamado criado: 'OIOIOIOIOI' | Categoria: SOFTWARE | Prioridade: HIGH	Fedendo
2026-06-07 14:39:10.107019	bad3b154-32a0-49bf-bdbb-de7cae61b88a	TICKET_VIEWED	Detalhes do chamado 'wsw' visualizados por Fedendo	Fedendo
2026-06-07 14:39:10.156543	7c159a9e-3689-42d3-9dd0-70cb96b619c8	TICKET_VIEWED	Detalhes do chamado 'wsw' visualizados por Fedendo	Fedendo
2026-06-07 14:39:10.183788	84db9e82-4ccf-4d93-8777-796a56383b21	TICKET_VIEWED	Detalhes do chamado 'wsw' visualizados por Fedendo	Fedendo
2026-06-07 14:39:37.440909	0cdeb308-6e6a-46df-952e-c81469ea5464	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: wilson	wilson.tech@gmail.com
2026-06-07 14:40:21.65865	4288d2d7-6e4d-4fa7-960f-0ff58eaf3f96	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 14:40:21.694836	1849ea9b-bb01-4a11-bd33-e34b8745ce18	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 14:40:21.719383	0dc0c1b3-b6af-4432-8a81-260444dca3bd	TICKET_VIEWED	Detalhes do chamado 'awwawa' visualizados por wilson	wilson
2026-06-07 14:40:26.842495	7271d918-4ae9-4f39-85ab-21942d51c4e1	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 14:40:26.87488	332065d6-b6f7-4902-817d-4b839c67fcec	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 14:40:26.897372	da6704c8-9755-4264-bfca-fd9de9e49b01	TICKET_VIEWED	Detalhes do chamado 'dwadwa' visualizados por wilson	wilson
2026-06-07 14:40:33.787455	d8a57560-f3e3-4d45-8b7b-af13b2a7a250	TICKET_ASSIGNED	Técnico 'wilson' assumiu o chamado 'OIOIOIOIOI' do cliente 'Fedendo'	wilson
2026-06-07 14:40:38.923239	40a46627-81eb-46dd-a937-84e25fb79dba	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:40:38.956296	4bb001bd-950d-4310-86c5-b3b08104d60f	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:40:38.976448	ba9c012c-af73-44e2-b3f4-581c5f716841	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:40:49.656959	379ce49a-4ec3-4881-929f-7087c0fed25d	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:40:49.684729	fbd63b82-e0d5-4f50-907d-8289aa3827d0	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:40:49.706009	51194361-b540-4fbc-b4f7-77ff0049e54d	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:41:26.536411	31a5e85a-88e2-4937-a551-bc0a7636343d	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:41:26.570803	2dab1bbb-94ac-48e7-b103-044a730df1b5	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:41:26.595621	6c0ffb50-f50e-4c58-a073-417cabf23210	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:42:36.183996	af311489-de9c-4377-82be-40fa16399ec7	TICKET_VIEWED	Detalhes do chamado 'swa' visualizados por wilson	wilson
2026-06-07 14:42:36.212472	485da0b7-6532-4ccd-b770-19b2c3c6402c	TICKET_VIEWED	Detalhes do chamado 'swa' visualizados por wilson	wilson
2026-06-07 14:42:36.233203	d299c3e9-7f4d-41c4-a109-88c82ecdc715	TICKET_VIEWED	Detalhes do chamado 'swa' visualizados por wilson	wilson
2026-06-07 14:43:12.953954	96482f40-8f39-4152-abd9-981c96c9db3c	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:12.98356	b98cca0b-5e15-46f7-a718-de85ebad04e2	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:13.004691	653bc72d-d1a9-4d49-894d-309b852e3d51	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:31.281911	f5e98f8f-3050-4879-86b7-c4540ae416cb	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:31.312101	4b3adb89-2bbb-46b1-9731-6795336302fb	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:31.333098	f187dfe0-9fda-4c07-a011-e16a9d45243a	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:32.911914	1b25b1cf-a70f-44e9-b135-5866e12f509a	TICKET_STARTED	Atendimento iniciado para o chamado 'OIOIOIOIOI'	wilson
2026-06-07 14:43:32.951006	2602a6d8-a25a-4957-802a-87666cbf1d7a	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:52.418959	d27e7344-a09f-48bd-9a67-1249bc776abe	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:52.455414	f3b975ff-dfa6-4feb-8b5e-fbc05eca7e47	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:52.481766	c2542122-3953-4c45-94ae-53ace54525f8	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:55.255454	47b75069-3f75-478d-a2a1-43d6412b1b15	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:55.28989	fcc43527-f1bd-4026-9be1-ebd2ba92830c	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:43:55.31294	c7bb031d-964d-46e3-b8eb-a9e06322d6d9	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:44:16.488784	40fd6b78-1cf3-4b0e-a682-70647989120d	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Vicente	vicente.tech@gmail.com
2026-06-07 14:44:45.046388	8d705f72-e28c-413a-9fc8-e07cb383a567	TICKET_ASSIGNED	Técnico 'Vicente' assumiu o chamado 'dwa' do cliente 'Fedendo'	Vicente
2026-06-07 14:44:48.537437	1d8741a1-5e8a-4591-99d2-1781bffa9053	TICKET_VIEWED	Detalhes do chamado 'dwa' visualizados por Vicente	Vicente
2026-06-07 14:44:48.563343	ec519249-5e25-4b07-b478-60467b0480a3	TICKET_VIEWED	Detalhes do chamado 'dwa' visualizados por Vicente	Vicente
2026-06-07 14:44:48.585738	12cf3077-f35d-49a5-8eea-2a4b60355d91	TICKET_VIEWED	Detalhes do chamado 'dwa' visualizados por Vicente	Vicente
2026-06-07 14:44:50.806675	605ada8a-0db0-4fa2-b024-02e9e8424299	TICKET_STARTED	Atendimento iniciado para o chamado 'dwa'	Vicente
2026-06-07 14:44:50.827092	427720c1-e087-4d45-95d3-960d8187f5f9	TICKET_VIEWED	Detalhes do chamado 'dwa' visualizados por Vicente	Vicente
2026-06-07 14:45:17.616836	4ee60b09-6219-4aa8-8cf0-e229a1ebde56	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:45:17.642849	c6e5681c-4d7c-4829-a4e5-18acc1c3ecb1	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:45:17.664369	ccb483ee-e56b-40e7-9bc6-a942782a19bf	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:45:25.870597	2e161fcb-aa11-42dd-89fd-a66a27adc693	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	b6c54c28-a4f9-466a-8262-371608463fd8
2026-06-07 14:45:25.89506	532db3ea-5a01-4f87-aca1-8ad37ce2b5cc	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:45:31.302218	351fa68d-0fb2-4d44-b577-cf7a72c8d00e	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	b6c54c28-a4f9-466a-8262-371608463fd8
2026-06-07 14:45:31.326483	31f34a72-ed15-4537-81e3-30197bbfbbb2	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:45:33.445096	26b29a15-5425-4544-9686-8003fdff4904	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	b6c54c28-a4f9-466a-8262-371608463fd8
2026-06-07 14:45:33.466768	f44e516e-61f5-423b-9927-fa30a61436da	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:45:36.696218	293e8239-ec11-4d6e-bc8e-735119ee0af0	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	b6c54c28-a4f9-466a-8262-371608463fd8
2026-06-07 14:45:38.788417	e9425dbf-371e-4cda-9a9b-81fa1751850e	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	b6c54c28-a4f9-466a-8262-371608463fd8
2026-06-07 14:45:43.732988	8105f349-8a4a-49b8-8811-d8379cc893fa	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:45:50.7706	757bf606-17d0-46da-8db2-84bdffd9fff2	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:45:52.972053	d3751518-262b-499e-b4af-751c0fe78324	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	b6c54c28-a4f9-466a-8262-371608463fd8
2026-06-07 14:46:02.304723	0048c336-caaa-4c25-aa27-8d0de0d461bc	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:12.170202	232dca18-0fef-4512-94c7-88701a6887fc	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:21.615519	0dc449d7-1524-4db5-88c0-c697f6cc8846	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:26.550434	4a40f0d4-dff3-4dc6-bd2c-95642619c586	TICKET_STARTED	Atendimento iniciado para o chamado 'OIOIOIOIOI'	wilson
2026-06-07 14:46:32.200546	3d802b84-874f-403b-a686-63ef576512c7	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:40.180211	6392b151-6066-488f-bbb5-bb4e3c7bd2f5	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:47:04.272922	26e6a7f2-ffa3-4fe9-ae6a-7f4339c73d46	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por Fedendo	Fedendo
2026-06-07 14:47:04.317599	7be777fb-7cf5-4af3-92b8-c6d5636bdfc5	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por Fedendo	Fedendo
2026-06-07 14:47:24.10285	85eb81e9-4047-4351-a376-f8d9f1dd598b	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por Fedendo	Fedendo
2026-06-07 14:47:31.982898	84b69c8f-ad19-414c-a60d-30ff9bee8a1e	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por Fedendo	Fedendo
2026-06-07 14:47:35.08578	9e238496-6e03-4f7c-b1da-40907145a214	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por Fedendo	Fedendo
2026-06-07 14:47:35.112598	08053f8e-86d1-4761-8780-99e130a465ed	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por Fedendo	Fedendo
2026-06-07 14:47:35.13361	da01bac3-9816-4ddc-a96a-44473c15e845	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por Fedendo	Fedendo
2026-06-07 14:45:36.720983	9309d29f-bb9c-43d7-8d16-8054e17f0dff	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:45:38.809065	1b6fc3e5-1c7f-467a-ac64-9c6720acb5a0	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:45:50.748705	76f99d0c-c794-487a-bd61-ed0e29c6faa5	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	b6c54c28-a4f9-466a-8262-371608463fd8
2026-06-07 14:45:52.992877	c22bd69e-dd2c-4cc4-b133-055e02647c2d	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:12.145928	fa628fce-211b-4c8a-938d-1c8a099893a3	TICKET_FINISHED	Chamado 'OIOIOIOIOI' finalizado. Valor calculado: R$ 195.0000	wilson
2026-06-07 14:46:21.56817	0893c016-08f6-49fd-8e9c-e4d5506db2c1	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:21.594538	57be0d43-1db6-41aa-9432-7ab9e9fe56d6	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:26.581493	9632d86f-73ab-46dd-8304-8693b9fc790e	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	b6c54c28-a4f9-466a-8262-371608463fd8
2026-06-07 14:46:32.239457	6c1b553b-4554-4916-a5f2-773f04dc0355	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:32.259954	b4dd7ba4-c92b-43d5-852b-afe6e4ad9fff	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:40.202013	1ba9db1e-e0b0-4a31-be67-202148132fb3	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:43.042988	f1599d40-501f-428a-97a2-a9e6073eb45b	TICKET_FINISHED	Chamado 'OIOIOIOIOI' finalizado. Valor calculado: R$ 195.0000	wilson
2026-06-07 14:46:43.062551	6b78397c-7fc7-4fcd-94c7-a909eabcbe93	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:59.286413	b0e3861e-42bd-450b-82a4-d48858c832de	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-07 14:47:04.34267	b88bfca6-99f3-4c7e-bde2-47aeaa62f239	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por Fedendo	Fedendo
2026-06-07 14:47:24.080668	0d7e7a41-d11a-46e3-b7f8-14475f290653	TICKET_PAYMENT	Pagamento de R$ 195 confirmado para o chamado 'OIOIOIOIOI'	Fedendo
2026-06-07 14:47:32.011914	ffd4f135-a6e3-4878-a2db-3783668ed408	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por Fedendo	Fedendo
2026-06-07 14:48:05.205208	f71a895b-74a5-4aef-bee6-847720ba8e5a	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-07 14:45:43.710188	987dc392-6820-4afe-9bb2-36bb3439ed44	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	b6c54c28-a4f9-466a-8262-371608463fd8
2026-06-07 14:46:02.280564	6f1c3584-924f-4f89-89fd-c7bc0036e1eb	HISTORY_UPDATED	O técnico wilson atualizou o chamado do clienteFedendo	b6c54c28-a4f9-466a-8262-371608463fd8
2026-06-07 14:46:26.603861	c66e5eb6-1222-4282-ba13-31c961be308c	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:46:40.152237	9143e7d1-f030-4ffb-b24f-6479cd1f3312	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por wilson	wilson
2026-06-07 14:47:32.0326	9fd1472b-7a4c-422d-bb97-690519d82c66	TICKET_VIEWED	Detalhes do chamado 'OIOIOIOIOI' visualizados por Fedendo	Fedendo
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.customer (id) FROM stdin;
49905fa4-7332-48f4-894e-1c462212d861
5849f7c2-5f87-4a45-8daa-c77c88ca4cd1
\.


--
-- Data for Name: password_history; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.password_history (created_at, id, person_id, hashed_password) FROM stdin;
\.


--
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.person (failed_login_attempts, created_at, locked_until, id, email, name, password, phone, role) FROM stdin;
0	\N	\N	de1c40e6-b271-41d4-81f1-511bfbd6a388	wilson.tech@gmail.com	wilson	$2a$10$MFddnEpxUWnJhzkrxITlDeCybCxK763gSLLJKMQR81xIRfUvnOKzO	2131321	TECHNICAL
0	2026-06-07 01:52:28.724728	\N	49905fa4-7332-48f4-894e-1c462212d861	fedendo@gmail.com	Fedendo	$2a$10$qsGE64WIcz3xAr17NUukteshqEP/V6GwdFScxohrsAORvKj1jjZVa	N/A	CUSTOMER
0	\N	\N	6aebcc9d-aa45-4558-9c86-43c660ca886a	admin@wilson.com	WilsonAdmin	$2a$10$RUeHfAR8RH.3XoR7gxIxGeHex8IceMkQ3G/d3Pgc7MMbaVxmWTlWW	\N	ADMIN
0	\N	\N	8a242cf3-9ae8-4cd9-9f9b-77ca23d135ff	vicente.tech@gmail.com	Vicente	$2a$10$ElgNHyer65fDC9Q.RMdZvu2Y1Kbug0N5OFVCZJ6EIeS5Y1ZPZpHN2	1231	TECHNICAL
0	2026-06-07 03:46:11.227126	\N	5849f7c2-5f87-4a45-8daa-c77c88ca4cd1	dwadwa@gmail.com	dwadwa	$2a$10$ej7rzN3ETP5FtF7sKK4DEOTf9EoQwJZJ2w3Al8ND64t2f9OFheh3i	N/A	CUSTOMER
\.


--
-- Data for Name: technical; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.technical (id) FROM stdin;
de1c40e6-b271-41d4-81f1-511bfbd6a388
8a242cf3-9ae8-4cd9-9f9b-77ca23d135ff
\.


--
-- Data for Name: ticket; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.ticket (base_hourly_rate, payment_confirmed, value, created_at, finished_at, started_at, customer_id, id, technical_id, category, description, priority, status, title) FROM stdin;
100.00	t	180.00	2026-06-07 02:56:22.544848	2026-06-07 02:57:19.774729	2026-06-07 02:57:03.846408	49905fa4-7332-48f4-894e-1c462212d861	99d154f0-0fa4-4f42-af26-575db64d7b0d	de1c40e6-b271-41d4-81f1-511bfbd6a388	NETWORK	dawdwa	MEDIUM	COMPLETED	dwadwa
100.00	t	180.00	2026-06-07 02:37:30.028077	2026-06-07 03:23:25.905872	2026-06-07 02:37:43.260247	49905fa4-7332-48f4-894e-1c462212d861	423cdf27-b331-46bf-af4c-dcb13995c3d6	de1c40e6-b271-41d4-81f1-511bfbd6a388	NETWORK	swsw	MEDIUM	COMPLETED	sw
100.00	t	180.00	2026-06-07 01:52:52.148554	2026-06-07 03:32:31.464207	2026-06-07 01:53:05.628562	49905fa4-7332-48f4-894e-1c462212d861	80a26c21-594b-4066-b147-860d017c1167	de1c40e6-b271-41d4-81f1-511bfbd6a388	NETWORK	awawaw	MEDIUM	COMPLETED	awwawa
100.00	f	180.00	2026-06-07 03:33:41.76989	2026-06-07 03:40:31.318399	2026-06-07 03:40:27.399789	49905fa4-7332-48f4-894e-1c462212d861	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965	de1c40e6-b271-41d4-81f1-511bfbd6a388	NETWORK	htrhtrhtr	MEDIUM	PAYMENT_PENDING	aaaaaaaaaaaaaaa
100.00	f	\N	2026-06-07 03:33:33.633853	\N	2026-06-07 03:45:02.045309	49905fa4-7332-48f4-894e-1c462212d861	fbf38bc7-5eaf-4c27-a0fc-e62ba91ba448	8a242cf3-9ae8-4cd9-9f9b-77ca23d135ff	NETWORK	oioioioioi	MEDIUM	CANCELED	OIOI
100.00	f	\N	2026-06-07 03:46:48.017075	\N	\N	5849f7c2-5f87-4a45-8daa-c77c88ca4cd1	a5f9d37b-011a-4b86-bb01-4913e81c4cb0	de1c40e6-b271-41d4-81f1-511bfbd6a388	SOFTWARE	swa	LOW	ASSIGNED	swa
100.00	f	\N	2026-06-07 05:50:29.492605	\N	\N	49905fa4-7332-48f4-894e-1c462212d861	75617142-429e-4e68-9659-1eb6459f1de0	\N	NETWORK	swsw	MEDIUM	OPEN	wsw
100.00	f	\N	2026-06-07 05:50:40.510463	\N	2026-06-07 14:44:50.796879	49905fa4-7332-48f4-894e-1c462212d861	59cc14c9-312d-4098-bb12-921c019436b7	8a242cf3-9ae8-4cd9-9f9b-77ca23d135ff	NETWORK	dawdaw	MEDIUM	IN_PROGRESS	dwa
100.00	t	195.00	2026-06-07 14:38:07.50752	2026-06-07 14:46:43.032356	2026-06-07 14:46:26.540474	49905fa4-7332-48f4-894e-1c462212d861	b6c54c28-a4f9-466a-8262-371608463fd8	de1c40e6-b271-41d4-81f1-511bfbd6a388	SOFTWARE	AAAAAAAAAAAAAAAAAAAAAAAAAAA	HIGH	COMPLETED	OIOIOIOIOI
\.


--
-- Data for Name: ticket_history; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.ticket_history (change_date, id, ticket_id, comment, new_status, old_status, update_by) FROM stdin;
2026-06-07 01:53:13.930996	d8dc6481-ba4e-47c8-97e9-53eb93d44a75	80a26c21-594b-4066-b147-860d017c1167	awaw	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 02:14:57.017512	bc1783ec-f4cb-41e4-aff8-1af7af9a367a	80a26c21-594b-4066-b147-860d017c1167	w	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 02:17:33.525867	a1dc2b1e-a0c8-4330-9bde-2cdada6f2dfc	80a26c21-594b-4066-b147-860d017c1167	w	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 02:17:45.138341	7bc9e1ac-33b0-4b24-aaff-1c2bfaaeb90f	80a26c21-594b-4066-b147-860d017c1167	w	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 02:20:05.237017	e7453511-1a1d-4d6c-bad8-d1949dd33819	80a26c21-594b-4066-b147-860d017c1167	ww	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 02:31:13.044815	e6d55c5d-fc2f-42fb-a8f3-a3af13a40c23	80a26c21-594b-4066-b147-860d017c1167	w	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 02:35:06.772272	1f38fc79-7ebe-4d91-9322-9231cd9c1e04	80a26c21-594b-4066-b147-860d017c1167	dawdwa	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 02:35:08.249169	cebdf20e-8edd-433f-8a73-4eae6d6de661	80a26c21-594b-4066-b147-860d017c1167	dwadwadwa	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 02:36:09.671642	d435e932-b56b-4bb4-a1e2-18b0cad2817d	80a26c21-594b-4066-b147-860d017c1167	wadwa	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 02:36:15.051456	867162ef-aeca-4703-ab0d-521ad7308b29	80a26c21-594b-4066-b147-860d017c1167	udhwadhaudwadaw	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 02:56:42.346957	7e40224b-3a00-4a02-b42a-6bda3352bd66	99d154f0-0fa4-4f42-af26-575db64d7b0d	daw	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 03:23:23.661975	4dc0d4a5-4a89-46b5-8597-26a21598dd70	423cdf27-b331-46bf-af4c-dcb13995c3d6	Vai tomando\n	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 03:40:14.910993	69dc65ad-5435-44c1-8ca8-a4830f00fbe4	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965	wwwwwwwwww	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 03:40:19.043677	b3f62147-91f6-4805-94c0-c3c239c6f8a4	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965	OIOIOI	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 03:40:21.07745	2e431085-b86a-48ac-828d-8dab667cef2c	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965	yyyyyyyy	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 03:40:22.099414	39ed0774-f43b-4155-abcd-4d8bb37ea7ba	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965	hyhy	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 03:40:23.201372	c48e0252-012c-4fff-a2e0-544ec1d93c5c	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965	hythyt	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 03:40:24.32981	875d6791-7fda-4c6d-bffa-279859ba3b7d	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965	hythyt	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 03:40:25.570677	f3c74141-a35d-4179-8b4e-7ef9f5c7458c	5413f466-6c9f-4e37-9d3a-bcb9d2d7a965	hythytht	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 14:45:25.858943	2afc9af6-2805-4729-a7c3-52090e0d8acd	b6c54c28-a4f9-466a-8262-371608463fd8	Fui na casa do cliente	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 14:45:31.293907	62903a1d-17b2-42cc-a849-37017e961c09	b6c54c28-a4f9-466a-8262-371608463fd8	aaaaaaaaaaaaaa	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 14:45:33.436909	2e6c93da-29a1-47b9-a879-906fcd5d19b3	b6c54c28-a4f9-466a-8262-371608463fd8	wwwwwwwwwwwwwwwwwwwwwww	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 14:45:36.686157	089a902a-56aa-477d-8101-3998f3e033fc	b6c54c28-a4f9-466a-8262-371608463fd8	wawawwwwwwwwwwwwwww	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 14:45:38.780181	c82f7cad-086f-42fe-83b0-7a638328e3c1	b6c54c28-a4f9-466a-8262-371608463fd8	wwwwwwwwwwwwwwwwwwwwwwwwww	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 14:45:43.702487	c35b2eba-5b16-43a4-8aa5-d80f7ce63aeb	b6c54c28-a4f9-466a-8262-371608463fd8	dwwaddwadwa	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 14:45:50.740924	57857f25-6959-435c-8a9c-3b702f13c787	b6c54c28-a4f9-466a-8262-371608463fd8	awawawawawawawawawawawaw	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 14:45:52.963974	04a39d3a-c1c0-4c41-bd32-7d093a92e83d	b6c54c28-a4f9-466a-8262-371608463fd8	wsswsw	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 14:46:02.270595	88e26f45-137f-4cb1-9478-34e89d634546	b6c54c28-a4f9-466a-8262-371608463fd8	Terminei o serviço\n	IN_PROGRESS	IN_PROGRESS	wilson
2026-06-07 14:46:26.573083	31966786-b727-45dc-b574-22ae3d675d43	b6c54c28-a4f9-466a-8262-371608463fd8	w	IN_PROGRESS	IN_PROGRESS	wilson
\.


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: password_history password_history_pkey; Type: CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.password_history
    ADD CONSTRAINT password_history_pkey PRIMARY KEY (id);


--
-- Name: person person_email_key; Type: CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_email_key UNIQUE (email);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: technical technical_pkey; Type: CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.technical
    ADD CONSTRAINT technical_pkey PRIMARY KEY (id);


--
-- Name: ticket_history ticket_history_pkey; Type: CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.ticket_history
    ADD CONSTRAINT ticket_history_pkey PRIMARY KEY (id);


--
-- Name: ticket ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT ticket_pkey PRIMARY KEY (id);


--
-- Name: technical fk4vx29lwe09i019ehuw1gusvrc; Type: FK CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.technical
    ADD CONSTRAINT fk4vx29lwe09i019ehuw1gusvrc FOREIGN KEY (id) REFERENCES public.person(id);


--
-- Name: password_history fk76ijovg2315k1fm4otyr3hmah; Type: FK CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.password_history
    ADD CONSTRAINT fk76ijovg2315k1fm4otyr3hmah FOREIGN KEY (person_id) REFERENCES public.person(id);


--
-- Name: ticket fkmli0eqrecnnqvdgv3kcx7d9m8; Type: FK CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT fkmli0eqrecnnqvdgv3kcx7d9m8 FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: ticket_history fkn172ccrihn09prjnpoyxabcgw; Type: FK CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.ticket_history
    ADD CONSTRAINT fkn172ccrihn09prjnpoyxabcgw FOREIGN KEY (ticket_id) REFERENCES public.ticket(id);


--
-- Name: ticket fkqje208cfaqxp1x61heksb01cl; Type: FK CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT fkqje208cfaqxp1x61heksb01cl FOREIGN KEY (technical_id) REFERENCES public.technical(id);


--
-- Name: customer fkr9okrktxscw3omxi1wm7cg18u; Type: FK CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT fkr9okrktxscw3omxi1wm7cg18u FOREIGN KEY (id) REFERENCES public.person(id);


--
-- Name: admin fksplda61kmlib6vk6qmwfv08dh; Type: FK CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT fksplda61kmlib6vk6qmwfv08dh FOREIGN KEY (id) REFERENCES public.person(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: Qdop
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 7mtgOOmxQGjpbbFwcUvrST8X7JZ8DHSHEATRnuaL51qHJtFUkedLF6JqQKyFFK2

