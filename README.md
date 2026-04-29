# Telikoz UI Clone

A rebuilt single-page landing site for Telikoz Academy with improved UI/UX while keeping the same business information, lead flow, and location details.

## Stack
- HTML
- CSS
- Vanilla JavaScript

## Project Structure
- `index.html` - Page markup, metadata, structured data, external scripts
- `styles.css` - Visual design system, layout, responsive styles, animations
- `script.js` - Lead form submission, UTM capture, conversion event, map action
- `assets/logo.png` - Brand logo asset

## Local Run
Open `index.html` in a browser, or serve with any static server.

## Lead Integration
The form submits to:
- `POST https://telikoz.monagesalon.in/lead`

Payload fields:
- `name`
- `email`
- `phone`
- `utm_source`
- `utm_medium`
- `utm_campaign`

The script reads CSRF token from `<meta name="csrf-token">`.
