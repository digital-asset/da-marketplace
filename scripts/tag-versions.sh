#!/bin/bash
set -eu

# This script writes changes to files to bump versions everywhere that's needed
# Use with caution, and verify results afterwards - it relies on regexes!

app_version=$1

# Should match a semver subset of things like: "1.2.3", "1.2.3-rc.1", "42.10.999-alpha.87"
# This requires the -r flag to sed, which enables extended regular expressions
vregex='[0-9]*\.[0-9]*\.[0-9]*(-[a-zA-Z]*\.[0-9]*)?'

# daml.yaml files can't handle full semver versions, keep just the
# MAJOR.MINOR.PATCH fields for them
capture_regex="([0-9]*)\.([0-9]*)\.([0-9]*)(-[a-zA-Z]*\.[0-9]*)?"
daml_version=$(echo $app_version | sed -r "s/^$capture_regex/\1.\2.\3/")

echo "Application version is $app_version, Daml version is $daml_version."

dabl_meta=$2
daml_yaml=$3
daml_yaml_triggers=$4
daml_yaml_it=$5
exberry_setup=$6
package_json=$7
docs_localdev=$8
docs_damlhub=$9

echo "Retagging versions in all files..."

echo "  Tagging dabl-meta.yaml"
if echo "$app_version" | grep -q '-'; then
    sed -ri "s/tags:.*/tags: [dabl-sample-app, application, experimental]/" $dabl_meta
else
    sed -ri "s/tags:.*/tags: [dabl-sample-app, application]/" $dabl_meta
fi

echo "  Tagging daml.yaml"
yq w -i $daml_yaml 'version' "$daml_version"

echo "  Tagging triggers daml.yaml"
yq w -i $daml_yaml_triggers 'version' "$daml_version"
yq w -i $daml_yaml_triggers 'data-dependencies' ""
yq w -i $daml_yaml_triggers 'data-dependencies[+]' "../.daml/dist/da-marketplace-$daml_version.dar"

echo "  Tagging integrationTesting daml.yaml"
yq w -i $daml_yaml_it 'version' "$daml_version"
yq w -i $daml_yaml_it 'data-dependencies' ""
yq w -i $daml_yaml_it 'data-dependencies[+]' "../.daml/dist/da-marketplace-$daml_version.dar"

echo "  Tagging exberry_adapter setup.py"
sed -ri "s/version='$vregex/version='$daml_version/" $exberry_setup

echo "  Tagging ui package.json"
sed -ri "s/\"version\": \"$vregex/\"version\": \"$app_version/" $package_json
sed -ri "s/da-marketplace\-$vregex\"/da-marketplace\-$daml_version\"/" $package_json

echo "  Tagging docs"
sed -ri "s/da-marketplace\-$vregex/da-marketplace\-$daml_version/" $docs_localdev

echo "HUHHHH $app_version $daml_version $docs_damlhub"
sed -ri "s/da-marketplace\-$vregex.dit/da-marketplace\-$app_version.dit/" $docs_damlhub
sed -ri "s/da-marketplace\-$vregex.dar/da-marketplace\-$daml_version.dar/" $docs_damlhub
sed -ri "s/da-marketplace-exberry-adapter\-$vregex/da-marketplace-exberry-adapter\-$daml_version/" $docs_damlhub

echo "Tagged all files... check results before committing"
