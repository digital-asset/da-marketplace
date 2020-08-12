dar_version := $(shell grep "^version" daml.yaml | sed 's/version: //g')
bot_version := $(shell cd exberry_adapter && poetry version | cut -f 2 -d ' ')


state_dir := .dev
daml_build_log = $(state_dir)/daml_build.log
sandbox_pid := $(state_dir)/sandbox.pid
sandbox_log := $(state_dir)/sandbox.log

exberry_adapter_dir := exberry_adapter/bot.egg-info
adapter_pid := $(state_dir)/adapter.pid
adapter_log := $(state_dir)/adapter.log


### DAML server
.PHONY: clean stop_daml_server stop_adapter

$(state_dir):
	mkdir $(state_dir)

$(daml_build_log): |$(state_dir)
	daml build > $(daml_build_log)

$(sandbox_pid): |$(daml_build_log)
	daml start > $(sandbox_log) & echo "$$!" > $(sandbox_pid)

start_daml_server: $(sandbox_pid)

stop_daml_server:
	pkill -F $(sandbox_pid) && rm -f $(sandbox_pid) $(sandbox_log)


### DA Marketplace <> Exberry Adapter

$(exberry_adapter_dir):
	cd exberry_adapter && poetry install && poetry build

$(adapter_pid): |$(state_dir) $(exberry_adapter_dir)
	cd exberry_adapter && (DAML_LEDGER_URL=localhost:6865 poetry run python bot/exberry_adapter_bot.py > ../$(adapter_log) & echo "$$!" > ../$(adapter_pid))

start_adapter: $(adapter_pid)

stop_adapter:
	pkill -F $(adapter_pid) && rm -f $(adapter_pid) $(adapter_log)


target_dir := target

dar := $(target_dir)/da-marketplace-model-$(dar_version).dar
bot := $(target_dir)/da-marketplace-exberry-adapter-bot-$(bot_version).tar.gz

$(target_dir):
	mkdir $@

.PHONY: package
package: $(bot) $(dar)
	cd $(target_dir) && zip da-marketplace.zip *

$(dar): $(target_dir) $(daml_build_log)
	cp .daml/dist/da-marketplace-$(dar_version).dar $@

$(bot): $(target_dir) $(exberry_adapter_dir)
	cp exberry_adapter/dist/bot-$(bot_version).tar.gz $@

.PHONY: clean
clean:
	rm -rf $(state_dir) $(exberry_adapter_dir) $(bot) $(dar)
