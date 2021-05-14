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

### *-=- Release -=-*

.PHONY: release
release: test build
	ddit release

### *-=- Running -=-*

.PHONY: start-autoapprove
start-autoapprove: |$(STATE_DIR) $(trigger_src_dar)
	./scripts/run-triggers.sh $(trigger_src_dar) $(STATE_DIR)

.PHONY: stop-autoapprove
stop-autoapprove: |$(STATE_DIR)
	./scripts/stop-triggers.sh $(STATE_DIR)

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
