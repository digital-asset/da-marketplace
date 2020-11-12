import json
import sys

if len(sys.argv) < 3:
    print('Convert a participants.json file from the DABL console to a JSON format readable by the DAML Script runner')
    sys.exit('$ python create_ledger_parties.py {path/to/particpants.json} {path/to/output.json}')

inPath = sys.argv[1]
outPath = sys.argv[2]

with open(inPath) as inFile:
    participants = json.load(inFile)
    participants = participants['party_participants']
    ledgerParties = {}

    for key,val in participants.items():
        ledgerParties[val] = key

with open(outPath, 'w+') as outFile:
    json.dump(ledgerParties, outFile, indent=4)
