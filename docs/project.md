Personal Fitness Intelligence App (Self-Hosted)
Overview

This project is a personal, self-hosted fitness intelligence app designed for daily use on mobile (iPhone) via a mobile-first web app.

The app focuses on:

fast daily check-ins

structured workout logging

muscle-level analytics

simple, explainable recommendations

nutrition tracking (calories & macros) with voice input

medication and supplement tracking

health profile (blood work, medical history)

It is not a medical or diagnostic tool.
It is a personal fitness tracking and recommendation system that prioritizes usability, data ownership, and long-term insight.

Core Goals

Make daily logging effortless

Track workouts at the muscle level

Visualize training balance and neglect

Generate daily workout recommendations

Store all data locally under user control

Work smoothly as an iPhone “app” via browser install

Non-Goals (Important)

No medical diagnosis

No injury treatment advice

No complex social features

No multi-user support (v1 is single user)

No full native app initially

Platform Strategy

Web app first

Mobile-first UI

Installed on iPhone via “Add to Home Screen”

Self-hosted backend

HTTPS required

Native iOS app may be considered later.

Tech Stack (Initial)
Frontend

Next.js

Mobile-first layout

SVG for muscle visualization

Touch-optimized inputs

Backend

Next.js API routes (or FastAPI later)

PostgreSQL database

Simple auth (single user)

Hosting

Local machine or VPS

Docker (optional but recommended)

HTTPS via reverse proxy

High-Level Architecture
[ Mobile Web UI ]
        ↓
[ API Layer ]
        ↓
[ PostgreSQL DB ]
        ↓
[ Analytics Engine ]
        ↓
[ Recommendation Logic ]


LLM integration is optional and later.

Core User Flow (Daily Loop)
1. Morning Check-In (Primary Screen)

User completes a quick form:

Hours slept

Sleep quality (1–5)

Energy level (low / normal / high)

Soreness selection (body map)

Acute pain toggle + optional note

Time available today (short / normal / long)

Action:

Tap Confirm Today

Result:

Check-in saved

System selects training focus

Redirect to Today’s Plan

2. Today’s Plan

System presents:

Day type (Push / Pull / Legs / PT / Rest)

Recommended workout

Sets, reps, target weights

Required PT exercises (if any)

User may:

Start workout

Modify intensity

Swap exercises

Skip day

3. Workout Logging

Fast, minimal logging:

Weight

Reps

Effort (easy / normal / hard)

Optional notes

Logging should never block training.

4. Nutrition Tracking (Throughout Day)

Voice-enabled meal logging

Calorie and macro tracking (protein, carbs, fats)

Integration with workout recommendations

5. Medication & Supplement Tracking

Quick log of medications and vitamins taken

History and adherence tracking

6. Health Profile Management

Blood work results entry and trends

Medical history tracking

Data export for healthcare providers

Data Model (Initial)
Core Tables

users

exercises

muscles

exercise_muscle_map

workouts

workout_sets

daily_checkins

PT_exercises

PT_logs

nutrition_entries

nutrition_goals

medications

medication_logs

supplements

supplement_logs

blood_work_results

medical_history

Muscle Model

Each exercise maps to muscles with weights:

Example:

Bench Press

Chest: 1.0

Triceps: 0.5

Front delts: 0.5

This enables:

muscle stimulus tracking

imbalance detection

visualization

Analytics (Non-AI)

Computed weekly:

Muscle stimulus score
sets × reps × load × muscle_weight

Training frequency per muscle

Days since last trained

Volume and intensity trends

Neglected or overworked muscles

These metrics drive recommendations.

Muscle Visualization

SVG human body (front + back)

Each muscle group is a separate path

Muscle color intensity = recent stimulus

Toggle views:

Today

Last 7 days

Push / Pull / Legs

Neglected muscles

No 3D required.

Recommendation Logic (v1)

Deterministic rules based on:

Split schedule

Last workout

Soreness

Energy

Sleep

Recovery gaps

Examples:

High soreness + low energy → rest or PT

Missed split → reschedule

Undertrained muscle → prioritize

High fatigue → reduce volume

LLM is not required for v1.

LLM Usage (Future Phase)

Optional uses:

Daily narrative summary

Explanation of recommendations

Parsing free-text meal logs

Recipe suggestions

LLM does not compute metrics.

UI Principles

One primary action per screen

Vertical flow

Large touch targets

Minimal typing

Analytics hidden unless requested

Development Roadmap
Phase 1: Foundation (Week 1)

Repo setup

Database schema

Exercise + muscle tables

Basic API routes

Morning check-in UI

Local hosting

Phase 2: Logging + Plan (Week 2)

Workout logging UI

Daily plan generation

Split logic

Manual exercise entry

Installable PWA

Phase 3: Analytics + Graphics (Week 3)

Muscle stimulus calculations

SVG muscle diagram

Weekly summaries

Neglect alerts

Phase 4: Polish (Week 4)

UI refinement

Faster logging

Saved meals

Recommendation explanations

Success Criteria

Used daily without friction

Muscle balance is visible at a glance

Recommendations feel reasonable

Data is fully owned and portable

Works reliably on iPhone

Guiding Principle

This app is a personal fitness operating system, not a social product or a medical tool.

Accuracy, clarity, and usability matter more than feature