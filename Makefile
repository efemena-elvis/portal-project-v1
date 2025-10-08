# Makefile for running apps via npm (staging & prod, dev & build)

# App shortname mappings
APPS = mor mg mr ma ms
MOR = merchant-of-records
MG  = merchant-gateway
MR  = merchant-redstonepgs
MA  = merchant-alexpay
MS  = merchant-storefront

# ===== Default =====
.PHONY: all
all:
	@echo "⚡ Please specify an environment and mode (staging/prod, dev/build)."
	@echo "   Example: make dev-staging-all or make build-prod-mg"

# ====== DEV: STAGING ======
.PHONY: dev-staging-all
dev-staging-all:
	@echo "🟢 Starting ALL apps in DEV (staging)..."
	@npm run dev:staging:$(MOR) &
	@npm run dev:staging:$(MG) &
	@npm run dev:staging:$(MR) &
	@npm run dev:staging:$(MA) &
	@npm run dev:staging:$(MS) &
	@wait
	@echo "✅ All apps running in DEV (staging)."

dev-staging-mor:
	@npm run dev:staging:$(MOR)
dev-staging-mg:
	@npm run dev:staging:$(MG)
dev-staging-mr:
	@npm run dev:staging:$(MR)
dev-staging-ma:
	@npm run dev:staging:$(MA)
dev-staging-ms:
	@npm run dev:staging:$(MS)

# ====== DEV: PROD ======
.PHONY: dev-prod-all
dev-prod-all:
	@echo "🟡 Starting ALL apps in DEV (prod)..."
	@npm run dev:prod:$(MOR) &
	@npm run dev:prod:$(MG) &
	@npm run dev:prod:$(MR) &
	@npm run dev:prod:$(MA) &
	@npm run dev:prod:$(MS) &
	@wait
	@echo "✅ All apps running in DEV (prod)."

dev-prod-mor:
	@npm run dev:prod:$(MOR)
dev-prod-mg:
	@npm run dev:prod:$(MG)
dev-prod-mr:
	@npm run dev:prod:$(MR)
dev-prod-ma:
	@npm run dev:prod:$(MA)
dev-prod-ms:
	@npm run dev:prod:$(MS)

# ====== BUILD: STAGING ======
.PHONY: build-staging-all
build-staging-all:
	@echo "🔨 Building ALL apps (staging)..."
	@npm run build:staging:$(MOR)
	@npm run build:staging:$(MG)
	@npm run build:staging:$(MR)
	@npm run build:staging:$(MA)
	@npm run build:staging:$(MS)
	@echo "✅ All apps built (staging)."

build-staging-mor:
	@npm run build:staging:$(MOR)
build-staging-mg:
	@npm run build:staging:$(MG)
build-staging-mr:
	@npm run build:staging:$(MR)
build-staging-ma:
	@npm run build:staging:$(MA)
build-staging-ms:
	@npm run build:staging:$(MS)

# ====== BUILD: PROD ======
.PHONY: build-prod-all
build-prod-all:
	@echo "🏗️ Building ALL apps (prod)..."
	@npm run build:prod:$(MOR)
	@npm run build:prod:$(MG)
	@npm run build:prod:$(MR)
	@npm run build:prod:$(MA)
	@npm run build:prod:$(MS)
	@echo "✅ All apps built (prod)."

build-prod-mor:
	@npm run build:prod:$(MOR)
build-prod-mg:
	@npm run build:prod:$(MG)
build-prod-mr:
	@npm run build:prod:$(MR)
build-prod-ma:
	@npm run build:prod:$(MA)
build-prod-ms:
	@npm run build:prod:$(MS)

# ===== HELP =====
.PHONY: help
help:
	@echo ""
	@echo "🛠️  Usage:"
	@echo "   make dev-staging-all      # Run ALL apps in staging dev mode"
	@echo "   make dev-prod-all         # Run ALL apps in prod dev mode"
	@echo "   make build-staging-all    # Build ALL apps for staging"
	@echo "   make build-prod-all       # Build ALL apps for prod"
	@echo ""
	@echo "   make dev-staging-mg       # Run Merchant Gateway in staging dev mode"
	@echo "   make dev-prod-mor         # Run Merchant of Records in prod dev mode"
	@echo "   make build-staging-ms     # Build Merchant Storefront for staging"
	@echo "   make build-prod-mr        # Build Merchant RedstonePGS for prod"
	@echo ""
	@echo "Shortnames:"
	@echo "   mor = Merchant of Records"
	@echo "   mg  = Merchant Gateway"
	@echo "   mr  = Merchant RedstonePGS"
	@echo "   ma  = Merchant Alexpay"
	@echo "   ms  = Merchant Storefront"
	@echo ""