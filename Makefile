# Makefile for portal-project-v1 monorepo
# Apps: backoffice

# ===== Default =====
.PHONY: all
all:
	@echo "Please specify a target."
	@echo "   Example: make dev, make build, make check-types"
	@make help

# ===== Installation =====
.PHONY: install
install:
	@echo "Installing dependencies..."
	@npm install --legacy-peer-deps

# ===== Development =====
.PHONY: dev dev-backoffice
dev dev-backoffice:
	@echo "Starting development server..."
	@npx turbo run dev --filter=@portal-project-v1/backoffice

.PHONY: dev-staging dev-stg dev-staging-bo
dev-staging dev-stg dev-staging-bo:
	@echo "Starting development server (staging)..."
	@npx turbo run dev --filter=@portal-project-v1/backoffice -- --mode staging

.PHONY: dev-prod dev-prd
dev-prod dev-prd:
	@echo "Starting development server (production)..."
	@npx turbo run dev --filter=@portal-project-v1/backoffice -- --mode production

# ===== Build =====
.PHONY: build build-backoffice
build build-backoffice:
	@echo "Building for production..."
	@npx turbo run build --filter=@portal-project-v1/backoffice

.PHONY: build-staging build-stg build-backoffice-staging
build-staging build-stg build-backoffice-staging:
	@echo "Building for staging..."
	@npm run build:staging:backoffice

.PHONY: build-prod build-prd build-backoffice-prod
build-prod build-prd build-backoffice-prod:
	@echo "Building for production..."
	@npm run build:prod:backoffice

# ===== Verification =====
.PHONY: check-types
check-types:
	@echo "Checking types..."
	@npx turbo run check-types

.PHONY: lint
lint:
	@echo "Running linter..."
	@npx turbo run lint

.PHONY: format
format:
	@echo "Formatting code..."
	@npm run format

.PHONY: verify
verify: check-types lint build
	@echo "✅ All checks passed"

# ===== Preview =====
.PHONY: preview
preview:
	@echo "Previewing production build..."
	@npx turbo run preview --filter=@portal-project-v1/backoffice

# ===== Clean =====
.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	@npx turbo run clean

# ===== Help =====
.PHONY: help
help:
	@echo ""
	@echo "Development"
	@echo "   make dev / dev-backoffice       Start development server"
	@echo "   make dev-staging                Dev server (staging mode)"
	@echo "   make dev-prod                   Dev server (production mode)"
	@echo ""
	@echo "🔨 Build"
	@echo "   make build / build-backoffice   Build for production"
	@echo "   make build-staging / build-stg  Build for staging"
	@echo "   make build-prod / build-prd     Build for production"
	@echo ""
	@echo "Verification"
	@echo "   make lint           Run linter"
	@echo "   make format         Format code"
	@echo "   make check-types    TypeScript type check"
	@echo "   make verify         Run all checks (lint → check-types → build)"
	@echo ""
	@echo "Preview"
	@echo "   make preview        Preview production build"
	@echo ""
	@echo "Clean"
	@echo "   make clean          Clean all build artifacts"
	@echo ""
	@echo "Setup"
	@echo "   make install        Install dependencies (legacy-peer-deps)"
	@echo ""
	@echo "App shortnames:  backoffice = Backoffice Portal"
