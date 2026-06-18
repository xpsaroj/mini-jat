CREATE TYPE "public"."job_type" AS ENUM('Internship', 'Full-time', 'Part-time');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Applied', 'Interviewing', 'Offer', 'Rejected');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"job_title" text NOT NULL,
	"job_type" "job_type" NOT NULL,
	"status" "status" NOT NULL,
	"applied_date" date NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
