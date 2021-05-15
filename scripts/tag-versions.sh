# This script writes changes to files to bump versions everywhere that's needed
# Use with caution, and verify results afterwards - it relies on regexes!

#!/bin/bash
set -eu

$app_version=$1
$dabl_meta=$2
$daml_yaml=$3
$daml_yaml_triggers=$4
$daml_yaml_it=$5
$exberry_setup=$6
$package_json=$7
$docs_page=$8

$vregex='[0-9]*\.[0-9]*\.[0-9]*'

yq w -i $daml_yaml 'version' "$app_version"

yq w -i $daml_yaml_triggers 'version' "$app_version"
yq w -i $daml_yaml_triggers 'data-dependencies' ""
yq w -i $daml_yaml_triggers 'data-dependencies[+]' "../.daml/dist/da-marketplace-$app_version.dar"

yq w -i $daml_yaml_it 'version' "$app_version"
yq w -i $daml_yaml_it 'data-dependencies' ""
yq w -i $daml_yaml_it 'data-dependencies[+]' "../.daml/dist/da-marketplace-$app_version.dar"

sed -i "s/version='$vregex/version='$app_version/" $exberry_setup

sed -i "s/\"version\": \"$vregex/\"version\": \"$app_version/" $package_json
sed -i "s/da-marketplace\-$vregex\"/da-marketplace\-$app_version\"/" $package_json

sed -i "s/da-marketplace\-$vregex/da-marketplace\-$app_version/" $docs_page
