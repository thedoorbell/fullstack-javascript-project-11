## Status badges:
[![Actions Status](https://github.com/thedoorbell/fullstack-javascript-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/thedoorbell/fullstack-javascript-project-11/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=thedoorbell_fullstack-javascript-project-11&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=thedoorbell_fullstack-javascript-project-11)

## RSS Aggregator

A lightweight web application for subscribing to RSS feeds and reading new posts in one place. The app validates URLs, prevents duplicates, parses RSS through a proxy, and regularly polls sources for new publications. Interface built with Bootstrap 5, localization with `i18next` (Russian by default).

### Demo

[RSS Reader](https://fullstack-javascript-project-11-lilac.vercel.app)

## Features

- **RSS addition by URL** with validation (empty string, valid URL)
- **Duplicate protection**: repeated subscription to the same URL is not allowed
- **RSS parsing** and display:
  - list of feeds (title and description)
  - list of posts with unread/read markers
- **Post viewing** in modal window + "Read full article" link
- **Auto-update (polling)**: periodic polling of feeds for new entries
- **Status messages** (success, network error, invalid RSS, etc.)

## Technologies

- Vite (dev/build/preview)
- Bootstrap 5 (styles and modal windows)
- Axios (network requests)
- i18next (localization)
- Yup (validation)
- on-change (reactive re-rendering)

## Installation

```bash
git clone https://github.com/thedoorbell/RSS-Reader
cd RSS-Reader
npm ci
```

## Quick Start

```bash
# Install dependencies
npm ci

# Development mode
npm run dev

# Build
npm run build

# Local preview
npm run preview
```
