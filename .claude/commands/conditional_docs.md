# Conditional Documentation Guide

This prompt helps you determine what documentation you should read based on the specific changes you need to make in the codebase. Review the conditions below and read the relevant documentation before proceeding with your task.

## Instructions
- Review the task you've been asked to perform
- Check each documentation path in the Conditional Documentation section
- For each path, evaluate if any of the listed conditions apply to your task
  - IMPORTANT: Only read the documentation if any one of the conditions match your task
- IMPORTANT: You don't want to excessively read documentation. Only read the documentation if it's relevant to your task.

## Conditional Documentation

- README.md
  - Conditions:
    - When first understanding the project structure
    - When you want to learn about the tech stack
    - When you need to understand the ADW workflow
    - When setting up the project for the first time

- adws/README.md
  - Conditions:
    - When you're operating in the `adws/` directory
    - When working with AI Developer Workflows
    - When troubleshooting ADW issues

- package.json
  - Conditions:
    - When adding or removing npm dependencies
    - When modifying build scripts
    - When understanding available npm commands

- src/index.css
  - Conditions:
    - When you need to make changes to global styles
    - When adding or modifying Tailwind CSS configuration
    - When working with CSS variables or themes

- tailwind.config.js
  - Conditions:
    - When customizing Tailwind CSS theme
    - When adding custom colors, fonts, or breakpoints
    - When configuring Tailwind plugins

- vite.config.ts
  - Conditions:
    - When modifying build configuration
    - When adding Vite plugins
    - When configuring development server settings

- tsconfig.json
  - Conditions:
    - When modifying TypeScript compiler options
    - When adding path aliases
    - When troubleshooting TypeScript errors

- .env.sample
  - Conditions:
    - When setting up environment variables
    - When configuring API keys for ADWs
    - When deploying to production
