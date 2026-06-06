--
-- PostgreSQL database dump
--

\restrict Eg0Ohav2ckDqh9CsIyx4FK8ab2IrR9BuGE9qTwJ7JF4Ou4qE51E1wymmoJmOSTU

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
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.customer (id) FROM stdin;
03ea47a2-a6c1-404d-8f74-9cdc82653c2b
d3300b7a-e0b8-4267-905d-7351bbef0d40
4468844c-1e88-41e5-a458-52af2df47a5a
1b87ff8d-b313-4c60-b1b7-f8869147c1d5
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
0	2026-05-26 16:02:29.42216	\N	03ea47a2-a6c1-404d-8f74-9cdc82653c2b	Wilson.qdop@gmail.com	wilson	$2a$10$z4iDMZW7u1rz5C8BEZyhRu7iOMrZ6vHSQyXgHeQXOo13mAuF3rx3y	1231231	CUSTOMER
0	\N	\N	7eb05674-29ab-4b75-864c-05d85633cbe1	Jotta.tech@gmail.com	Jottinha	$2a$10$10g4moDPVgH8vWUPKoZ0hus23sEtbIUOGodAIfu6rtWKieTk7xz1O	123121	TECHNICAL
5	2026-06-04 14:42:13.539783	2026-06-04 15:06:41.926925	d3300b7a-e0b8-4267-905d-7351bbef0d40	dwadwa@gmail.com	dwadwa'	$2a$10$EVt35a6gLm.VKddk9OBdNeK45yP1XhI1c.wOhz4J1pArGtcYINOZK	N/A	CUSTOMER
0	2026-06-04 14:57:36.076459	\N	4468844c-1e88-41e5-a458-52af2df47a5a	Wilson.tech@gmail.com	Wilson	$2a$10$Mhy9pOi2PdfrGIJI5lxmjuZU41GONAl/9MP5K0YcS0tXY9z69EIia	N/A	CUSTOMER
0	2026-06-04 15:17:29.559903	\N	1b87ff8d-b313-4c60-b1b7-f8869147c1d5	dawdwa@dadwa	dwadwa	$2a$10$rNhBJwhlxZuJ8pLrmZB7Le8HbMMtfF8/wgtSUo.ccFvfQht35HKq6	dawdawdw	CUSTOMER
0	\N	\N	9260e8c2-0066-4ad8-ab09-6809db5c82b0	admin@wilson.com	WilsonAdmin	$2a$10$Ma38TDLC.mzdcerdqBOQXOQFRCs8Pjbnu9knwZVKEHK2HTE6V.7JS	\N	ADMIN
0	\N	\N	4df23d95-5fc2-4d2e-bc56-72655104a504	Wilson.tecnico@gmail.com	Wilson	$2a$10$ek2OAb/h0PG1aWStQZiKZ.TcLTPEKaVGDQV1mkPnpUKr9kH/X16jW	23131321	TECHNICAL
\.


--
-- Data for Name: technical; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.technical (id) FROM stdin;
7eb05674-29ab-4b75-864c-05d85633cbe1
4df23d95-5fc2-4d2e-bc56-72655104a504
\.


--
-- Data for Name: ticket; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.ticket (base_hourly_rate, payment_confirmed, value, created_at, finished_at, started_at, customer_id, id, technical_id, category, description, priority, status, title) FROM stdin;
100.00	t	156.00	2026-05-26 16:03:15.874833	2026-05-26 16:27:39.9566	2026-05-26 16:24:00.662544	03ea47a2-a6c1-404d-8f74-9cdc82653c2b	e9fb4c6d-2b00-4929-b1f8-204733ce2b4b	7eb05674-29ab-4b75-864c-05d85633cbe1	SOFTWARE	Meu gerenciador de tarefas está abrindo e fechando sozinho! Acho que é algum vírus	MEDIUM	COMPLETED	Meu pc está com vírus
100.00	f	\N	2026-06-04 15:14:38.07288	\N	\N	4468844c-1e88-41e5-a458-52af2df47a5a	94ea8f43-f796-428c-9463-700800eea021	\N	NETWORK	dwadwadwa	MEDIUM	OPEN	dawdaw
\.


--
-- Data for Name: ticket_history; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.ticket_history (change_date, id, ticket_id, comment, status_changed_to, update_by, new_status, old_status) FROM stdin;
2026-05-26 16:25:39.824738	0d6969b5-bc00-40ab-8ce7-a7e4edaea756	e9fb4c6d-2b00-4929-b1f8-204733ce2b4b	Nosso técnico começou a dar a bunda	\N	Jottinha	IN_PROGRESS	IN_PROGRESS
2026-05-26 16:25:54.627098	e46c1334-29f5-41ce-91ad-7eaf90ff045b	e9fb4c6d-2b00-4929-b1f8-204733ce2b4b	Ele foi a casa do cliente sentar no pau	\N	Jottinha	IN_PROGRESS	IN_PROGRESS
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

\unrestrict Eg0Ohav2ckDqh9CsIyx4FK8ab2IrR9BuGE9qTwJ7JF4Ou4qE51E1wymmoJmOSTU

