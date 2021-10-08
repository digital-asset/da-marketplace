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
short_version=$(echo $app_version | sed -r "s/^$capture_regex/\1.\2.\3/")

echo "Application version is $app_version, short version is $short_version."

dit_meta=$2
daml_yaml=$3
daml_yaml_triggers=$4
daml_yaml_trigger_test=$5
daml_yaml_ui=$6
exberry_setup=$7
package_json=$8
docs_localdev=$9
docs_damlhub=${10}
docs_trigger_test=${11}

echo "Retagging versions in all files..."

echo "  Tagging dit-meta.yaml"
if echo "$app_version" | grep -q '-'; then
    sed -ri "s/tags:.*/tags: [dabl-sample-app, application, experimental]/" $dit_meta
else
    sed -ri "s/tags:.*/tags: [dabl-sample-app, application]/" $dit_meta
fi

echo "  Tagging daml.yaml"
yq w -i $daml_yaml 'version' "$short_version"

echo "  Tagging triggers daml.yaml"
yq w -i $daml_yaml_triggers 'version' "$short_version"
yq w -i $daml_yaml_triggers 'data-dependencies' ""
yq w -i $daml_yaml_triggers 'data-dependencies[+]' "../.daml/dist/da-marketplace-$short_version.dar"

echo "  Tagging automation tests daml.yaml"
yq w -i $daml_yaml_trigger_test 'version' "$short_version"
yq w -i $daml_yaml_trigger_test 'dependencies' ""
yq w -i $daml_yaml_trigger_test 'dependencies[+]' "daml-prim"
yq w -i $daml_yaml_trigger_test 'dependencies[+]' "daml-stdlib"
yq w -i $daml_yaml_trigger_test 'dependencies[+]' "daml-trigger"
yq w -i $daml_yaml_trigger_test 'dependencies[+]' "../../.daml/dist/da-marketplace-$short_version.dar"

echo "  Tagging ui daml.yaml"
yq w -i $daml_yaml_ui 'version' "$short_version"
yq w -i $daml_yaml_ui 'data-dependencies' ""
yq w -i $daml_yaml_ui 'data-dependencies[+]' "../.daml/dist/da-marketplace-$short_version.dar"

echo "  Tagging exberry_adapter setup.py"
sed -ri "s/version='$vregex/version='$short_version/" $exberry_setup

echo "  Tagging ui package.json"
sed -ri "s/\"version\": \"$vregex/\"version\": \"$app_version/" $package_json
sed -ri "s/da-marketplace\-$vregex\"/da-marketplace\-$short_version\"/" $package_json
sed -ri "s/da-marketplace-ui\-$vregex\"/da-marketplace-ui\-$short_version\"/" $package_json

echo "  Tagging docs"
sed -ri "s/da-marketplace\-$vregex/da-marketplace\-$short_version/" $docs_localdev

sed -ri "s/da-marketplace\-$vregex.dit/da-marketplace\-$app_version.dit/" $docs_damlhub
sed -ri "s/da-marketplace\-$vregex.dar/da-marketplace\-$short_version.dar/" $docs_damlhub
sed -ri "s/da-marketplace-exberry-adapter\-$vregex/da-marketplace-exberry-adapter\-$short_version/" $docs_damlhub
sed -ri "s/marketplace-matching-test\-$vregex/marketplace-matching-test\-$short_version/" $docs_trigger_test

echo "Tagged all files... check results before committing"
