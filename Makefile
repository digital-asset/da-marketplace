VERSION = $(shell yq r dabl-meta.yaml 'catalog.version')
PYTHON = pipenv run python

UI_DIR = ui2
STATE_DIR = .dev
PKG_DIR = pkg

### *-=- Artifacts -=-*

dar_name = da-marketplace-$(VERSION).dar
dar_src = .daml/dist/$(dar_name)
dar = $(PKG_DIR)/$(dar_name)

trigger_dar_name = da-marketplace-triggers-$(VERSION).dar
trigger_dar_src = triggers/.daml/dist/$(trigger_dar_name)
trigger_dar = $(PKG_DIR)/$(trigger_dar_name)

exberry_adapter_name = da-marketplace-exberry-adapter-$(VERSION).tar.gz
exberry_adapter = $(PKG_DIR)/$(exberry_adapter_name)

damljs = daml.js

ui_name = da-marketplace-ui-$(VERSION).zip
ui = $(PKG_DIR)/$(ui_name)

app_icon = $(PKG_DIR)/da-marketplace.svg

dit = da-marketplace-$(VERSION).dit

$(PKG_DIR):
	mkdir $@

# Models target
$(dar_src):
	daml build

$(dar): $(dar_src) $(PKG_DIR)
	cp $(dar_src) $@

# Triggers target
$(trigger_dar_src):
	cd triggers && daml build

$(trigger_dar): $(trigger_dar_src) $(PKG_DIR)
	cp $(trigger_dar_src) $@

# Exberry Adapter target
$(exberry_adapter): $(PKG_DIR)
	cd exberry_adapter && $(PYTHON) setup.py sdist
	rm -fr exberry_adapter/marketplace_exchange_adapter.egg-info
	cp exberry_adapter/dist/$(exberry_adapter_name) $@

# Codegen target
$(damljs): $(dar_src)
	daml codegen js $(dar_src) -o $@

# UI target
$(ui): $(damljs) $(trigger_dar) $(exberry_adapter) $(PKG_DIR)
	cd $(UI_DIR) && yarn install
	cd $(UI_DIR) && REACT_APP_TRIGGER_HASH=$(shell sha256sum $(trigger_dar) | awk '{print $$1}') REACT_APP_EXBERRY_HASH=$(shell sha256sum $(exberry_adapter) | awk '{print $$1}') yarn build
	cd $(UI_DIR) && zip -r $(ui_name) build
	mv $(UI_DIR)/$(ui_name) $@

# Icon target
$(app_icon):
	cp $(UI_DIR)/public/marketplace.svg $@

# DIT target
$(dit): $(dar) $(triggers) $(exberry_adapter) $(ui) $(app_icon)
	ddit build --skip-dar-build --force

.PHONY: package
package: $(dit)

### *-=- Testing -=-*

.PHONY: test-ui
test-ui: $(ui)
	cd $(UI_DIR) && yarn test --watchAll=false
	cd $(UI_DIR) && yarn format-check

.PHONY: test-daml
test-daml:
	daml test --junit da-marketplace-test-report.xml

.PHONY: test
test: test-daml test-ui
	./scripts/verify-versions.sh

### *-=- Release -=-*

.PHONY: tag
tag:
	@./scripts/tag-versions.sh \
		$(VERSION) \
		dabl-meta.yaml \
		daml.yaml \
		triggers/daml.yaml \
		integrationTesting/daml.yaml\
		exberry_adapter/setup.py \
		$(UI_DIR)/package.json \
		docs/local_development.md
	@echo "Tagged files... check results before committing"

.PHONY: release
release: test package
	ddit release --dry-run

### *-=- Running -=-*

$(STATE_DIR):
	mkdir $@

# Sandbox
sandbox_pid := $(STATE_DIR)/sandbox.pid
sandbox_log := $(STATE_DIR)/sandbox.log

$(sandbox_pid): |$(STATE_DIR) $(dar_src)
	daml start > $(sandbox_log) & echo "$$!" > $(sandbox_pid)

.PHONY: start-daml-server
start-daml-server: $(sandbox_pid)

.PHONY: stop-daml-server
stop-daml-server:
	pkill -F $(sandbox_pid); rm -f $(sandbox_pid) $(sandbox_log)

# Autoapprove Triggers
.PHONY: start-autoapprove-all start-autoapprove
start-autoapprove-all: |$(STATE_DIR) $(trigger_dar_src)
	./scripts/run-autoapproval-triggers.sh $(trigger_dar_src) $(STATE_DIR)

start-autoapprove: |$(STATE_DIR) $(trigger_dar_src)
	@./scripts/run-trigger.sh \
		$$party \
		$(trigger_dar_src) \
		AutoApprove:autoApprovalTrigger \
		autoapproval_$$party \
		$(STATE_DIR)
	@echo "Starting auto approve trigger for $$party..."

.PHONY: stop-autoapprove-all
stop-autoapprove-all: |$(STATE_DIR)
	./scripts/stop-autoapproval-triggers.sh $(STATE_DIR)

.PHONY: stop-autoapprove
stop-autoapprove: |$(STATE_DIR)
	@./scripts/stop-trigger.sh \
		autoapproval_$$party \
		$(STATE_DIR)
	@echo "Stopping auto approve trigger for $$party..."

# Clearing Trigger
.PHONY: start-clearing-trigger
start-clearing-trigger: |$(STATE_DIR) $(trigger_dar_src)
	@./scripts/run-trigger.sh \
		$$party \
		$(trigger_dar_src) \
		ClearingTrigger:handleClearing \
		clearing_trigger_$$party \
		$(STATE_DIR)
	@echo "Starting clearing trigger for $$party..."

.PHONY: stop-clearing-trigger
stop-clearing-trigger: |$(STATE_DIR)
	@./scripts/stop-trigger.sh \
		clearing_trigger_$$party \
		$(STATE_DIR)
	@echo "Stopping clearing trigger for $$party..."

# Matching Engine Trigger
.PHONY: start-matching-engine
start-matching-engine: |$(STATE_DIR) $(trigger_dar_src)
	@./scripts/run-trigger.sh \
		$$party \
		$(trigger_dar_src) \
		MatchingEngine:handleMatching \
		matching_engine_$$party \
		$(STATE_DIR)
	@echo "Starting matching engine for $$party..."

.PHONY: stop-matching-engine
stop-matching-engine: |$(STATE_DIR)
	@./scripts/stop-trigger.sh \
		matching_engine_$$party \
		$(STATE_DIR)
	@echo "Stopping matching engine for $$party..."

# Settlement Trigger
.PHONY: start-settlement-trigger
start-settlement-trigger: |$(STATE_DIR) $(trigger_dar_src)
	@./scripts/run-trigger.sh \
		$$party \
		$(trigger_dar_src) \
		SettlementInstructionTrigger:handleSettlementInstruction \
		settlement_trigger_$$party \
		$(STATE_DIR)
	@echo "Starting settlement trigger for $$party..."

.PHONY: stop-settlement-trigger
stop-settlement-trigger: |$(STATE_DIR)
	@./scripts/stop-trigger.sh \
		settlement_trigger_$$party \
		$(STATE_DIR)
	@echo "Stopping settlement trigger for $$party..."

### *-=- Cleanup -=-*

.PHONY: clean-ui
clean-ui:
	rm -rf daml.js
	cd $(UI_DIR) && rm -rf build node_modules yarn.lock

.PHONY: clean-daml
clean-daml:
	rm -rf .daml triggers/.daml

.PHONY: clean
clean: clean-daml clean-ui
	rm -rf $(PKG_DIR) $(dit) $(UI_DIR)/build $(STATE_DIR) *.log
