[← back](../README.md)

# Deploying to Daml Hub

These instructions will show you how to build and deploy the Marketplace to the Daml Hub cloud service.

## Pre-requisites

Ensure you have installed the dependencies as noted on the main README. Note that the build process
currently only works on Unix-based operating systems, such as macOS and GNU/Linux.

Windows development is not fully supported yet. It may be possible to follow these steps through
[Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/), though this is largely untested.

## Build the DIT file

First, package a DIT from a clean slate if you haven't already.

```
make clean && make package
```

This will build the model, UI, and triggers, as well as package the project in a `.dit` file which can be uploaded to Daml Hub.

## Create the Project

Open https://hub.daml.com. Once you are logged in, click on "New Project":

![1_create_project](https://user-images.githubusercontent.com/71082197/98857327-ec817480-242c-11eb-9bfe-972dd5b7aa7b.png)

Next, enter a name and a ledger name for this project:

![2_name_project](https://user-images.githubusercontent.com/71082197/98857328-ec817480-242c-11eb-9d03-8e7a0f260dd1.png)

Once the project is created, click on the ledger in the Workspace. This will take you to the ledger's details.

## Upload and launch the DAR model and UI

Under the deployments tab, click on "Upload File":

![3_upload_file](https://user-images.githubusercontent.com/71082197/98857330-ec817480-242c-11eb-8b07-4b0f88d3a39f.png)

Upload the packaged `da-marketplace-0.2.0-rc.2.dit` file.

Click "Launch" for both the UI and the Model:

![4_launch_dar](https://user-images.githubusercontent.com/71082197/98964004-4c802580-24d6-11eb-83bf-221a9d2ce9fa.png)

### Add the parties

Next, add the parties. Click on the "Identities" tab, and add the `UserAdmin` party by clicking the "Plus" next to its name:

![5_add_public](https://user-images.githubusercontent.com/71082197/98857333-ed1a0b00-242c-11eb-809a-a7a8a5e983ef.png)

Add the following parties by clicking the "+ Add Party" button: `Alice`, `Bob`, `Exchange`, `Broker`, `UsdtIssuer`, `BtcIssuer`, `Ccp`, and `Custodian`:

![6_add_parties](https://user-images.githubusercontent.com/71082197/98857334-ed1a0b00-242c-11eb-8f6a-4e385baca6f8.png)

### Bootstrap with example data (optional)

Click the "Ledger Settings" tab, and download the `participants.json` file:

![7_participants](https://user-images.githubusercontent.com/71082197/98857335-ed1a0b00-242c-11eb-9074-ff3c9d3c32f3.png)

In your marketplace repo:

```sh
# creates a ledger_parties.json file that maps the Daml Hub party IDs to party names
$ ./scripts/create_ledger_parties.py path/to/participants.json ledger_parties.json

# runs a Daml Script that adds all relevant information to the project ledger
$ daml script --participant-config participants.json --json-api --dar .daml/dist/da-marketplace-0.2.0.dar --script-name Setup:doSetup --input-file ledger-parties.json
```

If you would like to boostrap the marketplace with your own data, you can either change the `doSetup` function in `daml/Setup.daml`, or create your own setup function and change the `--script-name` to `MyModule:myFunction`.

### Add the Operator Role Contract

If you have **not** bootstrapped the data, you must manually add a role contract for the `UserAdmin` party.

On the "Live Data" tab, select the `UserAdmin` party and click "Add Contract":
![oc01_select_add](https://user-images.githubusercontent.com/71082197/101641394-b0c3d580-39ff-11eb-94bd-6198dce25b70.png)

Then, select the `Marketplace.Operator.Role:Role` template, fill in `UserAdmin` for the `Operator`, and click "Submit":

![oc02_submit](https://user-images.githubusercontent.com/71082197/101641542-e072dd80-39ff-11eb-878e-7353730a46a6.png)

### Deploy the Trigger Automation

There are two ways to deploy automations. The recommended approach is to go through the Quick Setup page on the Marketplace app UI (accessible from `ledgerid.projectdabl.com` after deployment). This automatically deploys Auto Approve triggers for all parties, and allows you to deploy other automations on a per party basis.

You can also deploy triggers through Daml Hub, in the Deployments tab.

Aside from auto approve triggers for all parties, launch and configure each trigger with the following parties:

| Trigger                        | Party      | Notes                                                           |
| ------------------------------ | ---------- | --------------------------------------------------------------- |
| `SettlementInstructionTrigger` | `Bank`     |                                                                 |
| `ClearingTrigger`              | `Ccp`      |                                                                 |
| `MatchingEngine`               | `Exchange` | Optional. Do this if you are not using the Exberry Integration. |

After uploading, add the first configuration (the human readable name has no bearing on the functionality of the bot), and click launch:

![t01_deploy_action](https://user-images.githubusercontent.com/71082197/101640600-b371fb00-39fe-11eb-844e-1fc939f8f806.png)

For the rest of the deployments, first click the deployed trigger:
![t02_click_bot](https://user-images.githubusercontent.com/71082197/101640601-b371fb00-39fe-11eb-8be6-f5a1e6d2489f.png)

Then "Configure New Deployment":
![t03_configure_new](https://user-images.githubusercontent.com/71082197/101640602-b371fb00-39fe-11eb-9248-2e4d8938d275.png)

### View UI

After all deployments are running, you can click the "View Site" button to visit the Marketplace UI:

![11_view_site](https://user-images.githubusercontent.com/71082197/98857340-edb2a180-242c-11eb-9989-55aafc66199f.png)

The Party ID/Party JWTs to use to login with various parties can be found on the "Users" tab of the console:

![u01_user_tab](https://user-images.githubusercontent.com/71082197/101642392-f3d27880-3a00-11eb-8ea5-3cdf64c3828b.png)

### Exberry Matching Engine (optional)

If you would like to use the [Exberry Matching Engine](https://exberry.io/) instead of the matching engine trigger, first add the integration to your project on the "Browse Integrations" tab:

![12_exberry_integration](https://user-images.githubusercontent.com/71082197/98867810-32463900-243d-11eb-862d-0a9b322c6fef.png)

Next, in deployments, click on the Integration and configure it with your Exberry credentials and click "Launch". It should run as the `Exchange` party:

![13_click_exberry](https://user-images.githubusercontent.com/71082197/98867872-50139e00-243d-11eb-8448-479e46fd85df.png)

Finally, deploy an instance of `da-marketplace-exberry-adapter-0.2.0.tar.gz` and launch the automation as `Exchange`.

If you would like to change which `SID` the Exberry adapter begins counting at for the `orderId` calls to Exberry, create a `Marketplace.Utils.ExberrySID` contract as the `Exchange` party _after_ launching the adapter.
