CREATE TABLE prod.core_players (
	id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
	rr_id varchar NULL,
	balance bigint NULL,
	created_at timestamp without time zone NULL,
	updated_at timestamp without time zone NULL
);


CREATE TABLE prod.core_tranzactions (
	id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
	ref_id bigint NULL,
	ref_rr_id varchar NULL,
	amount bigint NULL,
	kind varchar NULL,
	meta varchar NULL
);

ALTER TABLE prod.core_tranzactions ADD created_at timestamp without time zone NULL;

ALTER TABLE prod.core_players ADD lang varchar NULL DEFAULT en COLLATE "C.UTF-8";

CREATE UNIQUE INDEX core_players_id_idx ON prod.core_players (id);
ALTER INDEX prod.core_players_id_idx RENAME TO "core_players.primary_key";
CREATE UNIQUE INDEX "core_tranzactions.primary_key" ON prod.core_tranzactions (id);

CREATE TABLE prod.core_tables (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	state varchar NULL,
	kind varchar NULL,
	owner_id varchar NULL,
	opponent_id varchar NULL,
	bet bigint NULL,
	winner_id varchar NULL,
	total_rake bigint NULL,
	total_win bigint NULL
);
CREATE UNIQUE INDEX "core_tables.primary_key" ON prod.core_tables (id);

ALTER TABLE prod.core_players ALTER COLUMN balance SET DEFAULT 0;

ALTER TABLE prod.core_tables ADD created_at timestamp without time zone NULL;
ALTER TABLE prod.core_tables ADD updated_at timestamp without time zone NULL;

ALTER TABLE prod.core_players ADD lang varchar NULL;

ALTER INDEX prod."core_tranzactions.primary_key" RENAME TO "core_tranzactions_id_idx";

ALTER INDEX prod."core_tables.primary_key" RENAME TO "core_tables_id_idx";

ALTER INDEX prod."core_players.primary_key" RENAME TO "core_players_id_idx";


CREATE TABLE prod.core_warnings (
	id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
	recipient_id varchar NULL,
	created_at time without time zone NULL,
	is_active boolean NULL,
	ttl time NULL
);
CREATE UNIQUE INDEX core_warnings_id_idx ON prod.core_warnings (id);

ALTER TABLE prod.core_warnings ADD reason varchar NULL;

ALTER TABLE prod.core_warnings DROP COLUMN ttl;

ALTER TABLE prod.core_warnings ADD ttl timestamp NULL;

ALTER TABLE prod.core_warnings DROP COLUMN ttl;

ALTER TABLE prod.core_warnings ADD ttl bigint NULL;

ALTER TABLE prod.core_warnings DROP COLUMN created_at;

ALTER TABLE prod.core_warnings ADD created_at timestamp without time zone NULL;

ALTER TABLE prod.core_warnings ADD updated_at timestamp without time zone NULL;

ALTER TABLE prod.core_tables ADD is_rake_transferred boolean NULL;
