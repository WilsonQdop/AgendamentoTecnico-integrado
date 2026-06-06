--
-- PostgreSQL database dump
--

\restrict Q1E8hREjfj7aNEM5x0VonFw83thz7kbqhD70GrMZdcgNvydzQgHXCOd1r6NF6GZ

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
    CONSTRAINT audit_log_action_check CHECK (((action)::text = ANY ((ARRAY['USER_CREATED'::character varying, 'USER_UPDATED'::character varying, 'USER_DELETED'::character varying, 'LOGIN_SUCCESS'::character varying, 'LOGIN_FAILED'::character varying, 'LOGIN_BLOCKED'::character varying, 'TICKET_CREATED'::character varying, 'TICKET_CANCELED'::character varying, 'TICKET_ASSIGNED'::character varying, 'TICKET_STARTED'::character varying, 'TICKET_FINISHED'::character varying, 'TICKET_PAYMENT'::character varying, 'TICKET_VIEWED'::character varying, 'TICKET_FINISHED_PAYMENT_CANCELED'::character varying, 'HISTORY_UPDATED'::character varying])::text[])))
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
    CONSTRAINT person_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'TECHNICAL'::character varying, 'CUSTOMER'::character varying])::text[])))
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
    CONSTRAINT ticket_category_check CHECK (((category)::text = ANY ((ARRAY['HARDWARE'::character varying, 'SOFTWARE'::character varying, 'NETWORK'::character varying])::text[]))),
    CONSTRAINT ticket_priority_check CHECK (((priority)::text = ANY ((ARRAY['LOW'::character varying, 'MEDIUM'::character varying, 'HIGH'::character varying])::text[]))),
    CONSTRAINT ticket_status_check CHECK (((status)::text = ANY ((ARRAY['OPEN'::character varying, 'COMPLETED'::character varying, 'CANCELED'::character varying, 'ASSIGNED'::character varying, 'PAYMENT_PENDING'::character varying, 'IN_PROGRESS'::character varying])::text[])))
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
    status_changed_to character varying(255),
    update_by character varying(255),
    new_status character varying(255),
    old_status character varying(255),
    CONSTRAINT ticket_history_new_status_check CHECK (((new_status)::text = ANY ((ARRAY['OPEN'::character varying, 'COMPLETED'::character varying, 'CANCELED'::character varying, 'ASSIGNED'::character varying, 'PAYMENT_PENDING'::character varying, 'IN_PROGRESS'::character varying])::text[]))),
    CONSTRAINT ticket_history_old_status_check CHECK (((old_status)::text = ANY ((ARRAY['OPEN'::character varying, 'COMPLETED'::character varying, 'CANCELED'::character varying, 'ASSIGNED'::character varying, 'PAYMENT_PENDING'::character varying, 'IN_PROGRESS'::character varying])::text[]))),
    CONSTRAINT ticket_history_status_changed_to_check CHECK (((status_changed_to)::text = ANY ((ARRAY['OPEN'::character varying, 'COMPLETED'::character varying, 'CANCELED'::character varying, 'ASSIGNED'::character varying, 'PAYMENT_PENDING'::character varying, 'IN_PROGRESS'::character varying])::text[])))
);


ALTER TABLE public.ticket_history OWNER TO "Qdop";

--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.admin (id) FROM stdin;
9260e8c2-0066-4ad8-ab09-6809db5c82b0
\.


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.audit_log (created_at, id, action, description, target) FROM stdin;
2026-05-26 16:02:29.511336	8c28cc9d-a189-464e-a4bb-8be84c044978	USER_CREATED	Usuário com o email 'Wilson.qdop@gmail.com' foi criado com sucesso	Wilson.qdop@gmail.com
2026-05-26 16:02:56.524565	44fd76c4-b3b5-481d-8915-c12d0591eeec	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: wilson	Wilson.qdop@gmail.com
2026-05-26 16:03:15.891132	c81717bb-d3cd-4f6a-959e-35115d473b92	TICKET_CREATED	Chamado criado: 'Meu pc está com vírus' | Categoria: SOFTWARE | Prioridade: MEDIUM	wilson
2026-05-26 16:05:18.688547	8253359c-7870-4e34-aa36-eba3274f46d8	USER_CREATED	Usuário com o email 'Wilson.tech@gmail.com' foi criado com sucesso	Wilson.tech@gmail.com
2026-05-26 16:06:08.693648	517c68d9-d8cd-424f-86f8-574eb5b23226	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: wilson	Wilson.tech@gmail.com
2026-05-26 16:07:08.849711	ad8ca6b3-fc14-45bc-a73d-8c56fd3bc11f	USER_DELETED	Usuário com o email 'Wilson.tech@gmail.com' foi deletado	wilson
2026-05-26 16:07:24.735614	512cc469-cc12-4d97-837c-cfd0c8a83000	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: wilson	Wilson.qdop@gmail.com
2026-05-26 16:10:17.220845	eed99636-6222-4663-a6e5-7322242fdc9a	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-05-26 16:10:42.433979	aa2eeb87-770f-4417-8321-28a97ae70b8b	USER_CREATED	Técnico com o email 'Jotta.tech@gmail.com' foi criado com sucesso pelo Admin	Jotta.tech@gmail.com
2026-05-26 16:14:48.474586	fb5c2049-e8ae-4c96-ab4f-465fd5f67f21	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Jottinha	Jotta.tech@gmail.com
2026-05-26 16:15:34.961201	8458c15e-d5d0-4219-ba65-da30d0dd2100	USER_DELETED	Técnico 'Jottinha' deletou sua conta	Jotta.tech@gmail.com
2026-05-26 16:17:19.735403	64717d25-68f5-4f50-b755-5ea2ec890b48	USER_CREATED	Técnico com o email 'Jotta.tech@gmail.com' foi criado com sucesso pelo Admin	Jotta.tech@gmail.com
2026-05-26 16:18:25.801817	8cbbfe0c-65f1-4c14-b8d0-b47f848a9941	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Jottinha	Jotta.tech@gmail.com
2026-05-26 16:21:10.860202	675d542d-36cc-4a96-90cd-efa92ab2a8e2	TICKET_ASSIGNED	Técnico 'Jottinha' assumiu o chamado 'Meu pc está com vírus' do cliente 'wilson'	Jottinha
2026-05-26 16:24:00.674454	45e81f38-ba07-4c5e-9664-f0afaed46d3a	TICKET_STARTED	Atendimento iniciado para o chamado 'Meu pc está com vírus'	Jottinha
2026-05-26 16:25:39.83856	9df31f61-fd95-464a-984c-62447b6b04b7	HISTORY_UPDATED	O técnico Jottinha atualizou o chamado do clientewilson	e9fb4c6d-2b00-4929-b1f8-204733ce2b4b
2026-05-26 16:25:54.637323	ae3dcaaa-f65b-43c8-9857-86887bab13c4	HISTORY_UPDATED	O técnico Jottinha atualizou o chamado do clientewilson	e9fb4c6d-2b00-4929-b1f8-204733ce2b4b
2026-05-26 16:27:39.974155	db76e939-a3b3-4063-a41a-fa8859709910	TICKET_FINISHED	Chamado 'Meu pc está com vírus' finalizado. Valor calculado: R$ 156.0000	Jottinha
2026-05-26 16:28:34.420678	93a9baa1-6883-4706-bd2d-55ae158ac803	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: wilson	Wilson.qdop@gmail.com
2026-05-26 16:30:24.294132	bce0bcc8-a7bf-4780-ba6b-2e4c92084aa9	TICKET_PAYMENT	Pagamento de R$ 156 confirmado para o chamado 'Meu pc está com vírus'	wilson
2026-06-04 14:27:30.493691	a61a59d9-0066-4d8b-9ede-1e1efa5e18db	LOGIN_FAILED	Tentativa de login com email não cadastrado: dawdwa@gfdwa	dawdwa@gfdwa
2026-06-04 14:27:51.34829	f96bfca5-1db9-4a3a-bd44-e8b48a0905ba	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-04 14:42:13.73054	d2caed3b-44c0-497c-903a-a2216f38dd4b	USER_CREATED	Usuário com o email 'dwadwa@gmail.com' foi criado com sucesso	dwadwa@gmail.com
2026-06-04 14:55:55.381046	20d48a2e-f87e-44a0-b303-a2cba816c0d0	LOGIN_FAILED	Senha incorreta para o usuário: dwadwa' | Tentativa 1 de 5 | Data/hora: 2026-06-04T14:55:55.379040900	dwadwa@gmail.com
2026-06-04 14:56:01.223665	d47de4cb-aa24-478c-b98b-60899a7c05b1	LOGIN_FAILED	Senha incorreta para o usuário: dwadwa' | Tentativa 2 de 5 | Data/hora: 2026-06-04T14:56:01.223664800	dwadwa@gmail.com
2026-06-04 14:56:34.73911	e9cc4085-ef1e-49fb-b454-1668469f9448	LOGIN_FAILED	Senha incorreta para o usuário: dwadwa' | Tentativa 3 de 5 | Data/hora: 2026-06-04T14:56:34.739109600	dwadwa@gmail.com
2026-06-04 14:56:37.860047	76fc40f5-8885-4f69-8ed9-0135daf69540	LOGIN_FAILED	Senha incorreta para o usuário: dwadwa' | Tentativa 4 de 5 | Data/hora: 2026-06-04T14:56:37.860046800	dwadwa@gmail.com
2026-06-04 14:56:41.220326	88cbe876-f7e9-4d61-919f-d2d03c230b14	LOGIN_FAILED	Senha incorreta para o usuário: dwadwa' | Tentativa 5 de 5 | Data/hora: 2026-06-04T14:56:41.220325600	dwadwa@gmail.com
2026-06-04 14:56:41.916465	b2c62e6b-aff8-4cd4-be31-73976561f4d4	LOGIN_BLOCKED	Usuário dwadwa' atingiu 5 falhas de autenticação consecutivas no dia | Conta bloqueada por 10 minutos | Data/hora: 2026-06-04T14:56:41.915306200	dwadwa@gmail.com
2026-06-04 14:56:43.353464	6afd4e81-9f87-45e3-bd9c-4da8dad87b4e	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: dwadwa' | Desbloqueio em 10 minuto(s)	dwadwa@gmail.com
2026-06-04 14:57:36.1598	57dde6af-278a-4617-ba3d-50c7361cc2a5	USER_CREATED	Usuário com o email 'Wilson.tech@gmail.com' foi criado com sucesso	Wilson.tech@gmail.com
2026-06-04 14:58:09.353968	395c0ba2-096e-4837-bb15-571eeeb13c94	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Wilson	Wilson.tech@gmail.com
2026-06-04 15:03:45.065647	2bd2788e-549f-4d79-a613-db604defe16e	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 1 de 5 | Data/hora: 2026-06-04T15:03:45.065646800	Wilson.tech@gmail.com
2026-06-04 15:04:05.930103	546455ba-2f0e-400a-a505-700fac1897e1	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 2 de 5 | Data/hora: 2026-06-04T15:04:05.930102600	Wilson.tech@gmail.com
2026-06-04 15:04:19.180184	9de54fcb-f72d-4c6e-bd4b-0579abf4dab5	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Wilson	Wilson.tech@gmail.com
2026-06-04 15:14:38.38068	66c5d1ec-d93a-4e8d-a186-3cee6e449b44	TICKET_CREATED	Chamado criado: 'dawdaw' | Categoria: NETWORK | Prioridade: MEDIUM	Wilson
2026-06-04 15:16:43.476469	58c6e015-2973-4077-bf57-fb22bbb8da7a	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 1 de 5 | Data/hora: 2026-06-04T15:16:43.476469300	Wilson.tech@gmail.com
2026-06-04 15:16:47.393914	f3840966-e574-43b5-9b2b-85dd2e74c5e6	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 2 de 5 | Data/hora: 2026-06-04T15:16:47.393914100	Wilson.tech@gmail.com
2026-06-04 15:16:51.958773	627de379-e1a1-4c77-960c-8b32ad36f543	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Wilson	Wilson.tech@gmail.com
2026-06-04 15:17:29.768036	aeb98f95-9d93-4e1e-8c65-02ca68c9cfbf	USER_CREATED	Usuário com o email 'dawdwa@dadwa' foi criado com sucesso	dawdwa@dadwa
2026-06-04 15:25:01.907596	1c6b28ba-4ffb-4fc8-9b9f-3163e64922c5	LOGIN_FAILED	Senha incorreta para o usuário: WilsonAdmin | Tentativa 1 de 5 | Data/hora: 2026-06-04T15:25:01.907596	admin@wilson.com
2026-06-04 15:25:22.241942	f1827e87-a284-46aa-ac8d-c00aa9f7d55f	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-04 15:27:57.685974	c1f883c5-35c8-475c-8e6e-8562ec90a571	USER_CREATED	Técnico com o email 'Wilson.tecnico@gmail.com' foi criado com sucesso pelo Admin	Wilson.tecnico@gmail.com
2026-06-04 15:28:28.395354	86885c8a-303f-419f-acd5-6059150d4ceb	LOGIN_FAILED	Tentativa de login com email não cadastrado: wilson.tecnico@gmail.com	wilson.tecnico@gmail.com
2026-06-04 15:28:30.724507	190b9b95-1cc6-469c-8608-106623f6484f	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Wilson	Wilson.tecnico@gmail.com
2026-06-04 15:29:17.119296	97db6064-33b2-420a-a1b6-e12fa762b4c4	LOGIN_FAILED	Tentativa de login com email não cadastrado: wilson@admin.com	wilson@admin.com
2026-06-04 15:29:31.612316	dee4c757-01ae-475f-9f83-8aa2e1eef342	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-04 17:06:24.919992	c22e9f69-03f7-4c4c-a166-e0b5984445da	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 1 de 5 | Data/hora: 2026-06-04T17:06:24.919992300	Wilson.tecnico@gmail.com
2026-06-04 17:06:28.907526	9dcd2e96-3d6f-4cae-a498-3d82a8cd639b	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Wilson	Wilson.tecnico@gmail.com
2026-06-04 17:08:12.282899	d89212c9-f062-4877-935b-cfba33dda77d	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 1 de 5 | Data/hora: 2026-06-04T17:08:12.282898500	Wilson.tech@gmail.com
2026-06-04 17:08:12.342126	5f8d41b6-51db-4e29-b2df-37877b3f1352	LOGIN_BLOCKED	Usuário Wilson atingiu 5 falhas de autenticação consecutivas no dia | Conta bloqueada por 10 minutos | Data/hora: 2026-06-04T17:08:12.341007500	Wilson.tech@gmail.com
2026-06-04 17:08:16.946144	289b9c88-6ba4-4167-82e8-fba8d79152e2	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 2 de 5 | Data/hora: 2026-06-04T17:08:16.946144200	Wilson.tech@gmail.com
2026-06-04 17:08:17.311165	212a36cf-8c8a-4d65-a3b2-f3ee17db5fdd	LOGIN_BLOCKED	Usuário Wilson atingiu 5 falhas de autenticação consecutivas no dia | Conta bloqueada por 10 minutos | Data/hora: 2026-06-04T17:08:17.310641100	Wilson.tech@gmail.com
2026-06-04 17:08:20.147114	410d0bfe-0b57-458b-9374-4940dfaac3de	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 3 de 5 | Data/hora: 2026-06-04T17:08:20.147114100	Wilson.tech@gmail.com
2026-06-04 17:08:20.457866	ba8bb34a-eb30-4359-8fc7-4ed281b548e9	LOGIN_BLOCKED	Usuário Wilson atingiu 5 falhas de autenticação consecutivas no dia | Conta bloqueada por 10 minutos | Data/hora: 2026-06-04T17:08:20.457865700	Wilson.tech@gmail.com
2026-06-04 17:08:23.657858	c2777aa8-e50a-4a99-8f90-c38ea9ff14ba	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 4 de 5 | Data/hora: 2026-06-04T17:08:23.656856800	Wilson.tech@gmail.com
2026-06-04 17:08:24.071642	248fd4a7-f5f4-48af-8ce1-8fee4a54828d	LOGIN_BLOCKED	Usuário Wilson atingiu 5 falhas de autenticação consecutivas no dia | Conta bloqueada por 10 minutos | Data/hora: 2026-06-04T17:08:24.071642400	Wilson.tech@gmail.com
2026-06-04 17:08:24.631315	7b29cadc-82e1-4fe7-b145-58dee7dfa35d	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 5 de 5 | Data/hora: 2026-06-04T17:08:24.631314900	Wilson.tech@gmail.com
2026-06-04 17:08:24.746575	de75c1a3-a69b-47f8-a099-d860876ffec6	LOGIN_BLOCKED	Usuário Wilson atingiu 5 falhas de autenticação consecutivas no dia | Conta bloqueada por 10 minutos | Data/hora: 2026-06-04T17:08:24.746575400	Wilson.tech@gmail.com
2026-06-04 17:08:26.495183	817acdec-e1d6-4ab2-81e1-1dae83d6841d	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:08:27.806613	e71bfa12-f930-4ee5-b98a-86b7d066f1f2	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:08:28.336809	e03c1d2c-76ab-4bcb-83ce-14db51eaaf3d	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:08:29.254918	be34685a-bfa9-460d-a031-bcd86f71b36d	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:08:29.798526	e1156fc9-39ae-4d68-9e4e-84aa9779b3df	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:08:30.27238	9f1a6242-46de-4bb5-b581-a9f8885db58b	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:16:59.502799	b04b7ca8-5217-4ce7-ae48-bc8d5304153b	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 2 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:17:24.055489	f0093094-874b-4b2d-9a4b-368c92da5e96	LOGIN_FAILED	Senha incorreta para o usuário: wilson | Tentativa 1 de 5 | Data/hora: 2026-06-04T17:17:24.055488500	Wilson.qdop@gmail.com
2026-06-04 17:17:29.023564	b143a66d-3b1f-4c49-ab90-be1411bcbb82	LOGIN_FAILED	Senha incorreta para o usuário: wilson | Tentativa 2 de 5 | Data/hora: 2026-06-04T17:17:29.023564100	Wilson.qdop@gmail.com
2026-06-04 17:08:25.203469	0f461eeb-6c5f-404f-9e27-f5a0c9e8c382	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:08:25.980878	35a1da7f-69ff-4178-8fb0-72d4ad2e60df	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:08:28.790697	aa42f20c-fda8-4c75-a8ac-eb74262b09db	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:08:30.695446	f63821ee-0a81-44b9-b4ff-2d9cebc5c0c7	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 17:17:32.909594	7cc75c14-7aef-4c68-bd35-9d335927046d	LOGIN_FAILED	Senha incorreta para o usuário: wilson | Tentativa 3 de 5 | Data/hora: 2026-06-04T17:17:32.909594400	Wilson.qdop@gmail.com
2026-06-04 17:17:36.50718	0dd15a85-e0e3-4fa9-bd6e-90eb14633e27	LOGIN_FAILED	Senha incorreta para o usuário: wilson | Tentativa 4 de 5 | Data/hora: 2026-06-04T17:17:36.506189	Wilson.qdop@gmail.com
2026-06-04 17:18:03.041898	ec9a7cc3-46a0-487c-a267-9899aeb1f118	USER_CREATED	Usuário com o email 'fedendo@gmail.com' foi criado com sucesso	fedendo@gmail.com
2026-06-04 17:25:19.034589	7142d316-4761-4c81-9ee8-28eff60d4e78	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-04 17:31:28.983718	481b5b16-7eb2-4bc6-a9c7-1c375c4743ff	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-04 17:33:01.974134	3a5b2903-b79c-4fd8-8004-77dd2db820ee	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-04 17:35:18.918299	4c45351f-ec14-420c-b314-e8cc77d3a527	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-04 18:27:38.001637	a29c9aa1-86f1-4698-8fd9-57bc8ed589b2	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 6 de 5 | Data/hora: 2026-06-04T18:27:38.001636600	Wilson.tech@gmail.com
2026-06-04 18:27:38.047326	521bf972-93f3-4d10-bca7-48b93069c9ca	LOGIN_BLOCKED	Usuário Wilson atingiu 5 falhas de autenticação consecutivas no dia | Conta bloqueada por 10 minutos | Data/hora: 2026-06-04T18:27:38.047325900	Wilson.tech@gmail.com
2026-06-04 18:27:44.019587	c28a74b8-5e31-4582-9fc5-b02eff348ab6	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 18:27:54.05683	a2e29083-0ee1-4075-b0a3-eac985796337	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 18:28:02.424675	7ba0642c-ac23-4cdc-ae79-4082c7912483	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-04 18:28:12.790576	ab71dd29-2381-4fa1-a131-84854465f2c0	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-04 18:28:35.861946	7205346f-2a83-438d-b95c-14807f4b8127	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-04 18:29:32.745427	de431fb0-32f8-4084-b517-47a747393b76	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-04 18:30:51.791797	dcb22b85-2e4d-4e8c-938d-d311cd7d5bfa	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 7 minuto(s)	Wilson.tech@gmail.com
2026-06-04 18:33:03.637513	084abc5c-9be9-4a03-b767-509acc719713	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-04 18:41:24.132701	0ba5d9c7-bb95-471a-b3f9-23f02ef263c7	TICKET_CREATED	Chamado criado: 'dwadwa' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-04 18:41:33.023128	d63792c9-6c0c-47dd-b50d-db1ef7b4d3ae	TICKET_CREATED	Chamado criado: 'dwadaw' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-04 18:42:18.579527	6af34524-7aaa-44f2-89b8-8c30ec43d1ac	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-04 18:44:18.914166	85adac92-154a-42b3-bdb2-753eb556af0b	LOGIN_FAILED	Senha incorreta para o usuário: WilsonAdmin | Tentativa 1 de 5 | Data/hora: 2026-06-04T18:44:18.914166200	admin@wilson.com
2026-06-04 18:44:21.280777	582ccc9d-b768-49e5-b382-b9b212160ef6	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-04 18:48:01.805747	23e7c5ab-8da2-4fc7-9c26-124f3b617664	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-04 19:01:08.200032	b788d89b-0221-421e-875b-3ec795299224	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-04 19:01:20.965427	b58995c5-d6da-42c9-8b8c-af0602ecb803	TICKET_CREATED	Chamado criado: 'sw' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-04 19:18:33.676077	666c61ee-ad26-43b8-9605-900bf5f515b6	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-04 19:32:23.63326	ea71ba66-2a99-44c0-9c1b-ab3888f49fbd	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-04 19:59:03.773029	be070535-141c-43f4-a8c1-a9ca787f89dc	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-04 20:36:48.14072	bfd7fe2a-22a5-4c46-bb2a-d9cee508c7b1	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Wilson	Wilson.tecnico@gmail.com
2026-06-04 20:45:27.592095	75330a64-ec47-4624-9f5b-b97519ce8a41	LOGIN_FAILED	Senha incorreta para o usuário: WilsonAdmin | Tentativa 1 de 5 | Data/hora: 2026-06-04T20:45:27.591088100	admin@wilson.com
2026-06-04 20:45:33.052796	6f7c50c1-1acc-40b3-afec-45a62a99c6db	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-04 20:47:40.066872	9d514bad-067d-46f8-920c-17790577fd8a	LOGIN_FAILED	Tentativa de login com email não cadastrado: Wilson.Tecnico@gmail.com	Wilson.Tecnico@gmail.com
2026-06-04 20:47:44.770782	991aca81-fe7d-47b0-b7fd-5bc1e4b4220f	LOGIN_FAILED	Tentativa de login com email não cadastrado: Wilson.Tecnico@gmail.com	Wilson.Tecnico@gmail.com
2026-06-04 20:47:57.125966	2da18148-9005-44f5-ba27-218054a82008	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Wilson	Wilson.tecnico@gmail.com
2026-06-04 21:08:32.465918	14a5a6cf-0099-4bcd-81cf-c0798fbe9187	TICKET_CREATED	Chamado criado: 'dwadwa' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-04 21:08:48.627985	22a954b0-8f59-4158-9420-18db6fcc0f1a	TICKET_STARTED	Atendimento iniciado para o chamado 'dwadwa'	Sistema
2026-06-04 21:08:52.226406	83d168c8-70be-4306-b43d-81cf10c3490a	TICKET_STARTED	Atendimento iniciado para o chamado 'dwadwa'	Sistema
2026-06-04 21:10:51.973001	f4936f91-c611-4ba4-9775-33a6cbb0ff7f	TICKET_CREATED	Chamado criado: 'dwadawdwa' | Categoria: NETWORK | Prioridade: MEDIUM	Fedendo
2026-06-05 09:16:24.574499	267ecad0-7030-4344-adb4-d6a2d58bde54	LOGIN_FAILED	Tentativa de login com email não cadastrado: wilson.tech@gmail.com	wilson.tech@gmail.com
2026-06-05 09:16:34.836549	2c8ca282-047b-4974-bd79-9b4ab664d1ea	LOGIN_FAILED	Tentativa de login com email não cadastrado: wilson.tech@gmail.com	wilson.tech@gmail.com
2026-06-05 09:16:38.639649	20c349a2-71c2-4f5a-8edc-53ffcd3e08d8	LOGIN_FAILED	Tentativa de login com email não cadastrado: wilson.tech@gmail.com	wilson.tech@gmail.com
2026-06-05 09:16:48.067855	20c97f9f-07cf-416f-b57c-fcad22e6ebff	LOGIN_FAILED	Senha incorreta para o usuário: Wilson | Tentativa 7 de 5 | Data/hora: 2026-06-05T09:16:48.066854800	Wilson.tech@gmail.com
2026-06-05 09:16:57.949355	4bda8ea2-845c-4d12-a5c5-c3ce6b9b1708	LOGIN_FAILED	Tentativa de login em conta bloqueada. Usuário: Wilson | Desbloqueio em 10 minuto(s)	Wilson.tech@gmail.com
2026-06-05 09:17:05.550701	68da1e83-61ed-4842-8175-68a51e16b6f2	LOGIN_FAILED	Senha incorreta para o usuário: Fedendo | Tentativa 1 de 5 | Data/hora: 2026-06-05T09:17:05.550700600	fedendo@gmail.com
2026-06-05 09:17:11.790024	90c7c5e9-043d-4eec-8b25-35077af596a9	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-05 09:18:00.115044	55724231-3a26-40d0-84bc-62c5ee7f54c9	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Wilson	Wilson.tecnico@gmail.com
2026-06-05 09:56:03.900201	f5e6a8d7-e59a-4db0-839a-6aa48c54201d	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Fedendo	fedendo@gmail.com
2026-06-05 09:56:12.459246	06de60cb-ba0d-4257-b610-bf324a629c9c	TICKET_CREATED	Chamado criado: 'dwadwa' | Categoria: SOFTWARE | Prioridade: MEDIUM	Fedendo
2026-06-05 10:02:50.675889	62c208b2-650b-4d26-8be7-43c0fa26596e	TICKET_CREATED	Chamado criado: 'oi' | Categoria: SOFTWARE | Prioridade: MEDIUM	Fedendo
2026-06-05 10:26:52.450914	075a31b8-b7f4-4744-bf1e-4948c3dd80b1	TICKET_CREATED	Chamado criado: 'swswsw' | Categoria: null | Prioridade: MEDIUM	Fedendo
2026-06-05 10:28:44.809207	562c9724-8a62-4829-ac23-fdc174410efb	TICKET_CREATED	Chamado criado: 'oi2' | Categoria: NETWORK | Prioridade: LOW	Fedendo
2026-06-05 10:30:51.427325	ff71f7b9-0fcc-4b50-a215-ab2206d8937c	TICKET_CREATED	Chamado criado: 'adwa' | Categoria: HARDWARE | Prioridade: HIGH	Fedendo
2026-06-05 10:45:03.829396	def7ecc2-6074-4e79-9ec6-61c27725cf3e	TICKET_ASSIGNED	Técnico 'Wilson' assumiu o chamado 'sw' do cliente 'Fedendo'	Wilson
2026-06-05 10:45:41.502511	ef54fba3-2d85-4795-a4c2-4dd7c8a71e4f	TICKET_ASSIGNED	Técnico 'Wilson' assumiu o chamado 'oi2' do cliente 'Fedendo'	Wilson
2026-06-05 12:02:41.641298	0f2fa8ed-e9f3-4977-89cd-6c1c6ee65831	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Wilson	Wilson.tecnico@gmail.com
2026-06-05 12:24:48.981192	69d006a0-e0f3-4078-ba71-7d0647514816	TICKET_STARTED	Atendimento iniciado para o chamado 'sw'	Wilson
2026-06-05 12:24:51.191499	e6a9a5d4-da69-4df1-9b49-808f07585d9a	TICKET_STARTED	Atendimento iniciado para o chamado 'sw'	Wilson
2026-06-05 12:25:06.151831	b782c8e2-9de9-4a8a-a81e-dd5681c6ea56	TICKET_STARTED	Atendimento iniciado para o chamado 'sw'	Wilson
2026-06-05 12:47:46.796254	9f653aca-e1ac-433b-b051-d1d42e5c7ddc	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteFedendo	c9bcfb2e-8d60-424b-8326-0670a252da13
2026-06-05 12:48:19.848553	9e930942-91e2-4a23-9374-4f024a57b23a	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteFedendo	c9bcfb2e-8d60-424b-8326-0670a252da13
2026-06-05 12:48:25.134287	a9eee815-59d5-42ff-b297-86e3066e9ae7	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteFedendo	c9bcfb2e-8d60-424b-8326-0670a252da13
2026-06-05 12:48:26.742487	75fe7fbc-9c17-4d52-9161-5c3ab11f10db	TICKET_STARTED	Atendimento iniciado para o chamado 'oi2'	Wilson
2026-06-05 12:48:34.338152	b2efa104-4e4a-4a8b-aa67-9b4da376651d	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteFedendo	c9bcfb2e-8d60-424b-8326-0670a252da13
2026-06-05 12:48:38.300146	50b98c22-e74f-41a3-9d71-a4250e6f6b91	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteFedendo	c9bcfb2e-8d60-424b-8326-0670a252da13
2026-06-05 12:50:50.727671	981d32a3-2df4-4045-887f-55ae7c390cce	TICKET_ASSIGNED	Técnico 'Wilson' assumiu o chamado 'dawdaw' do cliente 'Wilson'	Wilson
2026-06-05 12:51:12.035768	dcef4405-e068-49c1-8bf9-6f92e5d882a9	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteWilson	94ea8f43-f796-428c-9463-700800eea021
2026-06-05 12:51:18.9038	e0a36840-4881-460f-8688-846f21b1ae6d	TICKET_STARTED	Atendimento iniciado para o chamado 'dawdaw'	Wilson
2026-06-05 12:51:21.897433	d16545a4-e7b6-4ac1-86b0-ec658eccf562	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteWilson	94ea8f43-f796-428c-9463-700800eea021
2026-06-05 12:51:27.561871	9b000b65-f706-477f-bf2f-75c7a5fd70a2	TICKET_FINISHED	Chamado 'dawdaw' finalizado. Valor calculado: R$ 180.0000	Wilson
2026-06-05 12:54:02.296771	003740c2-7ecf-41a3-8bc6-def57a3851c0	TICKET_STARTED	Atendimento iniciado para o chamado 'dwadwa'	Sistema
2026-06-05 12:54:15.201315	00333e9f-2925-476e-b7b0-8d6473cb22db	TICKET_FINISHED	Chamado 'oi2' finalizado. Valor calculado: R$ 150.0000	Wilson
2026-06-05 13:04:17.603862	7b2df114-eed0-4e36-a2e7-d36972bd13cd	TICKET_STARTED	Atendimento iniciado para o chamado 'oi2'	Wilson
2026-06-05 13:05:05.422508	60837fb5-b346-49af-bcf3-32d9b2d8155c	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteFedendo	5e9ef85c-0638-4d5a-a19a-a7b3e8d2adaa
2026-06-05 13:05:26.585004	b93e346f-5cb5-486d-bd95-0e67a72ccd5f	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteFedendo	5e9ef85c-0638-4d5a-a19a-a7b3e8d2adaa
2026-06-05 13:05:52.307817	5f6c391d-bb26-4514-b93c-a1ecfafef5f7	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteFedendo	5e9ef85c-0638-4d5a-a19a-a7b3e8d2adaa
2026-06-05 13:09:08.574926	1dabe832-604a-42a8-afe9-0c82c64e26ca	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteFedendo	c9bcfb2e-8d60-424b-8326-0670a252da13
2026-06-05 13:09:45.880805	3bf287c9-ddfb-42bf-8b09-2ae8ba0185e0	HISTORY_UPDATED	O técnico Wilson atualizou o chamado do clienteFedendo	c9bcfb2e-8d60-424b-8326-0670a252da13
2026-06-05 13:09:51.343261	53fcf8c4-f905-4886-8238-dce366f3f42f	TICKET_FINISHED	Chamado 'oi2' finalizado. Valor calculado: R$ 150.0000	Wilson
2026-06-05 13:10:05.911952	b7ad6600-de3d-4f8e-87f6-e042689ffcd9	TICKET_FINISHED_PAYMENT_CANCELED	Não pode alterar chamados já finalizado, concluidos ou aguardando pagamentos	c9bcfb2e-8d60-424b-8326-0670a252da13
2026-06-05 13:17:15.65984	8dbb64c4-4134-4692-8ad2-9f8a9ecc9cf8	TICKET_ASSIGNED	Técnico 'Wilson' assumiu o chamado 'adwa' do cliente 'Fedendo'	Wilson
2026-06-05 13:23:13.6177	42634513-d8d8-4e4b-aff5-216b03c61aa0	USER_CREATED	Usuário com o email 'vicente.tecnico@gmail.com' foi criado com sucesso	vicente.tecnico@gmail.com
2026-06-05 13:24:37.688729	3c841dd6-ae1e-48ac-98ee-c9564f777e2d	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
2026-06-05 13:26:53.247045	18b50328-a433-46cf-8fbb-2341bcd969c2	USER_CREATED	Técnico com o email 'vicente.tech@gmail.com' foi criado com sucesso pelo Admin	vicente.tech@gmail.com
2026-06-05 13:27:19.587941	743a53db-568e-4f05-ada3-3a61fb2cbe93	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Vicente	vicente.tech@gmail.com
2026-06-05 13:31:25.906983	f85357bd-b695-4b50-aa4e-03aba535f5d9	TICKET_ASSIGNED	Técnico 'Vicente' assumiu o chamado 'swswsw' do cliente 'Fedendo'	Vicente
2026-06-05 13:34:31.300931	b91342e5-bbdd-45ad-8d1f-ccfc1f8837c8	TICKET_STARTED	Atendimento iniciado para o chamado 'swswsw'	Vicente
2026-06-05 13:34:34.056792	ae40a58f-43a5-471f-a22a-59388f1f42b3	HISTORY_UPDATED	O técnico Vicente atualizou o chamado do clienteFedendo	30e896ed-b6a9-4fdc-af48-0bffc23bfa42
2026-06-05 13:45:11.559084	eeae4991-bf56-4fff-bdbd-434cf066e520	HISTORY_UPDATED	O técnico Vicente atualizou o chamado do clienteFedendo	30e896ed-b6a9-4fdc-af48-0bffc23bfa42
2026-06-05 13:45:47.761604	9886e93c-b57d-4bc4-b9f6-6a4c76be2f0e	HISTORY_UPDATED	O técnico Vicente atualizou o chamado do clienteFedendo	ad4644be-2009-448d-b945-3fb77b36b23b
2026-06-05 13:45:52.436977	8c795efb-caec-452b-abfc-7a584dff25b7	HISTORY_UPDATED	O técnico Vicente atualizou o chamado do clienteFedendo	ad4644be-2009-448d-b945-3fb77b36b23b
2026-06-05 13:48:34.304634	ea96b094-e416-445d-b85f-d95ed24f1949	HISTORY_UPDATED	O técnico Vicente atualizou o chamado do clienteFedendo	30e896ed-b6a9-4fdc-af48-0bffc23bfa42
2026-06-05 13:48:58.465292	6af9d136-720f-45ee-bb99-844b151b45e1	HISTORY_UPDATED	O técnico Vicente atualizou o chamado do clienteFedendo	30e896ed-b6a9-4fdc-af48-0bffc23bfa42
2026-06-05 13:49:19.859192	d409552e-9925-4445-867a-efcea34740d0	HISTORY_UPDATED	O técnico Vicente atualizou o chamado do clienteFedendo	ad4644be-2009-448d-b945-3fb77b36b23b
2026-06-05 13:49:28.993252	6cd8c67a-f083-46ff-bab2-54cf0103922b	TICKET_STARTED	Atendimento iniciado para o chamado 'adwa'	Wilson
2026-06-05 13:49:32.398868	3e69cb70-7b1d-4901-810d-eda3134b8cc5	HISTORY_UPDATED	O técnico Vicente atualizou o chamado do clienteFedendo	ad4644be-2009-448d-b945-3fb77b36b23b
2026-06-05 14:50:54.726802	dae59759-e7f9-4f12-bda1-b2f677e81aa9	LOGIN_FAILED	Tentativa de login com email não cadastrado: wilson.tecnico@gmail.com	wilson.tecnico@gmail.com
2026-06-05 14:51:02.409344	eebc5c55-5ecc-4c2a-ae43-89f18b0ab69b	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: Wilson	Wilson.tecnico@gmail.com
2026-06-05 14:53:30.865878	d19a3914-4255-4103-afef-b65c95e131e1	LOGIN_SUCCESS	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.customer (id) FROM stdin;
03ea47a2-a6c1-404d-8f74-9cdc82653c2b
d3300b7a-e0b8-4267-905d-7351bbef0d40
4468844c-1e88-41e5-a458-52af2df47a5a
1b87ff8d-b313-4c60-b1b7-f8869147c1d5
35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709
04b7cfc8-5ddc-49e9-9ee2-60325eca8d8e
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
0	\N	\N	7eb05674-29ab-4b75-864c-05d85633cbe1	Jotta.tech@gmail.com	Jottinha	$2a$10$10g4moDPVgH8vWUPKoZ0hus23sEtbIUOGodAIfu6rtWKieTk7xz1O	123121	TECHNICAL
0	2026-06-04 17:18:02.817322	\N	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	fedendo@gmail.com	Fedendo	$2a$10$sJ3MtQHUHd/DFw4Na4Btr.0qNHcLN6BQLNze8rzyL1j77gXQRe9Xa	N/A	CUSTOMER
0	2026-06-05 13:23:13.387925	\N	04b7cfc8-5ddc-49e9-9ee2-60325eca8d8e	vicente.tecnico@gmail.com	Vicente	$2a$10$paG6/qujrCgJECQ4RCBsZu98Q1X42o7hPLjWXn7CAtrIfqywmOdpu	N/A	CUSTOMER
0	\N	\N	e6fe3d5d-44b8-4cad-810f-7d14a5a66246	vicente.tech@gmail.com	Vicente	$2a$10$vZQ.cCPk7ULvNBOr2518MO.6x4PPk6iz43Ke07pXCw6ZtmFLAlalG	31231	TECHNICAL
5	2026-06-04 14:42:13.539783	2026-06-04 15:06:41.926925	d3300b7a-e0b8-4267-905d-7351bbef0d40	dwadwa@gmail.com	dwadwa'	$2a$10$EVt35a6gLm.VKddk9OBdNeK45yP1XhI1c.wOhz4J1pArGtcYINOZK	N/A	CUSTOMER
0	2026-06-04 15:17:29.559903	\N	1b87ff8d-b313-4c60-b1b7-f8869147c1d5	dawdwa@dadwa	dwadwa	$2a$10$rNhBJwhlxZuJ8pLrmZB7Le8HbMMtfF8/wgtSUo.ccFvfQht35HKq6	dawdawdw	CUSTOMER
0	\N	\N	4df23d95-5fc2-4d2e-bc56-72655104a504	Wilson.tecnico@gmail.com	Wilson	$2a$10$ek2OAb/h0PG1aWStQZiKZ.TcLTPEKaVGDQV1mkPnpUKr9kH/X16jW	23131321	TECHNICAL
4	2026-05-26 16:02:29.42216	\N	03ea47a2-a6c1-404d-8f74-9cdc82653c2b	Wilson.qdop@gmail.com	wilson	$2a$10$z4iDMZW7u1rz5C8BEZyhRu7iOMrZ6vHSQyXgHeQXOo13mAuF3rx3y	1231231	CUSTOMER
0	\N	\N	9260e8c2-0066-4ad8-ab09-6809db5c82b0	admin@wilson.com	WilsonAdmin	$2a$10$Ma38TDLC.mzdcerdqBOQXOQFRCs8Pjbnu9knwZVKEHK2HTE6V.7JS	\N	ADMIN
7	2026-06-04 14:57:36.076459	2026-06-05 09:26:48.120943	4468844c-1e88-41e5-a458-52af2df47a5a	Wilson.tech@gmail.com	Wilson	$2a$10$Mhy9pOi2PdfrGIJI5lxmjuZU41GONAl/9MP5K0YcS0tXY9z69EIia	N/A	CUSTOMER
\.


--
-- Data for Name: technical; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.technical (id) FROM stdin;
7eb05674-29ab-4b75-864c-05d85633cbe1
4df23d95-5fc2-4d2e-bc56-72655104a504
e6fe3d5d-44b8-4cad-810f-7d14a5a66246
\.


--
-- Data for Name: ticket; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.ticket (base_hourly_rate, payment_confirmed, value, created_at, finished_at, started_at, customer_id, id, technical_id, category, description, priority, status, title) FROM stdin;
100.00	t	156.00	2026-05-26 16:03:15.874833	2026-05-26 16:27:39.9566	2026-05-26 16:24:00.662544	03ea47a2-a6c1-404d-8f74-9cdc82653c2b	e9fb4c6d-2b00-4929-b1f8-204733ce2b4b	7eb05674-29ab-4b75-864c-05d85633cbe1	SOFTWARE	Meu gerenciador de tarefas está abrindo e fechando sozinho! Acho que é algum vírus	MEDIUM	COMPLETED	Meu pc está com vírus
100.00	f	\N	2026-06-04 18:41:33.014896	\N	\N	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	2d3da9fb-510b-40ef-b5f4-a3e1749c9e39	\N	NETWORK	dwasawsdadwa	MEDIUM	OPEN	dwadaw
100.00	f	\N	2026-06-04 21:08:32.447985	\N	2026-06-04 21:08:52.215438	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	28252fe5-074d-42ee-99b3-fb70d50a8bdc	\N	NETWORK	dwadwadwa	MEDIUM	IN_PROGRESS	dwadwa
100.00	f	\N	2026-06-04 21:10:51.796241	\N	\N	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	4326fc52-df2b-463a-8461-98dc7bfb137f	\N	NETWORK	dwadwa	MEDIUM	OPEN	dwadawdwa
100.00	f	\N	2026-06-05 09:56:12.421769	\N	\N	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	bdf891f4-93dc-415e-aeb5-294632642adc	\N	SOFTWARE	adadwdaw	MEDIUM	OPEN	dwadwa
100.00	f	\N	2026-06-05 10:02:50.644332	\N	\N	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	dec70439-9a45-45ce-a1ef-5c675307a8e5	\N	SOFTWARE	oioi	MEDIUM	OPEN	oi
100.00	f	\N	2026-06-04 19:01:20.949855	\N	2026-06-05 12:25:06.141982	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	5e9ef85c-0638-4d5a-a19a-a7b3e8d2adaa	4df23d95-5fc2-4d2e-bc56-72655104a504	NETWORK	dwa	MEDIUM	IN_PROGRESS	sw
100.00	f	180.00	2026-06-04 15:14:38.07288	2026-06-05 12:51:27.531657	2026-06-05 12:51:18.831815	4468844c-1e88-41e5-a458-52af2df47a5a	94ea8f43-f796-428c-9463-700800eea021	4df23d95-5fc2-4d2e-bc56-72655104a504	NETWORK	dwadwadwa	MEDIUM	PAYMENT_PENDING	dawdaw
100.00	f	\N	2026-06-04 18:41:24.026675	\N	2026-06-05 12:54:02.059219	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	a7ab4005-d48b-4328-b056-2cf805cc67f9	\N	NETWORK	dwadaw	MEDIUM	IN_PROGRESS	dwadwa
100.00	f	150.00	2026-06-05 10:28:44.663932	2026-06-05 13:09:51.310869	2026-06-05 13:04:17.584683	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	c9bcfb2e-8d60-424b-8326-0670a252da13	4df23d95-5fc2-4d2e-bc56-72655104a504	NETWORK	wsw	LOW	PAYMENT_PENDING	oi2
100.00	f	\N	2026-06-05 10:26:52.431923	\N	2026-06-05 13:34:31.01553	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	30e896ed-b6a9-4fdc-af48-0bffc23bfa42	e6fe3d5d-44b8-4cad-810f-7d14a5a66246	\N	dwadwa	MEDIUM	IN_PROGRESS	swswsw
100.00	f	\N	2026-06-05 10:30:51.417235	\N	2026-06-05 13:49:28.299303	35b295ab-3a0e-4d2a-b4eb-7cbde0e3a709	ad4644be-2009-448d-b945-3fb77b36b23b	4df23d95-5fc2-4d2e-bc56-72655104a504	HARDWARE	dwadwadaw	HIGH	IN_PROGRESS	adwa
\.


--
-- Data for Name: ticket_history; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.ticket_history (change_date, id, ticket_id, comment, status_changed_to, update_by, new_status, old_status) FROM stdin;
2026-05-26 16:25:39.824738	0d6969b5-bc00-40ab-8ce7-a7e4edaea756	e9fb4c6d-2b00-4929-b1f8-204733ce2b4b	Nosso técnico começou a dar a bunda	\N	Jottinha	IN_PROGRESS	IN_PROGRESS
2026-05-26 16:25:54.627098	e46c1334-29f5-41ce-91ad-7eaf90ff045b	e9fb4c6d-2b00-4929-b1f8-204733ce2b4b	Ele foi a casa do cliente sentar no pau	\N	Jottinha	IN_PROGRESS	IN_PROGRESS
2026-06-05 12:47:46.765512	b9930d16-4284-4e15-8101-97835950dda7	c9bcfb2e-8d60-424b-8326-0670a252da13	\N	\N	Wilson	ASSIGNED	ASSIGNED
2026-06-05 12:48:19.824704	12229285-ba09-4331-aec5-9b027fe00edc	c9bcfb2e-8d60-424b-8326-0670a252da13	\N	\N	Wilson	ASSIGNED	ASSIGNED
2026-06-05 12:48:24.886789	ba996020-7de1-4d2e-92b9-399603b0b130	c9bcfb2e-8d60-424b-8326-0670a252da13	\N	\N	Wilson	ASSIGNED	ASSIGNED
2026-06-05 12:48:34.207694	d0020282-3137-4d0d-8e03-1a8b96daa11a	c9bcfb2e-8d60-424b-8326-0670a252da13	\N	\N	Wilson	IN_PROGRESS	IN_PROGRESS
2026-06-05 12:48:37.908634	c8cc5192-74f4-4229-bd41-5fe6aaaa1e4a	c9bcfb2e-8d60-424b-8326-0670a252da13	\N	\N	Wilson	IN_PROGRESS	IN_PROGRESS
2026-06-05 12:51:12.02402	e634ecf4-b7c5-4250-827b-ab5a1a0de55d	94ea8f43-f796-428c-9463-700800eea021	\N	\N	Wilson	ASSIGNED	ASSIGNED
2026-06-05 12:51:21.686497	3ef14671-1afb-47cd-9c9a-bf101b3ecf97	94ea8f43-f796-428c-9463-700800eea021	\N	\N	Wilson	IN_PROGRESS	IN_PROGRESS
2026-06-05 13:05:05.409116	ece27891-59eb-4129-8640-61567a5ce97f	5e9ef85c-0638-4d5a-a19a-a7b3e8d2adaa	\N	\N	Wilson	IN_PROGRESS	IN_PROGRESS
2026-06-05 13:05:26.573411	017848c6-c5f9-4e8c-989e-c8c1d5fa7421	5e9ef85c-0638-4d5a-a19a-a7b3e8d2adaa	\N	\N	Wilson	IN_PROGRESS	IN_PROGRESS
2026-06-05 13:05:52.297399	a1308c58-2554-418b-859a-bb1e3f4d020a	5e9ef85c-0638-4d5a-a19a-a7b3e8d2adaa	\N	\N	Wilson	IN_PROGRESS	IN_PROGRESS
2026-06-05 13:09:08.553971	c2943deb-de89-4a2a-bb36-4fffb9d93c50	c9bcfb2e-8d60-424b-8326-0670a252da13	\N	\N	Wilson	IN_PROGRESS	IN_PROGRESS
2026-06-05 13:09:45.826594	29cb2636-22b9-489b-8e91-faad6781b255	c9bcfb2e-8d60-424b-8326-0670a252da13	\N	\N	Wilson	IN_PROGRESS	IN_PROGRESS
2026-06-05 13:34:33.55985	c70a3ed7-3c27-4c78-a223-fc75f98ff17c	30e896ed-b6a9-4fdc-af48-0bffc23bfa42	DWADWA	\N	Vicente	IN_PROGRESS	IN_PROGRESS
2026-06-05 13:45:11.483066	2c5fc502-7568-484a-b215-89ab3b0d76d1	30e896ed-b6a9-4fdc-af48-0bffc23bfa42	dwadwa	\N	Vicente	IN_PROGRESS	IN_PROGRESS
2026-06-05 13:45:46.574533	a59c296e-74f4-4df8-abcd-10299bd74f32	ad4644be-2009-448d-b945-3fb77b36b23b	wsw	\N	Vicente	ASSIGNED	ASSIGNED
2026-06-05 13:45:52.427374	b6b884fd-2335-4bbd-a840-dfc734fa8bb1	ad4644be-2009-448d-b945-3fb77b36b23b	wsw	\N	Vicente	ASSIGNED	ASSIGNED
2026-06-05 13:48:34.068238	4dd0b195-6846-4b65-980b-eadebf0b548b	30e896ed-b6a9-4fdc-af48-0bffc23bfa42	dwdw	\N	Vicente	IN_PROGRESS	IN_PROGRESS
2026-06-05 13:48:58.44421	cfb17f8b-8587-472d-8221-7602a8e2433d	30e896ed-b6a9-4fdc-af48-0bffc23bfa42	wdw	\N	Vicente	IN_PROGRESS	IN_PROGRESS
2026-06-05 13:49:19.82551	fbb9b23f-fe7f-4130-a81c-e06ce2ea736c	ad4644be-2009-448d-b945-3fb77b36b23b	dwadawdawdwa	\N	Vicente	ASSIGNED	ASSIGNED
2026-06-05 13:49:32.331529	2574dd4e-42f6-483c-b98b-2e9c5a2d4a87	ad4644be-2009-448d-b945-3fb77b36b23b	dwadwa	\N	Vicente	IN_PROGRESS	IN_PROGRESS
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

\unrestrict Q1E8hREjfj7aNEM5x0VonFw83thz7kbqhD70GrMZdcgNvydzQgHXCOd1r6NF6GZ

