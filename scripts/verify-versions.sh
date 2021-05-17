# This script ensures that version literals specified in all of the marketplace sub-components
# match exactly with the canonical version supplied in `dabl-meta.yaml`

#!/bin/bash
set -eu

app_version=$(yq r dabl-meta.yaml 'catalog.version')
return_code=0

green='\033[0;92m'
red='\033[0;91m'
nc='\033[0m' # No Color

decorate_error () {
  local msg=$1
  local file=$2
  printf "${msg}${red}${file}${nc}\n"
}

printf "Verifying versions match up with app version: ${green}${app_version}${nc}...\n"

daml_version=`cat daml.yaml | grep "$app_version" | wc -l`
if [[ daml_version -ne 1 ]] ; then
  decorate_error "Mismatched version in %s" daml.yaml
  return_code=1
fi

daml_trigger_version=`cat triggers/daml.yaml | grep $app_version | wc -l`
if [[ daml_trigger_version -ne 2 ]] ; then
  decorate_error "Mismatched version(s) in %s" triggers/daml.yaml
  return_code=1
fi

daml_it_version=`cat integrationTesting/daml.yaml | grep $app_version | wc -l`
if [[ daml_it_version -ne 2 ]] ; then
  decorate_error "Mismatched version(s) in %s" integrationTest/daml.yaml
  return_code=1
fi

exberry_adapter_version=`cat exberry_adapter/setup.py | grep "version='$app_version" | wc -l`
if [[ exberry_adapter_version -ne 1 ]] ; then
  decorate_error "Mismatched version in %s" exberry_adapter/setup.py
  return_code=1
fi

ui_version=`cat ui2/package.json | grep $app_version | wc -l`
if [[ ui_version -ne 2 ]] ; then
  decorate_error "Mismatched version(s) in %s" package.json
  return_code=1
fi

docs_version=`cat docs/local_development.md | grep $app_version | wc -l`
if [[ docs_version -ne 1 ]] ; then
  decorate_error "Mismatched version in %s" docs/local_development.md
  return_code=1
fi

if [[ $return_code -eq 0 ]] ; then
  echo "Success: All versions match!"
else
  echo "Error: Found mismatching versions :("
  echo "Run `make tag` to attempt a fix automatically. Commit and push the resulting changes."
fi

exit $return_code
