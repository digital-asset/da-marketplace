#!/bin/bash
set -eu

# This script ensures that version literals specified in all of the marketplace sub-components
# match exactly with the canonical version supplied in `dabl-meta.yaml`

app_version=$(yq r dabl-meta.yaml 'catalog.version')

# daml.yaml files can't handle full semver versions, keep just the
# MAJOR.MINOR.PATCH fields for them
capture_regex="([0-9]*)\.([0-9]*)\.([0-9]*)(-[a-zA-Z]*\.[0-9]*)?"
short_version=$(echo $app_version | sed -r "s/^$capture_regex/\1.\2.\3/")

echo "Application version is $app_version, short version is $short_version."

return_code=0

green='\033[0;92m'
red='\033[0;91m'
orange='\033[0;33m'
nc='\033[0m' # No Color

decorate_error () {
    local msg=$1
    local file=$2
    printf "${msg}${red}${file}${nc}\n"
}

printf "Verifying versions match up with app version: ${green}${app_version}${nc}...\n"

if echo "$app_version" | grep -q '-'; then
    if cat dabl-meta.yaml | grep -q 'experimental'; then
        :
    else
        decorate_error "  Missing the ['experimental'] tag in " dabl-meta.yaml
        return_code=1
    fi
else
    if cat dabl-meta.yaml | grep -q 'experimental'; then
        decorate_error "  Found an ['experimental'] tag that must be removed in " dabl-meta.yaml
        return_code=1
    fi
fi

# Escape . characters in the version string
short_version=${short_version//./\\.}

daml_version=`cat daml.yaml | grep "$short_version" | wc -l`
if [[ daml_version -ne 1 ]] ; then
    decorate_error "  Mismatched version in %s" daml.yaml
    return_code=1
fi

daml_trigger_version=`cat triggers/daml.yaml | grep $short_version | wc -l`
if [[ daml_trigger_version -ne 2 ]] ; then
    decorate_error "  Mismatched version(s) in %s" triggers/daml.yaml
    return_code=1
fi

daml_it_version=`cat integrationTesting/daml.yaml | grep $short_version | wc -l`
if [[ daml_it_version -ne 2 ]] ; then
    decorate_error "  Mismatched version(s) in %s" integrationTest/daml.yaml
    return_code=1
fi

exberry_adapter_version=`cat exberry_adapter/setup.py | grep "version='$short_version" | wc -l`
if [[ exberry_adapter_version -ne 1 ]] ; then
    decorate_error "  Mismatched version in %s" exberry_adapter/setup.py
    return_code=1
fi

ui_version=`cat ui/package.json | grep $short_version | wc -l`
if [[ ui_version -ne 2 ]] ; then
    decorate_error "  Mismatched version(s) in %s" package.json
    return_code=1
fi

local_docs_version=`cat docs/local_development.md | grep $short_version | wc -l`
if [[ local_docs_version -ne 1 ]] ; then
    decorate_error "  Mismatched version in %s" docs/local_development.md
    return_code=1
fi

damlhub_docs_version=`cat docs/damlhub_deployment.md | grep $short_version | wc -l`
if [[ damlhub_docs_version -ne 3 ]] ; then
    decorate_error "  Mismatched version(s) in %s" docs/damlhub_deployment.md
    return_code=1
fi

if [[ $return_code -eq 0 ]] ; then
    echo "Success: All versions match!"
else
    printf "\n${orange}Version verification failed :(${nc}\nRun \`${green}make tag${nc}\` to attempt a fix automatically. Commit and push the resulting changes.\n"
fi

exit $return_code
