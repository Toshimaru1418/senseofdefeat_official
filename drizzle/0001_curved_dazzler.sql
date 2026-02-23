CREATE TABLE `admin_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(100) NOT NULL,
	`settingValue` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_settings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `discography` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`releaseYear` int NOT NULL,
	`releaseDate` varchar(20),
	`type` enum('single','ep','album','mini_album') NOT NULL DEFAULT 'single',
	`streamingUrl` text,
	`downloadUrl` text,
	`coverImageUrl` text,
	`description` text,
	`isPublished` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discography_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `live_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventDate` varchar(20) NOT NULL,
	`venueName` varchar(255) NOT NULL,
	`venueCity` varchar(100),
	`eventTitle` varchar(255),
	`ticketUrl` text,
	`detailUrl` text,
	`isPublished` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `live_events_id` PRIMARY KEY(`id`)
);
