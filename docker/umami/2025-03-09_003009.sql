--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-03-09 00:35:29

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP INDEX IF EXISTS public.website_website_id_key;
DROP INDEX IF EXISTS public.website_user_id_idx;
DROP INDEX IF EXISTS public.website_team_id_idx;
DROP INDEX IF EXISTS public.website_share_id_key;
DROP INDEX IF EXISTS public.website_share_id_idx;
DROP INDEX IF EXISTS public.website_event_website_id_visit_id_created_at_idx;
DROP INDEX IF EXISTS public.website_event_website_id_session_id_created_at_idx;
DROP INDEX IF EXISTS public.website_event_website_id_idx;
DROP INDEX IF EXISTS public.website_event_website_id_created_at_url_query_idx;
DROP INDEX IF EXISTS public.website_event_website_id_created_at_url_path_idx;
DROP INDEX IF EXISTS public.website_event_website_id_created_at_tag_idx;
DROP INDEX IF EXISTS public.website_event_website_id_created_at_referrer_domain_idx;
DROP INDEX IF EXISTS public.website_event_website_id_created_at_page_title_idx;
DROP INDEX IF EXISTS public.website_event_website_id_created_at_idx;
DROP INDEX IF EXISTS public.website_event_website_id_created_at_event_name_idx;
DROP INDEX IF EXISTS public.website_event_visit_id_idx;
DROP INDEX IF EXISTS public.website_event_session_id_idx;
DROP INDEX IF EXISTS public.website_event_created_at_idx;
DROP INDEX IF EXISTS public.website_created_by_idx;
DROP INDEX IF EXISTS public.website_created_at_idx;
DROP INDEX IF EXISTS public.user_username_key;
DROP INDEX IF EXISTS public.user_user_id_key;
DROP INDEX IF EXISTS public.team_user_user_id_idx;
DROP INDEX IF EXISTS public.team_user_team_user_id_key;
DROP INDEX IF EXISTS public.team_user_team_id_idx;
DROP INDEX IF EXISTS public.team_team_id_key;
DROP INDEX IF EXISTS public.team_access_code_key;
DROP INDEX IF EXISTS public.team_access_code_idx;
DROP INDEX IF EXISTS public.session_website_id_idx;
DROP INDEX IF EXISTS public.session_website_id_created_at_subdivision1_idx;
DROP INDEX IF EXISTS public.session_website_id_created_at_screen_idx;
DROP INDEX IF EXISTS public.session_website_id_created_at_os_idx;
DROP INDEX IF EXISTS public.session_website_id_created_at_language_idx;
DROP INDEX IF EXISTS public.session_website_id_created_at_idx;
DROP INDEX IF EXISTS public.session_website_id_created_at_hostname_idx;
DROP INDEX IF EXISTS public.session_website_id_created_at_device_idx;
DROP INDEX IF EXISTS public.session_website_id_created_at_country_idx;
DROP INDEX IF EXISTS public.session_website_id_created_at_city_idx;
DROP INDEX IF EXISTS public.session_website_id_created_at_browser_idx;
DROP INDEX IF EXISTS public.session_session_id_key;
DROP INDEX IF EXISTS public.session_data_website_id_idx;
DROP INDEX IF EXISTS public.session_data_website_id_created_at_data_key_idx;
DROP INDEX IF EXISTS public.session_data_session_id_idx;
DROP INDEX IF EXISTS public.session_data_session_id_created_at_idx;
DROP INDEX IF EXISTS public.session_data_created_at_idx;
DROP INDEX IF EXISTS public.session_created_at_idx;
DROP INDEX IF EXISTS public.report_website_id_idx;
DROP INDEX IF EXISTS public.report_user_id_idx;
DROP INDEX IF EXISTS public.report_type_idx;
DROP INDEX IF EXISTS public.report_report_id_key;
DROP INDEX IF EXISTS public.report_name_idx;
DROP INDEX IF EXISTS public.event_data_website_id_idx;
DROP INDEX IF EXISTS public.event_data_website_id_created_at_idx;
DROP INDEX IF EXISTS public.event_data_website_id_created_at_data_key_idx;
DROP INDEX IF EXISTS public.event_data_website_event_id_idx;
DROP INDEX IF EXISTS public.event_data_created_at_idx;
ALTER TABLE IF EXISTS ONLY public.website DROP CONSTRAINT IF EXISTS website_pkey;
ALTER TABLE IF EXISTS ONLY public.website_event DROP CONSTRAINT IF EXISTS website_event_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_pkey;
ALTER TABLE IF EXISTS ONLY public.team_user DROP CONSTRAINT IF EXISTS team_user_pkey;
ALTER TABLE IF EXISTS ONLY public.team DROP CONSTRAINT IF EXISTS team_pkey;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_pkey;
ALTER TABLE IF EXISTS ONLY public.session_data DROP CONSTRAINT IF EXISTS session_data_pkey;
ALTER TABLE IF EXISTS ONLY public.report DROP CONSTRAINT IF EXISTS report_pkey;
ALTER TABLE IF EXISTS ONLY public.event_data DROP CONSTRAINT IF EXISTS event_data_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
DROP TABLE IF EXISTS public.website_event;
DROP TABLE IF EXISTS public.website;
DROP TABLE IF EXISTS public."user";
DROP TABLE IF EXISTS public.team_user;
DROP TABLE IF EXISTS public.team;
DROP TABLE IF EXISTS public.session_data;
DROP TABLE IF EXISTS public.session;
DROP TABLE IF EXISTS public.report;
DROP TABLE IF EXISTS public.event_data;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP SCHEMA IF EXISTS public;
--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16385)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: umami
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO umami;

--
-- TOC entry 223 (class 1259 OID 16460)
-- Name: event_data; Type: TABLE; Schema: public; Owner: umami
--

CREATE TABLE public.event_data (
    event_data_id uuid NOT NULL,
    website_id uuid NOT NULL,
    website_event_id uuid NOT NULL,
    data_key character varying(500) NOT NULL,
    string_value character varying(500),
    number_value numeric(19,4),
    date_value timestamp(6) with time zone,
    data_type integer NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.event_data OWNER TO umami;

--
-- TOC entry 227 (class 1259 OID 16522)
-- Name: report; Type: TABLE; Schema: public; Owner: umami
--

CREATE TABLE public.report (
    report_id uuid NOT NULL,
    user_id uuid NOT NULL,
    website_id uuid NOT NULL,
    type character varying(200) NOT NULL,
    name character varying(200) NOT NULL,
    description character varying(500) NOT NULL,
    parameters character varying(6000) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone
);


ALTER TABLE public.report OWNER TO umami;

--
-- TOC entry 220 (class 1259 OID 16437)
-- Name: session; Type: TABLE; Schema: public; Owner: umami
--

CREATE TABLE public.session (
    session_id uuid NOT NULL,
    website_id uuid NOT NULL,
    hostname character varying(100),
    browser character varying(20),
    os character varying(20),
    device character varying(20),
    screen character varying(11),
    language character varying(35),
    country character(2),
    subdivision1 character varying(20),
    subdivision2 character varying(50),
    city character varying(50),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.session OWNER TO umami;

--
-- TOC entry 226 (class 1259 OID 16513)
-- Name: session_data; Type: TABLE; Schema: public; Owner: umami
--

CREATE TABLE public.session_data (
    session_data_id uuid NOT NULL,
    website_id uuid NOT NULL,
    session_id uuid NOT NULL,
    data_key character varying(500) NOT NULL,
    string_value character varying(500),
    number_value numeric(19,4),
    date_value timestamp(6) with time zone,
    data_type integer NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.session_data OWNER TO umami;

--
-- TOC entry 224 (class 1259 OID 16468)
-- Name: team; Type: TABLE; Schema: public; Owner: umami
--

CREATE TABLE public.team (
    team_id uuid NOT NULL,
    name character varying(50) NOT NULL,
    access_code character varying(50),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone,
    deleted_at timestamp(6) with time zone,
    logo_url character varying(2183)
);


ALTER TABLE public.team OWNER TO umami;

--
-- TOC entry 225 (class 1259 OID 16474)
-- Name: team_user; Type: TABLE; Schema: public; Owner: umami
--

CREATE TABLE public.team_user (
    team_user_id uuid NOT NULL,
    team_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone
);


ALTER TABLE public.team_user OWNER TO umami;

--
-- TOC entry 219 (class 1259 OID 16431)
-- Name: user; Type: TABLE; Schema: public; Owner: umami
--

CREATE TABLE public."user" (
    user_id uuid NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(60) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone,
    deleted_at timestamp(6) with time zone,
    display_name character varying(255),
    logo_url character varying(2183)
);


ALTER TABLE public."user" OWNER TO umami;

--
-- TOC entry 221 (class 1259 OID 16443)
-- Name: website; Type: TABLE; Schema: public; Owner: umami
--

CREATE TABLE public.website (
    website_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    domain character varying(500),
    share_id character varying(50),
    reset_at timestamp(6) with time zone,
    user_id uuid,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone,
    deleted_at timestamp(6) with time zone,
    created_by uuid,
    team_id uuid
);


ALTER TABLE public.website OWNER TO umami;

--
-- TOC entry 222 (class 1259 OID 16451)
-- Name: website_event; Type: TABLE; Schema: public; Owner: umami
--

CREATE TABLE public.website_event (
    event_id uuid NOT NULL,
    website_id uuid NOT NULL,
    session_id uuid NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    url_path character varying(500) NOT NULL,
    url_query character varying(500),
    referrer_path character varying(500),
    referrer_query character varying(500),
    referrer_domain character varying(500),
    page_title character varying(500),
    event_type integer DEFAULT 1 NOT NULL,
    event_name character varying(50),
    visit_id uuid NOT NULL,
    tag character varying(50)
);


ALTER TABLE public.website_event OWNER TO umami;

--
-- TOC entry 3558 (class 0 OID 16385)
-- Dependencies: 218
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: umami
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
80dcbc06-42c0-4f94-b928-53301a8772c1	65f0f9ee4a3b432e7fa917795033254887497a849d95acf7d9cb4ff24b45f98f	2025-03-08 23:17:27.815291+00	01_init	\N	\N	2025-03-08 23:17:27.785898+00	1
16b855ed-d1fa-45ed-a9e6-23707a194a00	4cc3c14482cb8700574cbdbdb478a93ccd1cabb0aeed37dfffb77a80278ce575	2025-03-08 23:17:27.827463+00	02_report_schema_session_data	\N	\N	2025-03-08 23:17:27.816819+00	1
9ada3543-2235-4c5d-9148-33993fd5ce1f	baf86a7adc077bc46ea646d86aabc5f613aeb311e63894366979a18f6a9ca48c	2025-03-08 23:17:27.841394+00	03_metric_performance_index	\N	\N	2025-03-08 23:17:27.829146+00	1
d3c97c72-f591-4384-9855-e993dcce240d	eb0e4ae2ef5204bc67ddb248358a402cd3bd88567d710f808f16c5124e5fd9cb	2025-03-08 23:17:27.859814+00	04_team_redesign	\N	\N	2025-03-08 23:17:27.842723+00	1
76d6a919-9e8b-42cc-be59-ec654062d18e	12e5b277e41da871b0768118937cef221c4d4f9c3206b719fffba86324df7a11	2025-03-08 23:17:27.978409+00	05_add_visit_id	\N	\N	2025-03-08 23:17:27.861144+00	1
15221927-649a-4f52-a15d-08d4bf84c0b9	fcd8585d077229bb2a16ae4705a79a5bc31cf6cbca089de99f4b1c19cb0a0a17	2025-03-08 23:17:28.143757+00	06_session_data	\N	\N	2025-03-08 23:17:27.9801+00	1
d302176b-e7db-40a6-818c-7a2a2880729c	c38c9605d759b3b00f94076c929b6081d7dbd01a25d2955909fc8d1a6e3276b4	2025-03-08 23:17:28.158927+00	07_add_tag	\N	\N	2025-03-08 23:17:28.148441+00	1
\.


--
-- TOC entry 3563 (class 0 OID 16460)
-- Dependencies: 223
-- Data for Name: event_data; Type: TABLE DATA; Schema: public; Owner: umami
--

COPY public.event_data (event_data_id, website_id, website_event_id, data_key, string_value, number_value, date_value, data_type, created_at) FROM stdin;
\.


--
-- TOC entry 3567 (class 0 OID 16522)
-- Dependencies: 227
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: umami
--

COPY public.report (report_id, user_id, website_id, type, name, description, parameters, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3560 (class 0 OID 16437)
-- Dependencies: 220
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: umami
--

COPY public.session (session_id, website_id, hostname, browser, os, device, screen, language, country, subdivision1, subdivision2, city, created_at) FROM stdin;
\.


--
-- TOC entry 3566 (class 0 OID 16513)
-- Dependencies: 226
-- Data for Name: session_data; Type: TABLE DATA; Schema: public; Owner: umami
--

COPY public.session_data (session_data_id, website_id, session_id, data_key, string_value, number_value, date_value, data_type, created_at) FROM stdin;
\.


--
-- TOC entry 3564 (class 0 OID 16468)
-- Dependencies: 224
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: umami
--

COPY public.team (team_id, name, access_code, created_at, updated_at, deleted_at, logo_url) FROM stdin;
\.


--
-- TOC entry 3565 (class 0 OID 16474)
-- Dependencies: 225
-- Data for Name: team_user; Type: TABLE DATA; Schema: public; Owner: umami
--

COPY public.team_user (team_user_id, team_id, user_id, role, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3559 (class 0 OID 16431)
-- Dependencies: 219
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: umami
--

COPY public."user" (user_id, username, password, role, created_at, updated_at, deleted_at, display_name, logo_url) FROM stdin;
41e2b680-648e-4b09-bcd7-3e2b10c06264	admin	$2b$10$BUli0c.muyCW1ErNJc3jL.vFRFtFJWrT8/GcR4A.sUdCznaXiqFXa	admin	2025-03-08 23:17:27.787727+00	\N	\N	\N	\N
\.


--
-- TOC entry 3561 (class 0 OID 16443)
-- Dependencies: 221
-- Data for Name: website; Type: TABLE DATA; Schema: public; Owner: umami
--

COPY public.website (website_id, name, domain, share_id, reset_at, user_id, created_at, updated_at, deleted_at, created_by, team_id) FROM stdin;
86cc8986-0c47-483f-bd34-fc061c3b7de9	Grade Calculator Local	localhost:3000	\N	\N	41e2b680-648e-4b09-bcd7-3e2b10c06264	2025-03-08 23:25:25.307+00	2025-03-08 23:25:25.307+00	\N	41e2b680-648e-4b09-bcd7-3e2b10c06264	\N
\.


--
-- TOC entry 3562 (class 0 OID 16451)
-- Dependencies: 222
-- Data for Name: website_event; Type: TABLE DATA; Schema: public; Owner: umami
--

COPY public.website_event (event_id, website_id, session_id, created_at, url_path, url_query, referrer_path, referrer_query, referrer_domain, page_title, event_type, event_name, visit_id, tag) FROM stdin;
\.


--
-- TOC entry 3338 (class 2606 OID 16393)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: umami
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3384 (class 2606 OID 16467)
-- Name: event_data event_data_pkey; Type: CONSTRAINT; Schema: public; Owner: umami
--

ALTER TABLE ONLY public.event_data
    ADD CONSTRAINT event_data_pkey PRIMARY KEY (event_data_id);


--
-- TOC entry 3408 (class 2606 OID 16529)
-- Name: report report_pkey; Type: CONSTRAINT; Schema: public; Owner: umami
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pkey PRIMARY KEY (report_id);


--
-- TOC entry 3401 (class 2606 OID 16521)
-- Name: session_data session_data_pkey; Type: CONSTRAINT; Schema: public; Owner: umami
--

ALTER TABLE ONLY public.session_data
    ADD CONSTRAINT session_data_pkey PRIMARY KEY (session_data_id);


--
-- TOC entry 3345 (class 2606 OID 16442)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: umami
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (session_id);


--
-- TOC entry 3392 (class 2606 OID 16473)
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: umami
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (team_id);


--
-- TOC entry 3395 (class 2606 OID 16479)
-- Name: team_user team_user_pkey; Type: CONSTRAINT; Schema: public; Owner: umami
--

ALTER TABLE ONLY public.team_user
    ADD CONSTRAINT team_user_pkey PRIMARY KEY (team_user_id);


--
-- TOC entry 3340 (class 2606 OID 16436)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: umami
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3369 (class 2606 OID 16459)
-- Name: website_event website_event_pkey; Type: CONSTRAINT; Schema: public; Owner: umami
--

ALTER TABLE ONLY public.website_event
    ADD CONSTRAINT website_event_pkey PRIMARY KEY (event_id);


--
-- TOC entry 3361 (class 2606 OID 16450)
-- Name: website website_pkey; Type: CONSTRAINT; Schema: public; Owner: umami
--

ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_pkey PRIMARY KEY (website_id);


--
-- TOC entry 3382 (class 1259 OID 16501)
-- Name: event_data_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX event_data_created_at_idx ON public.event_data USING btree (created_at);


--
-- TOC entry 3385 (class 1259 OID 16503)
-- Name: event_data_website_event_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX event_data_website_event_id_idx ON public.event_data USING btree (website_event_id);


--
-- TOC entry 3386 (class 1259 OID 16563)
-- Name: event_data_website_id_created_at_data_key_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX event_data_website_id_created_at_data_key_idx ON public.event_data USING btree (website_id, created_at, data_key);


--
-- TOC entry 3387 (class 1259 OID 16538)
-- Name: event_data_website_id_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX event_data_website_id_created_at_idx ON public.event_data USING btree (website_id, created_at);


--
-- TOC entry 3388 (class 1259 OID 16502)
-- Name: event_data_website_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX event_data_website_id_idx ON public.event_data USING btree (website_id);


--
-- TOC entry 3406 (class 1259 OID 16537)
-- Name: report_name_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX report_name_idx ON public.report USING btree (name);


--
-- TOC entry 3409 (class 1259 OID 16533)
-- Name: report_report_id_key; Type: INDEX; Schema: public; Owner: umami
--

CREATE UNIQUE INDEX report_report_id_key ON public.report USING btree (report_id);


--
-- TOC entry 3410 (class 1259 OID 16536)
-- Name: report_type_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX report_type_idx ON public.report USING btree (type);


--
-- TOC entry 3411 (class 1259 OID 16534)
-- Name: report_user_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX report_user_id_idx ON public.report USING btree (user_id);


--
-- TOC entry 3412 (class 1259 OID 16535)
-- Name: report_website_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX report_website_id_idx ON public.report USING btree (website_id);


--
-- TOC entry 3343 (class 1259 OID 16489)
-- Name: session_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_created_at_idx ON public.session USING btree (created_at);


--
-- TOC entry 3399 (class 1259 OID 16530)
-- Name: session_data_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_data_created_at_idx ON public.session_data USING btree (created_at);


--
-- TOC entry 3402 (class 1259 OID 16564)
-- Name: session_data_session_id_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_data_session_id_created_at_idx ON public.session_data USING btree (session_id, created_at);


--
-- TOC entry 3403 (class 1259 OID 16532)
-- Name: session_data_session_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_data_session_id_idx ON public.session_data USING btree (session_id);


--
-- TOC entry 3404 (class 1259 OID 16565)
-- Name: session_data_website_id_created_at_data_key_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_data_website_id_created_at_data_key_idx ON public.session_data USING btree (website_id, created_at, data_key);


--
-- TOC entry 3405 (class 1259 OID 16531)
-- Name: session_data_website_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_data_website_id_idx ON public.session_data USING btree (website_id);


--
-- TOC entry 3346 (class 1259 OID 16488)
-- Name: session_session_id_key; Type: INDEX; Schema: public; Owner: umami
--

CREATE UNIQUE INDEX session_session_id_key ON public.session USING btree (session_id);


--
-- TOC entry 3347 (class 1259 OID 16542)
-- Name: session_website_id_created_at_browser_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_created_at_browser_idx ON public.session USING btree (website_id, created_at, browser);


--
-- TOC entry 3348 (class 1259 OID 16549)
-- Name: session_website_id_created_at_city_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_created_at_city_idx ON public.session USING btree (website_id, created_at, city);


--
-- TOC entry 3349 (class 1259 OID 16547)
-- Name: session_website_id_created_at_country_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_created_at_country_idx ON public.session USING btree (website_id, created_at, country);


--
-- TOC entry 3350 (class 1259 OID 16544)
-- Name: session_website_id_created_at_device_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_created_at_device_idx ON public.session USING btree (website_id, created_at, device);


--
-- TOC entry 3351 (class 1259 OID 16541)
-- Name: session_website_id_created_at_hostname_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_created_at_hostname_idx ON public.session USING btree (website_id, created_at, hostname);


--
-- TOC entry 3352 (class 1259 OID 16540)
-- Name: session_website_id_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_created_at_idx ON public.session USING btree (website_id, created_at);


--
-- TOC entry 3353 (class 1259 OID 16546)
-- Name: session_website_id_created_at_language_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_created_at_language_idx ON public.session USING btree (website_id, created_at, language);


--
-- TOC entry 3354 (class 1259 OID 16543)
-- Name: session_website_id_created_at_os_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_created_at_os_idx ON public.session USING btree (website_id, created_at, os);


--
-- TOC entry 3355 (class 1259 OID 16545)
-- Name: session_website_id_created_at_screen_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_created_at_screen_idx ON public.session USING btree (website_id, created_at, screen);


--
-- TOC entry 3356 (class 1259 OID 16548)
-- Name: session_website_id_created_at_subdivision1_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_created_at_subdivision1_idx ON public.session USING btree (website_id, created_at, subdivision1);


--
-- TOC entry 3357 (class 1259 OID 16490)
-- Name: session_website_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX session_website_id_idx ON public.session USING btree (website_id);


--
-- TOC entry 3389 (class 1259 OID 16506)
-- Name: team_access_code_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX team_access_code_idx ON public.team USING btree (access_code);


--
-- TOC entry 3390 (class 1259 OID 16505)
-- Name: team_access_code_key; Type: INDEX; Schema: public; Owner: umami
--

CREATE UNIQUE INDEX team_access_code_key ON public.team USING btree (access_code);


--
-- TOC entry 3393 (class 1259 OID 16504)
-- Name: team_team_id_key; Type: INDEX; Schema: public; Owner: umami
--

CREATE UNIQUE INDEX team_team_id_key ON public.team USING btree (team_id);


--
-- TOC entry 3396 (class 1259 OID 16508)
-- Name: team_user_team_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX team_user_team_id_idx ON public.team_user USING btree (team_id);


--
-- TOC entry 3397 (class 1259 OID 16507)
-- Name: team_user_team_user_id_key; Type: INDEX; Schema: public; Owner: umami
--

CREATE UNIQUE INDEX team_user_team_user_id_key ON public.team_user USING btree (team_user_id);


--
-- TOC entry 3398 (class 1259 OID 16509)
-- Name: team_user_user_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX team_user_user_id_idx ON public.team_user USING btree (user_id);


--
-- TOC entry 3341 (class 1259 OID 16486)
-- Name: user_user_id_key; Type: INDEX; Schema: public; Owner: umami
--

CREATE UNIQUE INDEX user_user_id_key ON public."user" USING btree (user_id);


--
-- TOC entry 3342 (class 1259 OID 16487)
-- Name: user_username_key; Type: INDEX; Schema: public; Owner: umami
--

CREATE UNIQUE INDEX user_username_key ON public."user" USING btree (username);


--
-- TOC entry 3358 (class 1259 OID 16494)
-- Name: website_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_created_at_idx ON public.website USING btree (created_at);


--
-- TOC entry 3359 (class 1259 OID 16560)
-- Name: website_created_by_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_created_by_idx ON public.website USING btree (created_by);


--
-- TOC entry 3367 (class 1259 OID 16496)
-- Name: website_event_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_created_at_idx ON public.website_event USING btree (created_at);


--
-- TOC entry 3370 (class 1259 OID 16497)
-- Name: website_event_session_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_session_id_idx ON public.website_event USING btree (session_id);


--
-- TOC entry 3371 (class 1259 OID 16561)
-- Name: website_event_visit_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_visit_id_idx ON public.website_event USING btree (visit_id);


--
-- TOC entry 3372 (class 1259 OID 16554)
-- Name: website_event_website_id_created_at_event_name_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_website_id_created_at_event_name_idx ON public.website_event USING btree (website_id, created_at, event_name);


--
-- TOC entry 3373 (class 1259 OID 16499)
-- Name: website_event_website_id_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_website_id_created_at_idx ON public.website_event USING btree (website_id, created_at);


--
-- TOC entry 3374 (class 1259 OID 16553)
-- Name: website_event_website_id_created_at_page_title_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_website_id_created_at_page_title_idx ON public.website_event USING btree (website_id, created_at, page_title);


--
-- TOC entry 3375 (class 1259 OID 16552)
-- Name: website_event_website_id_created_at_referrer_domain_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_website_id_created_at_referrer_domain_idx ON public.website_event USING btree (website_id, created_at, referrer_domain);


--
-- TOC entry 3376 (class 1259 OID 16566)
-- Name: website_event_website_id_created_at_tag_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_website_id_created_at_tag_idx ON public.website_event USING btree (website_id, created_at, tag);


--
-- TOC entry 3377 (class 1259 OID 16550)
-- Name: website_event_website_id_created_at_url_path_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_website_id_created_at_url_path_idx ON public.website_event USING btree (website_id, created_at, url_path);


--
-- TOC entry 3378 (class 1259 OID 16551)
-- Name: website_event_website_id_created_at_url_query_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_website_id_created_at_url_query_idx ON public.website_event USING btree (website_id, created_at, url_query);


--
-- TOC entry 3379 (class 1259 OID 16498)
-- Name: website_event_website_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_website_id_idx ON public.website_event USING btree (website_id);


--
-- TOC entry 3380 (class 1259 OID 16500)
-- Name: website_event_website_id_session_id_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_website_id_session_id_created_at_idx ON public.website_event USING btree (website_id, session_id, created_at);


--
-- TOC entry 3381 (class 1259 OID 16562)
-- Name: website_event_website_id_visit_id_created_at_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_event_website_id_visit_id_created_at_idx ON public.website_event USING btree (website_id, visit_id, created_at);


--
-- TOC entry 3362 (class 1259 OID 16495)
-- Name: website_share_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_share_id_idx ON public.website USING btree (share_id);


--
-- TOC entry 3363 (class 1259 OID 16492)
-- Name: website_share_id_key; Type: INDEX; Schema: public; Owner: umami
--

CREATE UNIQUE INDEX website_share_id_key ON public.website USING btree (share_id);


--
-- TOC entry 3364 (class 1259 OID 16559)
-- Name: website_team_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_team_id_idx ON public.website USING btree (team_id);


--
-- TOC entry 3365 (class 1259 OID 16493)
-- Name: website_user_id_idx; Type: INDEX; Schema: public; Owner: umami
--

CREATE INDEX website_user_id_idx ON public.website USING btree (user_id);


--
-- TOC entry 3366 (class 1259 OID 16491)
-- Name: website_website_id_key; Type: INDEX; Schema: public; Owner: umami
--

CREATE UNIQUE INDEX website_website_id_key ON public.website USING btree (website_id);


-- Completed on 2025-03-09 00:35:31

--
-- PostgreSQL database dump complete
--

