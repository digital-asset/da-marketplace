BASENAME=$(shell yq -r '.catalog.name' < dabl-meta.yaml 2> /dev/null || yq r dabl-meta.yaml 'catalog.name')
VERSION=$(shell yq -r '.catalog.version' < dabl-meta.yaml 2> /dev/null || yq r dabl-meta.yaml 'catalog.version')
SUBDEPLOYMENTS=$(shell yq -r '.subdeployments' < dabl-meta.yaml 2> /dev/null | sed 's/\[//g' | sed 's/\]//g' | sed 's/,//g' \
	       || yq r dabl-meta.yaml 'subdeployments' | sed 's/\[//g' | sed 's/\]//g' | sed 's/,//g')

TAG_NAME=${BASENAME}-v${VERSION}
NAME=${BASENAME}-${VERSION}

dar_version := $(shell grep "^version" daml.yaml | sed 's/version: //g')
exberry_adapter_version := $(shell cd exberry_adapter && pipenv run python setup.py --version)
trigger_version := $(shell grep "^version" triggers/daml.yaml | sed 's/version: //g')
ui_version := $(shell node -p "require(\"./ui2/package.json\").version")

PYTHON := pipenv run python

state_dir := .dev
daml_build_log = $(state_dir)/daml_build.log
sandbox_pid := $(state_dir)/sandbox.pid
sandbox_log := $(state_dir)/sandbox.log

trigger_build := triggers/.daml/dist/da-marketplace-triggers-$(trigger_version).dar

exberry_adapter_dir := exberry_adapter/dist
adapter_pid := $(state_dir)/adapter.pid
adapter_log := $(state_dir)/adapter.log

matching_engine_pid := $(state_dir)/matching_engine.pid
matching_engine_log := $(state_dir)/matching_engine.log

operator_pid := $(state_dir)/operator.pid
operator_log := $(state_dir)/operator.log

custodian_pid := $(state_dir)/custodian.pid
custodian_log := $(state_dir)/custodian.log

ccp_pid := $(state_dir)/ccp.pid
ccp_log := $(state_dir)/ccp.log

broker_pid := $(state_dir)/broker.pid
broker_log := $(state_dir)/broker.log

exchange_pid := $(state_dir)/exchange.pid
exchange_log := $(state_dir)/exchange.log


### DAML server
.PHONY: clean stop_daml_server stop_operator stop_custodian stop_broker stop_exchange stop_adapter stop_matching_engine

$(state_dir):
	mkdir $(state_dir)

$(daml_build_log): |$(state_dir)
	daml build > $(daml_build_log)

$(sandbox_pid): |$(daml_build_log)
	daml start > $(sandbox_log) & echo "$$!" > $(sandbox_pid)

start_daml_server: $(sandbox_pid)

stop_daml_server:
	pkill -F $(sandbox_pid); rm -f $(sandbox_pid) $(sandbox_log)


### DA Marketplace Operator Bot

$(trigger_build): $(daml_build_log)
	cd triggers && daml build

.PHONY: clean_triggers
clean_triggers:
	rm -rf $(trigger_build) triggers/.daml

$(operator_pid): |$(state_dir) $(trigger_build)
	(daml trigger --dar $(trigger_build) \
	    --trigger-name OperatorTrigger:handleOperator \
	    --ledger-host localhost --ledger-port 6865 \
	    --ledger-party Operator > $(operator_log) & echo "$$!" > $(operator_pid))

start_operator: $(operator_pid)

stop_operator:
	pkill -F $(operator_pid); rm -f $(operator_pid) $(operator_log)

$(ccp_pid): |$(state_dir) $(trigger_build)
	(daml trigger --dar $(trigger_build) \
	    --trigger-name ClearingTrigger:handleClearing \
	    --ledger-host localhost --ledger-port 6865 \
	    --ledger-party Ccp > $(ccp_log) & echo "$$!" > $(ccp_pid))

start_ccp: $(ccp_pid)

stop_ccp:
	pkill -F $(ccp_pid); rm -f $(ccp_pid) $(ccp_log)

### DA Marketplace Auto-Approve Triggers (all parties)

start_autoapprove: |$(state_dir) $(trigger_build)
	./scripts/run-triggers.sh $(trigger_build) $(state_dir)

stop_autoapprove: |$(state_dir)
	./scripts/stop-triggers.sh $(state_dir)

### DA Marketplace Custodian Bot

$(custodian_pid): |$(state_dir) $(trigger_build)
	(daml trigger --dar $(trigger_build) \
	    --trigger-name CustodianTrigger:handleCustodian \
	    --ledger-host localhost --ledger-port 6865 \
	    --ledger-party Custodian > $(custodian_log) & echo "$$!" > $(custodian_pid))

start_custodian: $(custodian_pid)

stop_custodian:
	pkill -F $(custodian_pid); rm -f $(custodian_pid) $(custodian_log)

### DA Marketplace Broker Bot

$(broker_pid): |$(state_dir) $(trigger_build)
	(daml trigger --dar $(trigger_build) \
	    --trigger-name BrokerTrigger:handleBroker \
	    --ledger-host localhost --ledger-port 6865 \
	    --ledger-party Broker > $(broker_log) & echo "$$!" > $(broker_pid))

start_broker: $(broker_pid)

stop_broker:
	pkill -F $(broker_pid); rm -f $(broker_pid) $(broker_log)


### DA Marketplace Exchange Bot

$(exchange_pid): |$(state_dir) $(trigger_build)
	(daml trigger --dar $(trigger_build) \
	    --trigger-name AutoApproval:autoApprovalTrigger \
	    --ledger-host localhost --ledger-port 6865 \
	    --ledger-party Exchange > $(exchange_log) & echo "$$!" > $(exchange_pid))

start_exchange: $(exchange_pid)

stop_exchange:
	pkill -F $(exchange_pid); rm -f $(exchange_pid) $(exchange_log)

### DA Marketplace <> Exberry Adapter
$(exberry_adapter_dir):
	cd exberry_adapter && $(PYTHON) setup.py sdist
	rm -fr exberry_adapter/marketplace_exchange_adapter.egg-info

$(adapter_pid): |$(state_dir) $(exberry_adapter_dir)
	cd exberry_adapter && pipenv install && (DAML_LEDGER_URL=localhost:6865 $(PYTHON) bot/exberry_adapter_bot.py > ../$(adapter_log) & echo "$$!" > ../$(adapter_pid))

start_adapter: $(adapter_pid)

stop_adapter:
	pkill -F $(adapter_pid); rm -f $(adapter_pid) $(adapter_log)


### DA Marketplace Matching Engine
$(matching_engine_pid): |$(state_dir) $(trigger_build)
	(daml trigger --dar $(trigger_build) \
	    --trigger-name MatchingEngine:handleMatching \
	    --ledger-host localhost --ledger-port 6865 \
	    --ledger-party Exchange > $(matching_engine_log) & echo "$$!" > $(matching_engine_pid))

start_matching_engine: $(matching_engine_pid)

stop_matching_engine:
	pkill -F $(matching_engine_pid); rm -f $(matching_engine_pid) $(matching_engine_log)

start_bots: $(operator_pid) $(broker_pid) $(custodian_pid) $(exchange_pid)

stop_bots: stop_broker stop_custodian stop_exchange stop_operator

target_dir := target

dar := $(target_dir)/da-marketplace-model-$(dar_version).dar
exberry_adapter := $(target_dir)/da-marketplace-exberry-adapter-$(exberry_adapter_version).tar.gz
ui := $(target_dir)/da-marketplace-ui-$(ui_version).zip
dabl_meta := $(target_dir)/dabl-meta.yaml
trigger := $(target_dir)/da-marketplace-triggers-$(trigger_version).dar

$(target_dir):
	mkdir $@

.PHONY: package publish

publish: package
	git tag -f "${TAG_NAME}"
	ghr -replace "${TAG_NAME}" "$(target_dir)/${NAME}.dit"

package: $(trigger) $(dar) $(ui) $(exberry_adapter) $(dabl_meta) verify-artifacts
	cd $(target_dir) && zip -j ${NAME}.dit $(shell cd $(target_dir) && echo da-marketplace-*) ../pkg/marketplace.svg dabl-meta.yaml

$(dabl_meta): $(target_dir) dabl-meta.yaml
	cp dabl-meta.yaml $@

$(dar): $(target_dir) $(daml_build_log)
	cp .daml/dist/da-marketplace-$(dar_version).dar $@

$(trigger): $(target_dir) $(trigger_build)
	cp $(trigger_build) $@

$(exberry_adapter): $(target_dir) $(exberry_adapter_dir)
	cp exberry_adapter/dist/marketplace-exchange-adapter-$(exberry_adapter_version).tar.gz $@

.PHONY: ui
ui: $(dar) $(ui)

$(ui): $(exberry_adapter)
	daml codegen js .daml/dist/da-marketplace-$(dar_version).dar -o daml.js
	cd ui2 && yarn install
	cd ui2 && REACT_APP_TRIGGER_HASH=$(shell sha256sum $(trigger_build) | awk '{print $$1}') REACT_APP_EXBERRY_HASH=$(shell sha256sum $(exberry_adapter) | awk '{print $$1}')  yarn build
	cd ui2 && zip -r da-marketplace-ui-$(ui_version).zip build
	mv ui2/da-marketplace-ui-$(ui_version).zip $@
	rm -r ui2/build

.PHONY: clean
clean: clean-ui
	rm -rf .daml triggers/.daml $(state_dir) $(trigger) $(exberry_adapter_dir) $(trigger_build) $(dar) $(ui) $(dabl_meta) $(target_dir)/${NAME}.dit .daml

clean-ui:
	rm -rf $(ui) daml.js ui/node_modules ui/build ui/yarn.lock ui2/node_modules ui2/build ui2/yarn.lock

verify-artifacts:
	for filename in $(SUBDEPLOYMENTS) ; do \
		test -f $(target_dir)/$$filename || (echo could not find $$filename; exit 1;) \
	done
	test -f $(dabl_meta) || (echo could not find $(dabl_meta); exit 1;) \
