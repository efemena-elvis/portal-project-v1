# Makefile for running staging apps via npm

# Define app aliases
MOR = dev:staging:merchant-of-records
MG  = dev:staging:merchant-gateway
MR  = dev:staging:merchant-redstonepgs
MA  = dev:staging:merchant-alexpay
MS  = dev:staging:merchant-storefront

# Default target: run all apps
.PHONY: all
all:
	@echo "🟢 No app specified. Running all apps in staging mode..."
	@npm run $(MOR) &
	@npm run $(MG) &
	@npm run $(MR) &
	@npm run $(MA) &
	@npm run $(MS) &
	@wait
	@echo "✅ All apps started in staging mode."

# Individual app targets
.PHONY: mor
mor:
	@echo "🟢 Running: npm run $(MOR)"
	@npm run $(MOR)

.PHONY: mg
mg:
	@echo "🟢 Running: npm run $(MG)"
	@npm run $(MG)

.PHONY: mr
mr:
	@echo "🟢 Running: npm run $(MR)"
	@npm run $(MR)

.PHONY: ma
ma:
	@echo "🟢 Running: npm run $(MA)"
	@npm run $(MA)

.PHONY: ms
ms:
	@echo "🟢 Running: npm run $(MS)"
	@npm run $(MS)

.PHONY: help
help:
	@echo ""
	@echo "🛠️  Usage:"
	@echo "   make              # Runs all apps"
	@echo "   make mor          # Runs Merchant of Records"
	@echo "   make mg           # Runs Merchant Gateway"
	@echo "   make mr           # Runs Merchant RedstonePGS"
	@echo "   make ma           # Runs Merchant Alexpay"
	@echo "   make ms           # Runs Merchant Storefront"
	@echo ""