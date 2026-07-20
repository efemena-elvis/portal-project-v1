# Makefile for Portal-Backoffice Vite project

# ===== Default =====
.PHONY: all
all:
	@echo "⚡ Please specify a target."
	@echo "   Example: make dev, make build, make check-types"
	@make help

# ===== Installation =====
.PHONY: install
install:
	@echo "📦 Installing dependencies..."
	@npm install --legacy-peer-deps

# ===== Development =====
.PHONY: dev dev-mor dev-ma
dev dev-mor dev-ma:
	@echo "🟢 Starting development server..."
	@npm run dev

.PHONY: dev-staging dev-stg dev-mor-staging dev-ma-staging
dev-staging dev-stg dev-mor-staging dev-ma-staging:
	@echo "🟢 Starting development server (staging)..."
	@npm run dev -- --mode staging

.PHONY: dev-prod dev-prd dev-mor-prod dev-ma-prod
dev-prod dev-prd dev-mor-prod dev-ma-prod:
	@echo "🟡 Starting development server (production)..."
	@npm run dev -- --mode production

# ===== Build =====
.PHONY: build build-mor build-ma
build build-mor build-ma:
	@echo "🔨 Building for production..."
	@npm run build

.PHONY: build-staging build-stg build-mor-staging build-ma-staging
build-staging build-stg build-mor-staging build-ma-staging:
	@echo "🔨 Building for staging..."
	@npm run build -- --mode staging

.PHONY: build-prod build-prd build-mor-prod build-ma-prod
build-prod build-prd build-mor-prod build-ma-prod:
	@echo "🏗️ Building for production..."
	@npm run build -- --mode production

# ===== Verification =====
.PHONY: check-types
check-types:
	@echo "🔍 Checking types..."
	@npm run check-types

.PHONY: lint
lint:
	@echo "🔍 Running linter..."
	@npm run lint

.PHONY: format
format:
	@echo "✨ Formatting code..."
	@npm run format

.PHONY: verify
verify: check-types lint build
	@echo "✅ All checks passed"

# ===== Preview =====
.PHONY: preview
preview:
	@echo "👁️  Previewing production build..."
	@npm run preview

# ===== Help =====
.PHONY: help
help:
	@echo ""
	@echo "🛠️  Development"
	@echo "   make dev / dev-mor / dev-ma    Start development server"
	@echo "   make dev-staging               Dev server (staging mode)"
	@echo "   make dev-prod                  Dev server (production mode)"
	@echo ""
	@echo "🔨 Build"
	@echo "   make build / build-mor / build-ma    Build for production"
	@echo "   make build-staging / build-stg       Build for staging"
	@echo "   make build-prod / build-prd          Build for production"
	@echo ""
	@echo "🔍 Verification"
	@echo "   make lint           Run linter"
	@echo "   make format         Format code"
	@echo "   make check-types    TypeScript type check"
	@echo "   make verify         Run all checks (lint \u2192 check-types \u2192 build)"
	@echo ""
	@echo "👁️  Preview"
	@echo "   make preview        Preview production build"
	@echo ""
	@echo "📦 Setup"
	@echo "   make install        Install dependencies (legacy-peer-deps)"
	@echo ""
	@echo "App shortnames:  mor = Merchant of Records,  ma  = Alexpay"