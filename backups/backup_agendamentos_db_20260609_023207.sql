--
-- PostgreSQL database dump
--

\restrict i0l4QMMXSb4nNaFTgvvBf9P5zkSZPq6qKXwhjJLeK3YbqqcK8fKZh27le5GZctx

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
ALTER TABLE IF EXISTS ONLY public.person DROP CONSTRAINT IF EXISTS ukfwmwi44u55bo4rvwsv0cln012;
ALTER TABLE IF EXISTS ONLY public.ticket DROP CONSTRAINT IF EXISTS ticket_pkey;
ALTER TABLE IF EXISTS ONLY public.ticket_history DROP CONSTRAINT IF EXISTS ticket_history_pkey;
ALTER TABLE IF EXISTS ONLY public.technical DROP CONSTRAINT IF EXISTS technical_pkey;
ALTER TABLE IF EXISTS ONLY public.person DROP CONSTRAINT IF EXISTS person_pkey;
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
    id uuid NOT NULL,
    action character varying(255) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
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
    id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    hashed_password character varying(255) NOT NULL,
    person_id uuid NOT NULL
);


ALTER TABLE public.password_history OWNER TO "Qdop";

--
-- Name: person; Type: TABLE; Schema: public; Owner: Qdop
--

CREATE TABLE public.person (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    email character varying(255),
    failed_login_attempts integer NOT NULL,
    locked_until timestamp(6) without time zone,
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
    id uuid NOT NULL,
    base_hourly_rate numeric(38,2),
    category character varying(255),
    created_at timestamp(6) without time zone,
    description character varying(255),
    finished_at timestamp(6) without time zone,
    payment_confirmed boolean NOT NULL,
    priority character varying(255),
    started_at timestamp(6) without time zone,
    status character varying(255),
    title character varying(255),
    value numeric(38,2),
    customer_id uuid,
    technical_id uuid,
    CONSTRAINT ticket_category_check CHECK (((category)::text = ANY (ARRAY[('HARDWARE'::character varying)::text, ('SOFTWARE'::character varying)::text, ('NETWORK'::character varying)::text]))),
    CONSTRAINT ticket_priority_check CHECK (((priority)::text = ANY (ARRAY[('LOW'::character varying)::text, ('MEDIUM'::character varying)::text, ('HIGH'::character varying)::text]))),
    CONSTRAINT ticket_status_check CHECK (((status)::text = ANY (ARRAY[('OPEN'::character varying)::text, ('COMPLETED'::character varying)::text, ('CANCELED'::character varying)::text, ('ASSIGNED'::character varying)::text, ('PAYMENT_PENDING'::character varying)::text, ('IN_PROGRESS'::character varying)::text])))
);


ALTER TABLE public.ticket OWNER TO "Qdop";

--
-- Name: ticket_history; Type: TABLE; Schema: public; Owner: Qdop
--

CREATE TABLE public.ticket_history (
    id uuid NOT NULL,
    change_date timestamp(6) without time zone,
    comment character varying(255),
    new_status character varying(255),
    old_status character varying(255),
    update_by character varying(255),
    ticket_id uuid,
    CONSTRAINT ticket_history_new_status_check CHECK (((new_status)::text = ANY (ARRAY[('OPEN'::character varying)::text, ('COMPLETED'::character varying)::text, ('CANCELED'::character varying)::text, ('ASSIGNED'::character varying)::text, ('PAYMENT_PENDING'::character varying)::text, ('IN_PROGRESS'::character varying)::text]))),
    CONSTRAINT ticket_history_old_status_check CHECK (((old_status)::text = ANY (ARRAY[('OPEN'::character varying)::text, ('COMPLETED'::character varying)::text, ('CANCELED'::character varying)::text, ('ASSIGNED'::character varying)::text, ('PAYMENT_PENDING'::character varying)::text, ('IN_PROGRESS'::character varying)::text])))
);


ALTER TABLE public.ticket_history OWNER TO "Qdop";

--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.admin (id) FROM stdin;
9eaeeb38-8f28-4534-a4e3-fbb429446bb8
\.


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.audit_log (id, action, created_at, description, target) FROM stdin;
b9889de7-6d04-4fd6-adc1-3fe00d742bfb	LOGIN_SUCCESS	2026-06-08 05:25:09.181213	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
b4737a94-ca05-4519-a803-b5daf75e2805	USER_CREATED	2026-06-08 05:39:44.29265	Usuário com o email 'fedendo@gmail.com' foi criado com sucesso	fedendo@gmail.com
a0f68633-291e-449b-b253-1be84345941e	LOGIN_SUCCESS	2026-06-08 05:39:59.558238	Login realizado com sucesso. Usuário: fedendo	fedendo@gmail.com
514b0c67-213a-4d45-a900-fa730e6280d7	TICKET_CREATED	2026-06-08 05:40:06.348519	Chamado criado: 'swsw' | Categoria: NETWORK | Prioridade: MEDIUM	fedendo
ee61db15-1a33-4150-b777-0deb928fb5ec	LOGIN_SUCCESS	2026-06-08 05:40:22.505977	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
c980c90b-9c57-4eb9-b27b-00a1c05c6643	USER_CREATED	2026-06-08 05:42:56.578099	Técnico com o email 'wilson.tech@gmail.com' foi criado com sucesso pelo Admin	wilson.tech@gmail.com
490130ca-08ae-46d2-b77b-6915c6ed74b0	LOGIN_SUCCESS	2026-06-08 05:43:15.694598	Login realizado com sucesso. Usuário: wilson	wilson.tech@gmail.com
99d224cc-fe97-4800-84c4-0b92f868d8e0	TICKET_ASSIGNED	2026-06-08 05:43:21.229102	Técnico 'wilson' assumiu o chamado 'swsw' do cliente 'fedendo'	wilson
c0c13143-3e98-462e-ac9a-8e27750dd60a	TICKET_VIEWED	2026-06-08 05:43:24.391808	Detalhes do chamado 'swsw' visualizados por wilson	wilson
884b25d6-80e8-4975-b719-614750d4a542	TICKET_VIEWED	2026-06-08 05:43:24.497906	Detalhes do chamado 'swsw' visualizados por wilson	wilson
9f274fa8-3d23-40d8-bcf6-d9df55a6610c	TICKET_VIEWED	2026-06-08 05:43:24.538252	Detalhes do chamado 'swsw' visualizados por wilson	wilson
949efbce-fdc3-4ae7-bc14-0bb197ea172e	TICKET_STARTED	2026-06-08 05:43:25.361104	Atendimento iniciado para o chamado 'swsw'	wilson
f5c79943-6935-42ad-bc3f-8036930f618b	TICKET_VIEWED	2026-06-08 05:43:25.386872	Detalhes do chamado 'swsw' visualizados por wilson	wilson
5dd474c0-a630-4bac-85ef-45f1d3e9ab1a	TICKET_VIEWED	2026-06-08 05:43:30.590855	Detalhes do chamado 'swsw' visualizados por wilson	wilson
2b970d74-a36b-41fa-9468-f86fcbcaadb5	TICKET_VIEWED	2026-06-08 05:43:30.94149	Detalhes do chamado 'swsw' visualizados por wilson	wilson
7ab24654-06e2-4086-8280-c3385f3490a1	TICKET_VIEWED	2026-06-08 05:43:30.986417	Detalhes do chamado 'swsw' visualizados por wilson	wilson
e280ffbe-9d30-4a39-9aae-0e44b194bf94	HISTORY_UPDATED	2026-06-08 05:43:33.654916	O técnico wilson atualizou o chamado do clientefedendo	4ff250c8-bbc8-4917-a5da-9b73642112fe
87665711-9c1f-4af4-9846-85d8a4817e97	TICKET_VIEWED	2026-06-08 05:43:33.682508	Detalhes do chamado 'swsw' visualizados por wilson	wilson
284165c9-021d-49ed-a12f-f5df7092c346	TICKET_VIEWED	2026-06-08 05:51:08.423284	Detalhes do chamado 'swsw' visualizados por wilson	wilson
7acde058-6d8d-45a8-911a-80bb20b072f3	TICKET_VIEWED	2026-06-08 05:51:08.448833	Detalhes do chamado 'swsw' visualizados por wilson	wilson
a6de2ee5-e96d-4a0e-b143-8335ad51a0a8	TICKET_VIEWED	2026-06-08 05:51:08.487395	Detalhes do chamado 'swsw' visualizados por wilson	wilson
6a774cb1-281c-43a5-a01d-07c6b33cc813	TICKET_VIEWED	2026-06-08 05:51:08.507304	Detalhes do chamado 'swsw' visualizados por wilson	wilson
57bec724-d248-484a-a19d-9e51606c7281	TICKET_VIEWED	2026-06-08 05:51:37.770545	Detalhes do chamado 'swsw' visualizados por wilson	wilson
fb227002-affd-4abf-b215-63fd58952e55	TICKET_VIEWED	2026-06-08 05:51:38.308226	Detalhes do chamado 'swsw' visualizados por wilson	wilson
3d269bc5-40c5-4e59-a783-95651fa4ee6c	TICKET_VIEWED	2026-06-08 05:51:38.558339	Detalhes do chamado 'swsw' visualizados por wilson	wilson
eafc71c2-a997-4a96-9522-9c78195421c8	TICKET_VIEWED	2026-06-08 05:51:38.582575	Detalhes do chamado 'swsw' visualizados por wilson	wilson
26c0bf66-53ad-42b8-bc50-6b242dd609f6	TICKET_VIEWED	2026-06-08 06:00:42.305725	Detalhes do chamado 'swsw' visualizados por wilson	wilson
087b20af-40e1-470c-b69d-56063d479c77	TICKET_VIEWED	2026-06-08 06:00:42.561364	Detalhes do chamado 'swsw' visualizados por wilson	wilson
060440bf-be9a-42dc-af2f-bd48cf4d6775	TICKET_VIEWED	2026-06-08 06:00:42.599066	Detalhes do chamado 'swsw' visualizados por wilson	wilson
fbf8f207-71a5-43c4-80cf-39b2eea6b3d7	TICKET_VIEWED	2026-06-08 06:00:42.625027	Detalhes do chamado 'swsw' visualizados por wilson	wilson
e179e62f-2031-4909-8b8f-b99fe20ebef1	TICKET_VIEWED	2026-06-08 06:00:55.247593	Detalhes do chamado 'swsw' visualizados por wilson	wilson
39cf399c-df73-4a77-96c6-cd4cb70af522	TICKET_VIEWED	2026-06-08 06:00:55.732505	Detalhes do chamado 'swsw' visualizados por wilson	wilson
bf1fe350-5645-44f0-b7f3-373185d922bc	TICKET_VIEWED	2026-06-08 06:00:55.762213	Detalhes do chamado 'swsw' visualizados por wilson	wilson
71a54274-bb01-4281-87e0-145800ad4eab	TICKET_VIEWED	2026-06-08 06:00:55.788891	Detalhes do chamado 'swsw' visualizados por wilson	wilson
3e351a14-68e1-4834-9e2a-5b11f602f960	TICKET_VIEWED	2026-06-08 06:03:05.942282	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
6847bf6b-7b0a-462d-a458-a424282da27c	TICKET_VIEWED	2026-06-08 06:03:06.091262	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
78275014-02ce-4d4b-a457-8dd2fc9431c8	TICKET_VIEWED	2026-06-08 06:03:06.152177	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
14b847a9-e784-4b8a-803c-810286033f52	TICKET_VIEWED	2026-06-08 06:03:06.228299	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
21a54ee7-3786-4ffd-90b1-37c4f8dbc41e	TICKET_VIEWED	2026-06-08 06:06:59.723958	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
ff68e62e-5056-42d7-933b-1a96bd15991c	TICKET_VIEWED	2026-06-08 06:06:59.751227	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
c4c938ad-d055-47e1-8b8c-83c5d8fcf835	TICKET_VIEWED	2026-06-08 06:06:59.775459	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
e3f78248-02c4-414c-8432-811c3ead1637	TICKET_VIEWED	2026-06-08 06:06:59.801546	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
b68b1124-99d2-41bf-af6d-076f6dd9b6ff	TICKET_VIEWED	2026-06-08 06:07:07.507397	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
c533de99-e356-44e9-8528-7800ed2725c0	TICKET_VIEWED	2026-06-08 06:07:07.697919	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
f8c79214-472e-41c6-866e-8ed9e5e0b2b3	TICKET_VIEWED	2026-06-08 06:07:07.725593	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
c5cb3c06-9b1d-460a-beb6-44b61255cac5	TICKET_VIEWED	2026-06-08 06:07:07.74864	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
2a77bb35-a4b5-4f96-9752-a0b284de8aea	TICKET_VIEWED	2026-06-08 06:07:29.225524	Detalhes do chamado 'swsw' visualizados por wilson	wilson
4baf5587-1160-4f78-a8ec-02336cb16c34	TICKET_VIEWED	2026-06-08 06:07:29.252501	Detalhes do chamado 'swsw' visualizados por wilson	wilson
b33b1efc-2efd-49b6-8b49-69134ccf9cc6	TICKET_VIEWED	2026-06-08 06:07:29.277228	Detalhes do chamado 'swsw' visualizados por wilson	wilson
0fd67363-2c98-4b22-9d4f-303a30a2fe72	TICKET_VIEWED	2026-06-08 06:07:29.300836	Detalhes do chamado 'swsw' visualizados por wilson	wilson
7c619d42-c63a-4e27-83fe-701401c29ca4	HISTORY_UPDATED	2026-06-08 06:07:31.776979	O técnico wilson atualizou o chamado do clientefedendo	4ff250c8-bbc8-4917-a5da-9b73642112fe
e26d421e-eca0-4467-b49e-794a98b8c227	TICKET_VIEWED	2026-06-08 06:07:31.800698	Detalhes do chamado 'swsw' visualizados por wilson	wilson
b592284f-d3b8-468b-a09e-8e63c0ffcb9b	TICKET_VIEWED	2026-06-08 06:07:38.872581	Detalhes do chamado 'swsw' visualizados por wilson	wilson
bd22bd0b-84a3-4ab8-8347-68d3708f5f62	TICKET_VIEWED	2026-06-08 06:07:39.350539	Detalhes do chamado 'swsw' visualizados por wilson	wilson
3f9cf9b7-4483-419f-be73-43d1e57beae2	TICKET_VIEWED	2026-06-08 06:07:39.382657	Detalhes do chamado 'swsw' visualizados por wilson	wilson
bd8dabcd-47e3-4149-b370-adf35a7cb3ab	TICKET_VIEWED	2026-06-08 06:07:39.404873	Detalhes do chamado 'swsw' visualizados por wilson	wilson
c296fc70-d55f-4638-aa96-722ca6e3b3de	HISTORY_UPDATED	2026-06-08 06:07:42.301447	O técnico wilson atualizou o chamado do clientefedendo	4ff250c8-bbc8-4917-a5da-9b73642112fe
c731004c-fb67-4c51-bf6d-11a0b6fc04c1	TICKET_VIEWED	2026-06-08 06:07:42.325712	Detalhes do chamado 'swsw' visualizados por wilson	wilson
daa02c71-2d82-42db-8e2f-55dc45567ff3	TICKET_VIEWED	2026-06-08 06:10:38.169884	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
01a9430f-bf82-48bc-9c08-050808203b83	TICKET_VIEWED	2026-06-08 06:10:38.202057	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
b39718fa-15bb-4be3-9e56-c8bf86a81474	TICKET_VIEWED	2026-06-08 06:10:38.227683	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
b68fc34c-6d9a-4a67-b4ea-23fd10adee80	TICKET_VIEWED	2026-06-08 06:10:38.248452	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
6bbe0b68-a37f-4a77-8857-f160f0e50f32	TICKET_VIEWED	2026-06-08 06:10:47.232317	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
bb0bbd86-1829-42f9-87e3-a84fae157162	TICKET_VIEWED	2026-06-08 06:10:47.656913	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
939d6f45-bd15-4980-875b-22fdfc88c4a8	TICKET_VIEWED	2026-06-08 06:10:47.680333	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
03341f27-d6f5-4bc6-8c8c-6c24cd8f53d6	TICKET_VIEWED	2026-06-08 06:10:47.701855	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
70455e96-db52-4eba-82ef-10965115ce7d	TICKET_VIEWED	2026-06-08 06:10:56.609522	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
00fd440a-5498-4130-bef3-d6a4ff9d3c48	TICKET_VIEWED	2026-06-08 06:10:57.029704	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
33f3fb52-f9ad-429a-8b71-3efa2a70eae1	TICKET_VIEWED	2026-06-08 06:10:57.088037	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
f685efef-a4d7-4f28-8ac8-3f838dc4d88e	TICKET_VIEWED	2026-06-08 06:10:57.160034	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
b3d2b58a-2c50-40a8-b7e1-93f1ea635cdc	TICKET_VIEWED	2026-06-08 06:11:22.757508	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
5ecbbcaf-c4e0-4c62-b1bc-c12076a1904f	TICKET_VIEWED	2026-06-08 06:11:23.343025	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
998df07e-b2e4-4e64-bf72-31731eccaf14	TICKET_VIEWED	2026-06-08 06:11:23.392799	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
5bfb920a-b8d5-4a64-8fb7-119d3b87b267	TICKET_VIEWED	2026-06-08 06:11:23.473562	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
66b1d83f-51a4-45c6-b64e-9c1f09b4f9df	TICKET_VIEWED	2026-06-08 06:13:56.156196	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
c37db7f5-fd36-4fc5-9e3e-530ec65da846	TICKET_VIEWED	2026-06-08 06:13:56.199776	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
7cd353b5-44a1-49f8-af1f-3956727c0bf6	TICKET_VIEWED	2026-06-08 06:13:56.236805	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
1520e533-2bdb-4a7d-a289-b3d18688dd39	TICKET_VIEWED	2026-06-08 06:13:56.257324	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
19e41c7d-a833-45b2-8863-f74c99bc219b	TICKET_VIEWED	2026-06-08 06:14:04.082803	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
7ad29d8d-ecc4-4992-8c35-3b274dd33d00	TICKET_VIEWED	2026-06-08 06:14:04.104438	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
8602ed42-1ca8-493c-bc34-bd561ef3ae5d	TICKET_VIEWED	2026-06-08 06:14:04.148639	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
c02420a2-b873-4cc2-be57-1fcc1e3b8a7b	TICKET_VIEWED	2026-06-08 06:14:04.184372	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
b5cbaece-a508-4426-a4a9-250ae54d61dc	TICKET_VIEWED	2026-06-08 06:14:13.58367	Detalhes do chamado 'swsw' visualizados por wilson	wilson
908d32f8-fe74-44cd-8896-4651b7427570	TICKET_VIEWED	2026-06-08 06:14:13.977938	Detalhes do chamado 'swsw' visualizados por wilson	wilson
9f24b439-6ad7-48fa-b04d-c2a2ed2b9b35	TICKET_VIEWED	2026-06-08 06:14:14.019659	Detalhes do chamado 'swsw' visualizados por wilson	wilson
5681bd12-b0ac-4297-81bf-43c627958318	TICKET_VIEWED	2026-06-08 06:14:14.040666	Detalhes do chamado 'swsw' visualizados por wilson	wilson
ce4992fa-a4d0-4cbf-a131-78eecad2237d	HISTORY_UPDATED	2026-06-08 06:14:16.679619	O técnico wilson atualizou o chamado do clientefedendo	4ff250c8-bbc8-4917-a5da-9b73642112fe
26729d63-705b-41be-9cbf-5c8c52e0062e	TICKET_VIEWED	2026-06-08 06:14:16.700776	Detalhes do chamado 'swsw' visualizados por wilson	wilson
a12ce74b-8ca9-48b5-b013-7891ad82342f	TICKET_VIEWED	2026-06-08 06:17:24.08627	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
333466c8-164c-4541-a54f-e505096093b0	TICKET_VIEWED	2026-06-08 06:17:24.212437	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
3e144051-db3f-40c7-84d6-733dbc836f22	TICKET_VIEWED	2026-06-08 06:17:24.265384	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
e02b67be-faed-408f-ac5a-35e7cf547343	TICKET_VIEWED	2026-06-08 06:17:24.341794	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
f6d45b3c-3122-43e7-941b-8a003c933cc6	TICKET_VIEWED	2026-06-08 06:18:51.265598	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
98b82921-abba-4f2a-b51d-2c39fc186762	TICKET_VIEWED	2026-06-08 06:18:52.250587	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
19c76d1b-54d9-4329-aaaa-875e7513180e	TICKET_VIEWED	2026-06-08 06:18:57.240219	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
4ebff5bc-709d-4b61-8f6e-8a56bf60277f	TICKET_VIEWED	2026-06-08 06:19:04.357991	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
356fe637-7cdf-4c63-a686-2f2ace236b6b	TICKET_VIEWED	2026-06-08 06:19:04.430935	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
7c5d1a7e-3ac8-4194-bedf-89d7c1a0b22c	TICKET_VIEWED	2026-06-08 06:19:04.478074	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
f17e42f1-f98a-4b55-b9fb-9f125dd9a561	TICKET_VIEWED	2026-06-08 06:19:04.512887	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
32704731-a97a-4412-97b8-6da41cf70db2	TICKET_VIEWED	2026-06-08 06:19:13.066597	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
712504ec-668e-4699-8101-200cf6dec173	TICKET_VIEWED	2026-06-08 06:19:13.761534	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
eff12623-fdfa-4ce6-bcfa-75f9c1aa5cf9	TICKET_VIEWED	2026-06-08 06:19:13.800206	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
03082007-251d-4759-a91c-f41bf037fa46	TICKET_VIEWED	2026-06-08 06:19:13.818252	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
8877dc41-902d-409b-b4ef-c17b91374b92	TICKET_VIEWED	2026-06-08 06:21:39.900418	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
56f15587-315b-4292-8eb7-189cf5dfbc94	TICKET_VIEWED	2026-06-08 06:21:40.023586	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
9f8e3c67-9fca-47ee-9530-c13e26e692d4	TICKET_VIEWED	2026-06-08 06:21:40.071152	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
8b83a736-20c4-4f4c-b1ab-0c35ed098307	TICKET_VIEWED	2026-06-08 06:21:40.142924	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
383827b2-e668-4d58-b4fe-a61435e53899	TICKET_VIEWED	2026-06-08 06:22:47.393391	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
619c178b-cc71-4287-ae54-575045c89e22	TICKET_VIEWED	2026-06-08 06:22:47.414966	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
df17a2e1-e4e3-4dd0-9034-fa02f0448bea	TICKET_VIEWED	2026-06-08 06:22:47.44094	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
386f914d-946e-4563-9bfe-bb46d849a965	TICKET_VIEWED	2026-06-08 06:22:47.459297	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
9bc187d0-3bbf-411c-b46b-3d909246a8be	TICKET_VIEWED	2026-06-08 06:23:18.331714	Detalhes do chamado 'swsw' visualizados por wilson	wilson
9bb2c193-4b9a-4824-8d54-4ccc44871f80	TICKET_VIEWED	2026-06-08 06:23:18.364574	Detalhes do chamado 'swsw' visualizados por wilson	wilson
b5ff1da1-b52f-4b42-8bfb-9dd5c2e77266	TICKET_VIEWED	2026-06-08 06:23:18.395583	Detalhes do chamado 'swsw' visualizados por wilson	wilson
8633d033-e563-4530-9934-f8320a1e3a33	TICKET_VIEWED	2026-06-08 06:23:18.415827	Detalhes do chamado 'swsw' visualizados por wilson	wilson
93c243eb-5d2a-49fa-a6da-c3faa1a5a7a2	TICKET_VIEWED	2026-06-08 06:24:12.370339	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
b5e75a33-b281-4e32-870e-b97e135e9364	TICKET_VIEWED	2026-06-08 06:24:12.402715	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
f0bcb16e-0968-42f5-b267-7af21b7249c9	TICKET_VIEWED	2026-06-08 06:24:12.448106	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
8e3f21db-4abf-4242-9968-4378ac47d503	TICKET_VIEWED	2026-06-08 06:24:12.5396	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
524ba15b-a78b-44e4-b373-ce6cb2d767a9	TICKET_VIEWED	2026-06-08 06:24:25.512007	Detalhes do chamado 'swsw' visualizados por wilson	wilson
879264c3-316a-4365-824a-1dda9970f1a2	TICKET_VIEWED	2026-06-08 06:24:25.612896	Detalhes do chamado 'swsw' visualizados por wilson	wilson
963bec68-1eb8-4686-b0d0-05e7752fba41	TICKET_VIEWED	2026-06-08 06:24:25.69429	Detalhes do chamado 'swsw' visualizados por wilson	wilson
f5876ab9-1f00-48e9-bc4d-302807b28faa	HISTORY_UPDATED	2026-06-08 06:24:27.489336	O técnico wilson atualizou o chamado do clientefedendo	4ff250c8-bbc8-4917-a5da-9b73642112fe
b77e74d7-c06a-423a-94a6-6f91f7155fc1	TICKET_VIEWED	2026-06-08 06:24:27.512445	Detalhes do chamado 'swsw' visualizados por wilson	wilson
ce610c97-414e-4f63-b8ce-7b1c7f045a65	TICKET_VIEWED	2026-06-08 06:25:59.342266	Detalhes do chamado 'swsw' visualizados por wilson	wilson
13a57a09-b234-4ad7-9064-59d0d5e842d7	TICKET_VIEWED	2026-06-08 06:25:59.41917	Detalhes do chamado 'swsw' visualizados por wilson	wilson
f805bdf1-c0d6-4269-b15e-f91e1fd6fafe	TICKET_VIEWED	2026-06-08 06:25:59.605826	Detalhes do chamado 'swsw' visualizados por wilson	wilson
756dfaf1-3442-481b-8e92-2907e24cf487	HISTORY_UPDATED	2026-06-08 06:26:02.20513	O técnico wilson atualizou o chamado do clientefedendo	4ff250c8-bbc8-4917-a5da-9b73642112fe
72aa5dba-4232-48e8-9e85-0182889f5f85	TICKET_VIEWED	2026-06-08 06:26:02.227504	Detalhes do chamado 'swsw' visualizados por wilson	wilson
8fb04ee4-40bf-457a-87cc-71816f476390	TICKET_VIEWED	2026-06-08 06:32:36.408217	Detalhes do chamado 'swsw' visualizados por wilson	wilson
0279ec3c-14a4-4972-b595-a4cdc618c85b	TICKET_VIEWED	2026-06-08 06:32:36.473038	Detalhes do chamado 'swsw' visualizados por wilson	wilson
cd461a66-9a19-4dc4-93e0-f2031a45358e	TICKET_VIEWED	2026-06-08 06:32:36.49278	Detalhes do chamado 'swsw' visualizados por wilson	wilson
68c280b3-5622-4fb2-9e85-502d18e4b13e	HISTORY_UPDATED	2026-06-08 06:32:39.395722	O técnico wilson atualizou o chamado do clientefedendo	4ff250c8-bbc8-4917-a5da-9b73642112fe
fdf75586-7c84-431e-bc2d-3c00096c3571	TICKET_VIEWED	2026-06-08 06:32:39.424008	Detalhes do chamado 'swsw' visualizados por wilson	wilson
a171f270-f477-456e-9f6a-f469d6c5371d	TICKET_VIEWED	2026-06-08 06:48:53.817234	Detalhes do chamado 'swsw' visualizados por wilson	wilson
14bf4851-8504-4283-963f-5f1d3c655763	TICKET_VIEWED	2026-06-08 06:48:53.904622	Detalhes do chamado 'swsw' visualizados por wilson	wilson
bf0f93d5-6a95-44a5-a601-bd80f382011e	TICKET_VIEWED	2026-06-08 06:48:53.928732	Detalhes do chamado 'swsw' visualizados por wilson	wilson
68fc56ba-1d29-4c41-a6a7-cc6e7fee8787	HISTORY_UPDATED	2026-06-08 06:49:02.308126	O técnico wilson atualizou o chamado do clientefedendo	4ff250c8-bbc8-4917-a5da-9b73642112fe
3b35c2b7-995d-47a3-9ad5-cea8c77e5d13	TICKET_VIEWED	2026-06-08 06:49:02.335425	Detalhes do chamado 'swsw' visualizados por wilson	wilson
551b4fb9-7c20-44c0-b4c6-a0d1a8680d49	TICKET_VIEWED	2026-06-08 06:55:58.612473	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
de9b7b49-5d11-4082-9455-6ab375a39e28	TICKET_VIEWED	2026-06-08 06:55:58.660601	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
965c0746-bcd9-49f6-bd4d-113e0d5488a7	TICKET_VIEWED	2026-06-08 06:55:58.693008	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
7f658c10-b65d-4d72-8e7e-fd01af7662b7	TICKET_VIEWED	2026-06-08 06:55:58.715024	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
9b9839b7-376c-40d3-90d0-b397c3d153b1	TICKET_VIEWED	2026-06-08 06:56:08.236128	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
e3a67f60-5520-43ed-8bfb-850d4131c50e	TICKET_VIEWED	2026-06-08 06:56:08.471075	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
fdd7a396-5f6c-49df-9404-5fdda73d7d8e	TICKET_VIEWED	2026-06-08 06:56:08.500469	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
82c42d70-3060-4150-8777-c4cf0444c79a	TICKET_VIEWED	2026-06-08 06:56:08.52259	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
9ae9ed36-6134-4b79-b5d4-d4a4d82e3abe	TICKET_VIEWED	2026-06-08 06:56:16.20025	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
c6bf55b2-3a5d-4f5c-a3db-c1b9ea17d98f	TICKET_VIEWED	2026-06-08 06:56:16.275003	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
14af4881-6993-4094-80a6-750e565ff098	TICKET_VIEWED	2026-06-08 06:56:16.304554	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
cc5ab47e-2384-440b-9ba8-c6d7f03f909b	TICKET_VIEWED	2026-06-08 06:56:16.332508	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
c0447332-b093-463b-865c-3e5e21315495	TICKET_VIEWED	2026-06-08 06:56:19.158255	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
fdbb383d-98b3-4a10-93f3-a410629fba1f	TICKET_VIEWED	2026-06-08 06:56:19.331236	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
04ac8693-17ec-4e9c-ac92-919acf3e1d88	TICKET_VIEWED	2026-06-08 06:56:19.359279	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
93ab6a7c-4122-4639-920a-341776cac9ac	TICKET_VIEWED	2026-06-08 06:56:19.380411	Detalhes do chamado 'swsw' visualizados por WilsonAdmin	WilsonAdmin
add4ed2f-43f2-4801-9be1-8fa492d8cf5d	TICKET_VIEWED	2026-06-08 06:59:43.018924	Detalhes do chamado 'swsw' visualizados por wilson	wilson
19cbd8a9-49ee-4f9f-8977-54c59f053d6d	TICKET_VIEWED	2026-06-08 06:59:43.05637	Detalhes do chamado 'swsw' visualizados por wilson	wilson
f6cf2efa-a667-4871-a018-b7e7fa966b66	TICKET_VIEWED	2026-06-08 06:59:43.081219	Detalhes do chamado 'swsw' visualizados por wilson	wilson
4fb6d14d-f8c2-465a-822f-73b5f258b885	TICKET_FINISHED	2026-06-08 06:59:45.497929	Chamado 'swsw' finalizado. Valor calculado: R$ 180.0000	wilson
38c05050-0358-4e19-8bc5-bda7a8c10dcc	TICKET_VIEWED	2026-06-08 06:59:45.519513	Detalhes do chamado 'swsw' visualizados por wilson	wilson
695ec026-26ce-4526-a16d-75e1b5a898e5	LOGIN_SUCCESS	2026-06-08 07:02:52.149019	Login realizado com sucesso. Usuário: fedendo	fedendo@gmail.com
9824727c-4028-4551-a49e-a416c08d3ca6	TICKET_CREATED	2026-06-08 07:02:57.163904	Chamado criado: 'dawd' | Categoria: NETWORK | Prioridade: MEDIUM	fedendo
2ec8b22e-86f9-47a8-a0d9-7242512c82a0	TICKET_CREATED	2026-06-08 07:03:08.67859	Chamado criado: 'dawdwa' | Categoria: NETWORK | Prioridade: MEDIUM	fedendo
db3a5b66-4a5e-46b9-a146-79b0805fc95a	TICKET_VIEWED	2026-06-08 07:03:25.495502	Detalhes do chamado 'swsw' visualizados por fedendo	fedendo
a4c7acb9-a4fd-43f0-aaef-6147b21e1c68	TICKET_VIEWED	2026-06-08 07:03:25.535322	Detalhes do chamado 'swsw' visualizados por fedendo	fedendo
b4e0d865-4f3f-4002-86fb-a8827416e170	TICKET_VIEWED	2026-06-08 07:03:25.563107	Detalhes do chamado 'swsw' visualizados por fedendo	fedendo
16e4d5f2-9770-4bed-8352-1eaef6ac580e	TICKET_PAYMENT	2026-06-08 07:03:29.013498	Pagamento de R$ 180 confirmado para o chamado 'swsw'	fedendo
e644cb8c-15ea-46a9-a3df-b0ce0c519de5	TICKET_VIEWED	2026-06-08 07:03:29.040498	Detalhes do chamado 'swsw' visualizados por fedendo	fedendo
5a1b108c-d057-4efc-93ba-7e7bbc4a2331	TICKET_CREATED	2026-06-08 07:03:36.114798	Chamado criado: 'dwadwa' | Categoria: NETWORK | Prioridade: MEDIUM	fedendo
bef7ce17-3d0d-4ae1-babf-6cdbd91fc417	LOGIN_SUCCESS	2026-06-08 07:04:01.133441	Login realizado com sucesso. Usuário: wilson	wilson.tech@gmail.com
cc40235c-c16c-4fc9-9112-5e85fa6a5e5e	LOGIN_SUCCESS	2026-06-09 00:50:50.075804	Login realizado com sucesso. Usuário: wilson	wilson.tech@gmail.com
0aad9f86-c021-41f5-9ac1-42817fb8c02a	LOGIN_SUCCESS	2026-06-09 01:02:02.359391	Login realizado com sucesso. Usuário: wilson	wilson.tech@gmail.com
72acbb4e-6993-46c0-a411-c81b24209f56	LOGIN_FAILED	2026-06-09 01:15:33.166377	Tentativa de login com email não cadastrado: wilson@gmail.com	wilson@gmail.com
39332046-3576-4d98-a0d1-e342eb586cd9	LOGIN_SUCCESS	2026-06-09 01:15:43.55718	Login realizado com sucesso. Usuário: fedendo	fedendo@gmail.com
4088841b-806a-4863-8e35-1409d78b3fb9	USER_UPDATED	2026-06-09 01:16:15.601392	Cliente ' Usuário' atualizou seus dados com sucesso	Usuário
bcb539e4-b0fd-4911-b422-fdb1d2a2d9ae	USER_UPDATED	2026-06-09 01:19:43.04009	Cliente ' Usuário' atualizou seus dados com sucesso	Usuário
0d961404-b5ef-443a-a6d5-e0122a835418	USER_UPDATED	2026-06-09 01:20:17.517386	Dados do técnico 'wilsonCustomer' atualizados	wilson.tech@gmail.com
c925383d-9194-4e83-adce-b10c0bd8512e	USER_UPDATED	2026-06-09 01:20:37.201468	Dados do técnico 'wilsonCustomer' atualizados	wilson.tech@gmail.com
1d146cec-d359-45d2-bb0f-ac2fa2c812ac	USER_UPDATED	2026-06-09 01:20:43.01914	Dados do técnico 'wilsonCustomer' atualizados	wilson.tech@gmail.com
cd2464b8-ce5b-4529-9ed8-4522292056a5	USER_UPDATED	2026-06-09 01:20:46.435863	Dados do técnico 'wilsonCustomer' atualizados	wilson.tech@gmail.com
465eb786-d9a0-48a1-9313-bc92b5b468d9	USER_UPDATED	2026-06-09 01:20:56.645827	Cliente ' Usuário' atualizou seus dados com sucesso	Usuário
7e1bfb84-2fe1-405a-b7bd-7efa3638733e	USER_UPDATED	2026-06-09 01:25:39.644259	Dados do técnico 'wilsonCustomer' atualizados	wilson.tech@gmail.com
61149dc1-ed4f-4220-862b-12e9a4b69894	USER_CREATED	2026-06-09 01:27:31.706032	Usuário com o email 'vicente@gmail.com' foi criado com sucesso	vicente@gmail.com
6f2da82f-426d-45a6-a000-6283077f15ac	LOGIN_SUCCESS	2026-06-09 01:27:49.058479	Login realizado com sucesso. Usuário: VicenteCustomer	vicente@gmail.com
4ffa565d-82fb-4d69-af87-50a94272ef96	TICKET_CREATED	2026-06-09 01:27:57.960854	Chamado criado: 'dwadwadwa' | Categoria: NETWORK | Prioridade: MEDIUM	VicenteCustomer
2a4a3d92-9b1f-45ba-b507-c21f6531a73b	USER_UPDATED	2026-06-09 01:28:42.068324	Cliente ' VicenteCustomer' atualizou seus dados com sucesso	VicenteCustomer
b06ce218-f86c-4b0e-ba8e-7610a10d88b3	LOGIN_FAILED	2026-06-09 01:32:06.345472	Senha incorreta para o usuário: VicenteCustomer | Tentativa 1 de 5 | Data/hora: 2026-06-09T01:32:06.344469400	vicente@gmail.com
bdf5ae0a-03d7-47d1-b455-3b6a50cd71bf	LOGIN_FAILED	2026-06-09 01:32:38.761753	Senha incorreta para o usuário: VicenteCustomer | Tentativa 2 de 5 | Data/hora: 2026-06-09T01:32:38.761752600	vicente@gmail.com
f0db1244-c79a-4237-9ab5-8bec40a92441	LOGIN_FAILED	2026-06-09 01:33:03.904182	Senha incorreta para o usuário: VicenteCustomer | Tentativa 3 de 5 | Data/hora: 2026-06-09T01:33:03.903182	vicente@gmail.com
842d3575-a41a-4c9c-910f-b43a7785aad9	LOGIN_FAILED	2026-06-09 01:34:13.350323	Senha incorreta para o usuário: VicenteCustomer | Tentativa 4 de 5 | Data/hora: 2026-06-09T01:34:13.350322900	vicente@gmail.com
5fe9c8d6-cdfe-4dbe-bde0-abdd60a056b8	LOGIN_FAILED	2026-06-09 01:34:14.288622	Senha incorreta para o usuário: VicenteCustomer | Tentativa 5 de 5 | Data/hora: 2026-06-09T01:34:14.288621500	vicente@gmail.com
1092fe9e-fc87-4b24-b0f7-9aa15532cdf8	LOGIN_BLOCKED	2026-06-09 01:34:14.760374	Usuário VicenteCustomer atingiu 5 falhas de autenticação consecutivas no dia | Conta bloqueada por 10 minutos | Data/hora: 2026-06-09T01:34:14.759263100	vicente@gmail.com
203121c4-dda5-459d-9661-3632d052a947	LOGIN_FAILED	2026-06-09 01:34:16.535278	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 10 minuto(s)	vicente@gmail.com
a94feca3-8fb1-4a29-ba1a-5fd31c3d6798	LOGIN_FAILED	2026-06-09 01:34:17.452682	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 10 minuto(s)	vicente@gmail.com
dfb32871-2fc4-423d-b547-c7fdd5fc274f	LOGIN_FAILED	2026-06-09 01:34:19.303614	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 10 minuto(s)	vicente@gmail.com
fc838565-dda3-42e5-9917-9afb16c21554	LOGIN_FAILED	2026-06-09 01:34:41.543026	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 10 minuto(s)	vicente@gmail.com
3a3c4afd-0cd6-4a4a-bbce-02f8c1810481	LOGIN_FAILED	2026-06-09 01:34:51.309353	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 10 minuto(s)	vicente@gmail.com
7a5aef69-cbe1-47a0-a02a-c2848863a118	LOGIN_FAILED	2026-06-09 01:35:16.272648	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 9 minuto(s)	vicente@gmail.com
d43e6331-68d9-4c7b-b3d5-0b716fd48f00	LOGIN_FAILED	2026-06-09 01:35:29.89088	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 9 minuto(s)	vicente@gmail.com
5b2541b0-fcd5-4b26-b48f-0de12214caf4	LOGIN_FAILED	2026-06-09 01:35:48.565882	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 9 minuto(s)	vicente@gmail.com
6b4c5986-2c5a-4d60-84aa-0c478f389abc	LOGIN_FAILED	2026-06-09 01:35:56.94244	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 9 minuto(s)	vicente@gmail.com
f2954b2e-31e3-44a4-8289-0f50e6be8e8e	LOGIN_FAILED	2026-06-09 01:39:20.201625	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 5 minuto(s)	vicente@gmail.com
e69171d4-6ad5-43e6-9713-92f81ee62de7	LOGIN_FAILED	2026-06-09 01:42:42.821684	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 2 minuto(s)	vicente@gmail.com
a32b211e-0e83-499e-9d0a-902411f2325a	LOGIN_FAILED	2026-06-09 01:43:32.045189	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 1 minuto(s)	vicente@gmail.com
6f462ec7-a4bb-4b8f-b82b-adad6237bb66	LOGIN_FAILED	2026-06-09 01:43:53.88255	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 1 minuto(s)	vicente@gmail.com
04f69d02-b162-4a1a-b64e-7d3a7525ced1	LOGIN_FAILED	2026-06-09 01:44:04.273276	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 1 minuto(s)	vicente@gmail.com
69bc7b1a-b677-4e84-b495-5400aa407d31	LOGIN_FAILED	2026-06-09 01:44:08.422218	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 1 minuto(s)	vicente@gmail.com
d3fdfe76-22f3-4b94-8488-11c62de3ee5e	LOGIN_FAILED	2026-06-09 01:44:12.256841	Tentativa de login em conta bloqueada. Usuário: VicenteCustomer | Desbloqueio em 1 minuto(s)	vicente@gmail.com
4bb7ba69-8817-4333-a3cd-0d1085757588	LOGIN_SUCCESS	2026-06-09 01:44:15.045135	Login realizado com sucesso. Usuário: VicenteCustomer	vicente@gmail.com
24a59d69-9598-4598-811e-43d36be04e23	LOGIN_FAILED	2026-06-09 01:44:57.916518	Senha incorreta para o usuário: wilsonCustomer | Tentativa 1 de 5 | Data/hora: 2026-06-09T01:44:57.915516900	wilson.tech@gmail.com
9a180c03-6d74-4b7d-9d32-88f19fbdb944	LOGIN_SUCCESS	2026-06-09 01:45:00.331001	Login realizado com sucesso. Usuário: wilsonCustomer	wilson.tech@gmail.com
4c2cb307-c0d8-43fc-a015-19333938a2e5	TICKET_VIEWED	2026-06-09 01:45:02.824519	Detalhes do chamado 'dawd' visualizados por wilsonCustomer	wilsonCustomer
6ede251d-1ad6-418d-abb7-935f6166a9c8	TICKET_VIEWED	2026-06-09 01:45:02.856756	Detalhes do chamado 'dawd' visualizados por wilsonCustomer	wilsonCustomer
bae1fc7c-766d-414c-8e5f-a292fc54adb7	TICKET_VIEWED	2026-06-09 01:45:02.887931	Detalhes do chamado 'dawd' visualizados por wilsonCustomer	wilsonCustomer
8ed3c8c3-875c-4bb0-8aad-ca93a5a1805d	TICKET_VIEWED	2026-06-09 01:45:02.911151	Detalhes do chamado 'dawd' visualizados por wilsonCustomer	wilsonCustomer
c7e08f5f-4b4f-4437-bc41-57700d30ecc4	LOGIN_FAILED	2026-06-09 01:46:15.063126	Tentativa de login com email não cadastrado: admin@gmail.com	admin@gmail.com
967bcfbc-3f45-4b4a-8bab-274ecbdda777	LOGIN_SUCCESS	2026-06-09 01:46:25.585548	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
dd1084b2-b590-4af4-8a44-b189a2673fa8	TICKET_VIEWED	2026-06-09 01:46:44.523907	Detalhes do chamado 'dawd' visualizados por WilsonAdmin	WilsonAdmin
ea0eb271-2555-41e1-937a-fb04fe1801b9	TICKET_VIEWED	2026-06-09 01:46:44.548087	Detalhes do chamado 'dawd' visualizados por WilsonAdmin	WilsonAdmin
5ee64a35-0801-4938-9dcc-7bcdfc6de05c	TICKET_VIEWED	2026-06-09 01:46:44.569388	Detalhes do chamado 'dawd' visualizados por WilsonAdmin	WilsonAdmin
42462e1e-a114-464d-b9bc-c791a0d23c16	TICKET_VIEWED	2026-06-09 01:46:44.593944	Detalhes do chamado 'dawd' visualizados por WilsonAdmin	WilsonAdmin
69e3ad5c-fd30-436e-a290-55b1fcd91d59	TICKET_ASSIGNED	2026-06-09 01:59:58.741042	Técnico 'wilsonCustomer' assumiu o chamado 'dwadwadwa' do cliente 'VicenteCustomer'	wilsonCustomer
33395088-565b-42b3-9475-4c2f1aec1242	TICKET_VIEWED	2026-06-09 02:00:08.157281	Detalhes do chamado 'dwadwadwa' visualizados por wilsonCustomer	wilsonCustomer
ac3536cd-60f2-4fc6-808d-d1e188fb7a1a	TICKET_VIEWED	2026-06-09 02:00:08.242538	Detalhes do chamado 'dwadwadwa' visualizados por wilsonCustomer	wilsonCustomer
6f7cc2bf-da52-42f8-89b7-514ee9b46078	TICKET_VIEWED	2026-06-09 02:00:08.264225	Detalhes do chamado 'dwadwadwa' visualizados por wilsonCustomer	wilsonCustomer
04f3f550-ead3-4a54-931e-6c7475f45323	TICKET_VIEWED	2026-06-09 02:00:08.291037	Detalhes do chamado 'dwadwadwa' visualizados por wilsonCustomer	wilsonCustomer
d6f3177f-fc59-4050-a2a0-ec9ccfe244c3	TICKET_VIEWED	2026-06-09 02:00:17.501605	Detalhes do chamado 'dwadwadwa' visualizados por wilsonCustomer	wilsonCustomer
f0ac71b9-0085-444c-a7e7-529512b45b37	TICKET_VIEWED	2026-06-09 02:00:17.642093	Detalhes do chamado 'dwadwadwa' visualizados por wilsonCustomer	wilsonCustomer
08896528-b71c-4020-8a5d-be088f545788	TICKET_VIEWED	2026-06-09 02:00:55.789147	Detalhes do chamado 'swsw' visualizados por wilsonCustomer	wilsonCustomer
32d24d3b-c055-4094-800a-f4120d1c4641	LOGIN_FAILED	2026-06-09 02:01:12.372354	Tentativa de login com email não cadastrado: vicente.tech@gmail.com	vicente.tech@gmail.com
aec8dc4a-fe88-4ba4-b801-7e234d579f9b	LOGIN_FAILED	2026-06-09 02:01:37.112668	Tentativa de login com email não cadastrado: vicente.tech@gmail.com	vicente.tech@gmail.com
667617e1-2ba7-430e-a2fc-ed96074f55f4	LOGIN_FAILED	2026-06-09 02:01:52.062475	Tentativa de login com email não cadastrado: vicente.tech@gmail.com	vicente.tech@gmail.com
8e89ab02-4e73-441f-8b48-cff7d95733d6	LOGIN_SUCCESS	2026-06-09 02:02:14.180342	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
1baad32c-c669-4911-8699-576332d46d6e	TICKET_VIEWED	2026-06-09 02:00:17.665225	Detalhes do chamado 'dwadwadwa' visualizados por wilsonCustomer	wilsonCustomer
7695dabe-438f-4e27-9b1d-ab508f42e811	TICKET_VIEWED	2026-06-09 02:00:17.687037	Detalhes do chamado 'dwadwadwa' visualizados por wilsonCustomer	wilsonCustomer
d46ab1e6-6f5c-47f8-b522-f3768c24a9f0	TICKET_VIEWED	2026-06-09 02:00:55.693961	Detalhes do chamado 'swsw' visualizados por wilsonCustomer	wilsonCustomer
6705d04b-71f6-4f76-b8dd-636d95bb6fd0	TICKET_VIEWED	2026-06-09 02:00:55.765598	Detalhes do chamado 'swsw' visualizados por wilsonCustomer	wilsonCustomer
65f2db12-0ef8-4411-b1fd-ce36bc0846a4	USER_CREATED	2026-06-09 02:03:43.758442	Técnico com o email 'vicente.tech@gmail.com' foi criado com sucesso pelo Admin	vicente.tech@gmail.com
7682f1d9-aef8-42b1-b7ec-5a110dbcdb76	TICKET_VIEWED	2026-06-09 02:03:51.642411	Detalhes do chamado 'dwadwadwa' visualizados por WilsonAdmin	WilsonAdmin
73f7d093-9bbe-4329-8750-e7d9cb6b78d2	TICKET_VIEWED	2026-06-09 02:03:51.708834	Detalhes do chamado 'dwadwadwa' visualizados por WilsonAdmin	WilsonAdmin
fe954b7a-12c3-4f21-baa3-9f0a91e47fc4	TICKET_VIEWED	2026-06-09 02:03:51.740586	Detalhes do chamado 'dwadwadwa' visualizados por WilsonAdmin	WilsonAdmin
7ce37181-49c1-40e8-8970-9b9a263fdffa	TICKET_VIEWED	2026-06-09 02:03:51.762505	Detalhes do chamado 'dwadwadwa' visualizados por WilsonAdmin	WilsonAdmin
8ac157da-a8fc-42bd-9709-2a0c20da887a	LOGIN_SUCCESS	2026-06-09 02:04:52.772486	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
53e82136-5e74-4c79-88c7-f7529869982e	LOGIN_SUCCESS	2026-06-09 02:05:06.630947	Login realizado com sucesso. Usuário: Vicente	vicente.tech@gmail.com
7a9bdfa6-3136-4d89-b811-d72e144294cf	LOGIN_FAILED	2026-06-09 02:16:56.023492	Senha incorreta para o usuário: WilsonAdmin | Tentativa 1 de 5 | Data/hora: 2026-06-09T02:16:56.023491800	admin@wilson.com
fa5b6869-2aff-46ae-b829-d2bd024d289a	LOGIN_SUCCESS	2026-06-09 02:16:59.498306	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
6052cbac-f389-4181-aca3-1bdb3820b68d	LOGIN_SUCCESS	2026-06-09 02:17:23.007113	Login realizado com sucesso. Usuário: wilsonCustomer	wilson.tech@gmail.com
7b66cc6e-0b2a-4e89-b9db-badfbe6f38c9	LOGIN_FAILED	2026-06-09 02:17:46.011488	Senha incorreta para o usuário: Vicente | Tentativa 1 de 5 | Data/hora: 2026-06-09T02:17:46.011488400	vicente.tech@gmail.com
dda64bd7-9185-4b6f-afdd-7fa6b218ee02	LOGIN_SUCCESS	2026-06-09 02:17:49.256497	Login realizado com sucesso. Usuário: Vicente	vicente.tech@gmail.com
f69f27a1-e3a2-48b0-a7cf-601a87424a3f	LOGIN_SUCCESS	2026-06-09 02:18:09.973643	Login realizado com sucesso. Usuário: WilsonAdmin	admin@wilson.com
1fac474b-7940-4e63-9e3d-23485a217e18	TICKET_ASSIGNED	2026-06-09 02:22:29.498012	Técnico 'Vicente' assumiu o chamado 'dawdwa' do cliente 'Usuário'	Vicente
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.customer (id) FROM stdin;
4b055b4e-d05a-41b4-be86-4f8360fc2575
9aac0644-1687-46b0-a710-549a8e4a29a5
\.


--
-- Data for Name: password_history; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.password_history (id, created_at, hashed_password, person_id) FROM stdin;
835ad3cd-ac98-4177-b3d2-f941ed5f3676	2026-06-09 01:16:15.58676	$2a$10$2OaUbK0V/ZruD30Nr2jZ5u1RkOA0oZSRBwToDGmkmxfe4ObL0cuDm	4b055b4e-d05a-41b4-be86-4f8360fc2575
acbf78c8-21f2-4c34-8a4b-9b0b53288183	2026-06-09 01:19:43.03055	$2a$10$oqJ6BdtT9KB4Y4kbtQ/VHeH2lCWMSBCPOJerj3ChvVTXWkNhcfJi2	4b055b4e-d05a-41b4-be86-4f8360fc2575
4f085417-f98e-4cc0-aac4-4e12b7e0f387	2026-06-09 01:20:56.636094	$2a$10$Q7dvGDqyZKofstssrpcv0Os8Hg8AMQm1Lo69RoL2jQkcu8sjJ52.y	4b055b4e-d05a-41b4-be86-4f8360fc2575
aa409bfb-5908-40f8-81cc-261f64a7e8f6	2026-06-09 01:25:39.576852	$2a$10$8I9tg8k9dwjR4NNt4yuvxu6y7jzY4oBHBl5kXZIoE2oABk5SBxe36	9dcdfce3-fede-4443-a352-c1e76700852f
fe8356e3-a9d8-4b3e-a0ba-268630a5b58d	2026-06-09 01:28:42.050057	$2a$10$Wfn87yKIVnGNbwQAjYauheHOVuJaJ40Uiv/DAdNZJXyIloLLxkLkq	9aac0644-1687-46b0-a710-549a8e4a29a5
\.


--
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.person (id, created_at, email, failed_login_attempts, locked_until, name, password, phone, role) FROM stdin;
4b055b4e-d05a-41b4-be86-4f8360fc2575	2026-06-08 05:39:44.235143	fedendo@gmail.com	0	\N	Usuário	$2a$10$Q7dvGDqyZKofstssrpcv0Os8Hg8AMQm1Lo69RoL2jQkcu8sjJ52.y	1231231	CUSTOMER
9aac0644-1687-46b0-a710-549a8e4a29a5	2026-06-09 01:27:31.450381	vicente@gmail.com	0	\N	VicenteCustomer	$2a$10$Wfn87yKIVnGNbwQAjYauheHOVuJaJ40Uiv/DAdNZJXyIloLLxkLkq	1231231	CUSTOMER
9dcdfce3-fede-4443-a352-c1e76700852f	\N	wilson.tech@gmail.com	0	\N	wilsonCustomer	$2a$10$8I9tg8k9dwjR4NNt4yuvxu6y7jzY4oBHBl5kXZIoE2oABk5SBxe36	(11) 98765-4321	TECHNICAL
9eaeeb38-8f28-4534-a4e3-fbb429446bb8	\N	admin@wilson.com	0	\N	WilsonAdmin	$2a$10$7TDg2uyVvjTsOq8Ygjds9OWQu32ro4N.4EplUdQ9eiLnlGKVEdv8C	\N	ADMIN
2b5d944f-5383-431e-aec5-f42c4c78821e	\N	vicente.tech@gmail.com	0	\N	Vicente	$2a$10$OiNhTj1sEE.TOIZ9S1OnHeAXdpLz5HDFXH/YhnxBNAcTzKDcT/iUy	321321312	TECHNICAL
\.


--
-- Data for Name: technical; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.technical (id) FROM stdin;
9dcdfce3-fede-4443-a352-c1e76700852f
2b5d944f-5383-431e-aec5-f42c4c78821e
\.


--
-- Data for Name: ticket; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.ticket (id, base_hourly_rate, category, created_at, description, finished_at, payment_confirmed, priority, started_at, status, title, value, customer_id, technical_id) FROM stdin;
466e603f-ece4-4c12-83aa-baced9937e41	100.00	NETWORK	2026-06-08 07:02:57.143996	awdwadwa	\N	f	MEDIUM	\N	OPEN	dawd	\N	4b055b4e-d05a-41b4-be86-4f8360fc2575	\N
4ff250c8-bbc8-4917-a5da-9b73642112fe	100.00	NETWORK	2026-06-08 05:40:06.331353	swswsw	2026-06-08 06:59:45.395395	t	MEDIUM	2026-06-08 05:43:25.320116	COMPLETED	swsw	180.00	4b055b4e-d05a-41b4-be86-4f8360fc2575	9dcdfce3-fede-4443-a352-c1e76700852f
f73da395-9e5c-40da-8992-caa7ed3c6bda	100.00	NETWORK	2026-06-08 07:03:35.698005	awdwadwa	\N	f	MEDIUM	\N	OPEN	dwadwa	\N	4b055b4e-d05a-41b4-be86-4f8360fc2575	\N
6037e0e3-a4c5-4ef7-bae0-d76a2ff386dc	100.00	NETWORK	2026-06-09 01:27:57.94809	dwadwadwa	\N	f	MEDIUM	\N	ASSIGNED	dwadwadwa	\N	9aac0644-1687-46b0-a710-549a8e4a29a5	9dcdfce3-fede-4443-a352-c1e76700852f
a07cd676-05f4-442f-9ef7-1621061c9788	100.00	NETWORK	2026-06-08 07:03:08.666174	dwadwa	\N	f	MEDIUM	\N	ASSIGNED	dawdwa	\N	4b055b4e-d05a-41b4-be86-4f8360fc2575	2b5d944f-5383-431e-aec5-f42c4c78821e
\.


--
-- Data for Name: ticket_history; Type: TABLE DATA; Schema: public; Owner: Qdop
--

COPY public.ticket_history (id, change_date, comment, new_status, old_status, update_by, ticket_id) FROM stdin;
90bf52bb-8601-42fc-894e-c83848b4abf9	2026-06-08 05:43:33.444788	dwadwadaw	IN_PROGRESS	IN_PROGRESS	wilson	4ff250c8-bbc8-4917-a5da-9b73642112fe
70dba134-1eb5-4745-a185-b8af132f60fe	2026-06-08 06:07:31.748536	dwadwadwa	IN_PROGRESS	IN_PROGRESS	wilson	4ff250c8-bbc8-4917-a5da-9b73642112fe
118c02f2-d09e-4425-9c5f-2834a5a67aaa	2026-06-08 06:07:42.266634	oiiiiiiiiiiiiii	IN_PROGRESS	IN_PROGRESS	wilson	4ff250c8-bbc8-4917-a5da-9b73642112fe
9463adc0-641a-4604-a85f-f7ec892d7eb5	2026-06-08 06:14:16.545933	dawdwa	IN_PROGRESS	IN_PROGRESS	wilson	4ff250c8-bbc8-4917-a5da-9b73642112fe
75f2e220-f73d-4426-b09c-ec2d0d9d4b52	2026-06-08 06:24:27.463452	dawdwa	IN_PROGRESS	IN_PROGRESS	wilson	4ff250c8-bbc8-4917-a5da-9b73642112fe
5c225e91-13ab-46af-84fe-1a09d3912262	2026-06-08 06:26:02.143578	dwadwa	IN_PROGRESS	IN_PROGRESS	wilson	4ff250c8-bbc8-4917-a5da-9b73642112fe
eccbb281-8b43-431b-9d1f-4b628b5abfab	2026-06-08 06:32:39.386931	wsw	IN_PROGRESS	IN_PROGRESS	wilson	4ff250c8-bbc8-4917-a5da-9b73642112fe
5a212ae5-8a0c-49fc-926f-4337633ad6e5	2026-06-08 06:49:02.292739	Vai tomando dos menorzin quente	IN_PROGRESS	IN_PROGRESS	wilson	4ff250c8-bbc8-4917-a5da-9b73642112fe
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
-- Name: person ukfwmwi44u55bo4rvwsv0cln012; Type: CONSTRAINT; Schema: public; Owner: Qdop
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT ukfwmwi44u55bo4rvwsv0cln012 UNIQUE (email);


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

\unrestrict i0l4QMMXSb4nNaFTgvvBf9P5zkSZPq6qKXwhjJLeK3YbqqcK8fKZh27le5GZctx

