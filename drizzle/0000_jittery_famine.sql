CREATE TABLE `families` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `families_token_hash_unique` ON `families` (`token_hash`);--> statement-breakpoint
CREATE TABLE `meals` (
	`id` text PRIMARY KEY NOT NULL,
	`family` text NOT NULL,
	`day` text NOT NULL,
	`slot` text NOT NULL,
	`recipe` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`family` text NOT NULL,
	`data` text NOT NULL,
	`updated` text NOT NULL
);
