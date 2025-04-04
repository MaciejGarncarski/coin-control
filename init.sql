--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: email_verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_verification (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    otp text,
    expires_at timestamp without time zone NOT NULL,
    verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    verification_token character varying(255),
    email_id uuid NOT NULL
);


ALTER TABLE public.email_verification OWNER TO postgres;

--
-- Name: reset_password_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reset_password_codes (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    reset_code character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reset_password_codes OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    sid text NOT NULL,
    data text NOT NULL,
    expire_at timestamp without time zone NOT NULL,
    user_id uuid NOT NULL,
    last_access timestamp with time zone,
    device_type character varying(255),
    operating_system character varying(255),
    browser character varying(255),
    ip_address character varying(45),
    location character varying(255),
    id uuid NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: user_emails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_emails (
    email_id uuid NOT NULL,
    user_id uuid NOT NULL,
    email character varying(255) NOT NULL,
    is_primary boolean DEFAULT false,
    is_verified boolean DEFAULT false
);


ALTER TABLE public.user_emails OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    name character varying(255),
    avatar_url character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: email_verification email_verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification
    ADD CONSTRAINT email_verification_pkey PRIMARY KEY (id);


--
-- Name: reset_password_codes reset_password_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_password_codes
    ADD CONSTRAINT reset_password_codes_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: user_emails user_emails_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_emails
    ADD CONSTRAINT user_emails_email_key UNIQUE (email);


--
-- Name: user_emails user_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_emails
    ADD CONSTRAINT user_emails_pkey PRIMARY KEY (email_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_email_verification_email_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_verification_email_id ON public.email_verification USING btree (email_id);


--
-- Name: idx_email_verification_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_verification_expires_at ON public.email_verification USING btree (expires_at);


--
-- Name: idx_email_verification_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_verification_token ON public.email_verification USING btree (verification_token);


--
-- Name: idx_email_verification_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_verification_user_id ON public.email_verification USING btree (user_id);


--
-- Name: idx_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id ON public.sessions USING btree (id);


--
-- Name: idx_reset_password_codes_expiry_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reset_password_codes_expiry_timestamp ON public.reset_password_codes USING btree (expires_at);


--
-- Name: idx_reset_password_codes_reset_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reset_password_codes_reset_code ON public.reset_password_codes USING btree (reset_code);


--
-- Name: idx_reset_password_codes_used; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reset_password_codes_used ON public.reset_password_codes USING btree (used);


--
-- Name: idx_reset_password_codes_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reset_password_codes_user_id ON public.reset_password_codes USING btree (user_id);


--
-- Name: idx_sessions_expire_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_expire_at ON public.sessions USING btree (expire_at);


--
-- Name: idx_sessions_last_access; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_last_access ON public.sessions USING btree (last_access);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_user_id ON public.sessions USING btree (user_id);


--
-- Name: idx_user_emails_is_primary; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_emails_is_primary ON public.user_emails USING btree (is_primary);


--
-- Name: idx_user_emails_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_emails_user_id ON public.user_emails USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: email_verification email_verification_email_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification
    ADD CONSTRAINT email_verification_email_id_fkey FOREIGN KEY (email_id) REFERENCES public.user_emails(email_id) ON DELETE CASCADE;


--
-- Name: email_verification email_verification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification
    ADD CONSTRAINT email_verification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reset_password_codes fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_password_codes
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_emails user_emails_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_emails
    ADD CONSTRAINT user_emails_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

