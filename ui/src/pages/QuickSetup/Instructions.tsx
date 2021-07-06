import React, { useEffect, useState } from 'react';

import classNames from 'classnames';

import DamlLedger, { useLedger } from '@daml/react';
import { CreateEvent } from '@daml/ledger';
import { Choice, ContractId, Party, Optional } from '@daml/types';
import _ from 'lodash';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import {
  OperatorOnboarding,
  OnboardingInstruction,
} from '@daml.js/da-marketplace/lib/UI/Onboarding';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

import { RolesProvider, useRolesContext } from '../../context/RolesContext';
import { OffersProvider } from '../../context/OffersContext';
import { AutomationProvider, useAutomations } from '../../context/AutomationContext';

import QueryStreamProvider from '../../websocket/queryStream';
import { useStreamQueries } from '../../Main';
import { retrieveParties } from '../../Parties';
import Credentials, { computeToken } from '../../Credentials';
import {
  httpBaseUrl,
  wsBaseUrl,
  publicParty,
  isHubDeployment,
  useVerifiedParties,
} from '../../config';
import QuickSetupPage from './QuickSetupPage';
import { LoadingWheel, MenuItems } from './QuickSetup';
import { Label, Form, Button, Header, Divider, Segment } from 'semantic-ui-react';
import { createDropdownProp } from '../common';
import { ArrowLeftIcon } from '../../icons/icons';

const InstructionsPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;

  return (
    <DamlLedger
      token={adminCredentials.token}
      party={adminCredentials.party}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}
    >
      <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
        <AutomationProvider publicParty={publicParty}>
          <RolesProvider>
            <OffersProvider>
              <TestInstructions />
            </OffersProvider>
          </RolesProvider>
        </AutomationProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

const makeCustodyInstruction = (provider: Party): OnboardingInstruction => {
  return { tag: 'OnboardCustody', value: { provider } };
};

const makeTradingInstruction = (
  provider: Party,
  custodian: Party,
  optTradingAccount: Optional<string>
): OnboardingInstruction => {
  return { tag: 'OnboardTrading', value: { custodian, provider, optTradingAccount } };
};

const makeBiddingInstruction = (
  provider: Party,
  custodian: Party,
  optTradingAccount: Optional<string>
): OnboardingInstruction => {
  return { tag: 'OnboardBidding', value: { custodian, provider, optTradingAccount } };
};

const makeIssuanceInstruction = (
  provider: Party,
  custodian: Party,
  optSafekeepingAccount: Optional<string>
): OnboardingInstruction => {
  return { tag: 'OnboardIssuance', value: { custodian, provider, optSafekeepingAccount } };
};

const makeClearingInstruction = (
  provider: Party,
  custodian: Party,
  optClearingAccount: Optional<string>
): OnboardingInstruction => {
  return { tag: 'OnboardClearing', value: { custodian, provider, optClearingAccount } };
};

const makeAuctionInstruction = (
  provider: Party,
  custodian: Party,
  optTradingAccount: Optional<string>,
  optReceivableAccount: Optional<string>
): OnboardingInstruction => {
  return {
    tag: 'OnboardAuction',
    value: { custodian, provider, optTradingAccount, optReceivableAccount },
  };
};

const makeInstruction = (inst: InstFieldsWithType): OnboardingInstruction => {
  switch (inst.instructionType) {
    case InstructionType.TRADING: {
      return makeTradingInstruction(
        inst.empty.provider || '',
        inst.empty.custodian || '',
        inst.empty.tradingAccount || null
      );
    }
    case InstructionType.BIDDING: {
      return makeBiddingInstruction(
        inst.empty.provider || '',
        inst.empty.custodian || '',
        inst.empty.tradingAccount || null
      );
    }
    case InstructionType.CLEARING: {
      return makeClearingInstruction(
        inst.empty.provider || '',
        inst.empty.custodian || '',
        inst.empty.clearingAccount || null
      );
    }
    case InstructionType.AUCTION: {
      return makeAuctionInstruction(
        inst.empty.provider || '',
        inst.empty.custodian || '',
        inst.empty.tradingAccount || null,
        inst.empty.receivableAccount || null
      );
    }
    case InstructionType.ISSUANCE: {
      return makeIssuanceInstruction(
        inst.empty.provider || '',
        inst.empty.custodian || '',
        inst.empty.safekeepingAccount || null
      );
    }
    case InstructionType.CUSTODY: {
      return makeCustodyInstruction(inst.empty.provider || '');
    }
    default: {
      return makeCustodyInstruction('');
    }
  }
};

type EmptyIntstruction = { [k: string]: string | undefined };

type EmptyCustodyInstruction = {
  provider?: string;
};

type EmptyTradingInstruction = {
  provider?: string;
  custodian?: string;
  tradingAccount?: string;
};

type EmptyClearingInstruction = {
  provider?: string;
  custodian?: string;
  clearingAccount?: string;
};

type EmptyBiddingInstruction = {
  provider?: string;
  custodian?: string;
  tradingAccount?: string;
};

type EmptyIssuanceInstruction = {
  provider?: string;
  custodian?: string;
  safekeepingAccount?: string;
};

type EmptyAuctionInstruction = {
  provider?: string;
  custodian?: string;
  tradingAccount?: string;
  receivableAccount?: string;
};

enum FieldType {
  PARTIES = 'PARTIES',
  TEXT = 'TEXT',
}

enum InstructionType {
  TRADING = 'Trading',
  CUSTODY = 'Custody',
  CLEARING = 'Clearing',
  BIDDING = 'Bidding',
  ISSUANCE = 'Issuance',
  AUCTION = 'Auction',
}

type InstFieldsWithType = {
  instructionType: InstructionType;
  empty: EmptyIntstruction;
};

const getFields = (inst: InstFieldsWithType) => {
  switch (inst.instructionType) {
    case InstructionType.TRADING: {
      return {
        provider: FieldType.PARTIES,
        custodian: FieldType.PARTIES,
        tradingAccount: FieldType.TEXT,
      };
    }
    case InstructionType.CLEARING: {
      return {
        provider: FieldType.PARTIES,
        custodian: FieldType.PARTIES,
        clearingAccount: FieldType.TEXT,
      };
    }
    case InstructionType.BIDDING: {
      return {
        provider: FieldType.PARTIES,
        custodian: FieldType.PARTIES,
        tradingAccount: FieldType.TEXT,
      };
    }
    case InstructionType.AUCTION: {
      return {
        provider: FieldType.PARTIES,
        custodian: FieldType.PARTIES,
        tradingAccount: FieldType.TEXT,
        receivableAccount: FieldType.TEXT,
      };
    }
    case InstructionType.ISSUANCE: {
      return {
        provider: FieldType.PARTIES,
        custodian: FieldType.PARTIES,
        safekeepingAccount: FieldType.TEXT,
      };
    }
    case InstructionType.CUSTODY: {
      return {
        provider: FieldType.PARTIES,
      };
    }
    default: {
      return;
      {
      }
    }
  }
};

const newEmptyInstruction = (it: InstructionType) => {
  switch (it) {
    case InstructionType.TRADING: {
      return {} as EmptyTradingInstruction;
    }
    case InstructionType.CUSTODY: {
      return {} as EmptyCustodyInstruction;
    }
    case InstructionType.CLEARING: {
      return {} as EmptyClearingInstruction;
    }
    case InstructionType.AUCTION: {
      return {} as EmptyAuctionInstruction;
    }
    case InstructionType.BIDDING: {
      return {} as EmptyBiddingInstruction;
    }
    case InstructionType.ISSUANCE: {
      return {} as EmptyIssuanceInstruction;
    }
  }
};

const investorInstructions = [
  InstructionType.CUSTODY,
  InstructionType.TRADING,
  InstructionType.BIDDING,
].map(it => {
  return { instructionType: it, empty: newEmptyInstruction(it) };
});

const issuerInstructions = [
  InstructionType.ISSUANCE,
  InstructionType.AUCTION,
].map(it => {
  return { instructionType: it, empty: newEmptyInstruction(it) };
});

const TestInstructions = () => {
  const ledger = useLedger();
  const automations = useAutomations();

  const { identities, loading: identitiesLoading } = useVerifiedParties();

  const [onboardParty, setOnboardParty] = useState('');
  const [instructions, setInstructions] = useState<OnboardingInstruction[]>([]);
  const [instructionTypes, setInstructionTypes] = useState<InstFieldsWithType[]>([]);

  const [currentAddInstruction, setCurrentAddInstruction] = useState<InstructionType | undefined>();

  const { contracts: onboardingContracts, loading: onboardingLoading } =
    useStreamQueries(OperatorOnboarding);

  const partyOptions = identities.map(p => {
    return { text: p.payload.legalName, value: p.payload.customer };
  });

  if (!onboardingContracts.length) return <></>;
  const onboardingContract = onboardingContracts[0];

  return (
    <QuickSetupPage
      className="test-instructions"
      title="Create Instructions List"
      nextItem={MenuItems.REQUEST_SERVICES}
    >
      <div className="page-row">
        <div className="add-clear">
          <Form>
            <Form.Group>
              <Form.Select
                options={[
                  createDropdownProp('Trading', InstructionType.TRADING),
                  createDropdownProp('Custody', InstructionType.CUSTODY),
                  createDropdownProp('Bidding', InstructionType.BIDDING),
                  createDropdownProp('Clearing', InstructionType.CLEARING),
                  createDropdownProp('Issuance', InstructionType.ISSUANCE),
                  createDropdownProp('Auction', InstructionType.AUCTION),
                  createDropdownProp('Investor (template)', 'INVESTOR_TEMPLATE'),
                  createDropdownProp('Issuer (template)', 'ISSUER_TEMPLATE'),
                ].filter(dtp => !instructionTypes.find(et => et.instructionType === dtp.value))}
                onChange={(_, data) => {
                  if ((data.value as string) === 'INVESTOR_TEMPLATE') {
                    setInstructionTypes(investorInstructions);
                  } else if ((data.value as string) === 'ISSUER_TEMPLATE') {
                    setInstructionTypes(issuerInstructions);
                  } else {
                    setInstructionTypes([
                      ...instructionTypes,
                      {
                        instructionType: data.value as InstructionType,
                        empty: newEmptyInstruction(data.value as InstructionType),
                      },
                    ]);
                  }
                }}
                value={currentAddInstruction}
              />
              <Button
                onClick={() => {
                  setInstructionTypes([]);
                }}
              >
                Clear
              </Button>
            </Form.Group>
          </Form>
        </div>
        <div className="test">
          <Segment basic>
            <Form>
              {instructionTypes.map((ei, idx) => (
                <div className="instruction-fields">
                  <div className="instruction-header">
                    <Header as="h2">{ei.instructionType}</Header>
                  </div>
                  <Form.Group>
                    {_.toPairs(getFields(ei)).map(([k, field]) => {
                      if (field === FieldType.PARTIES) {
                        return (
                          <Form.Select
                            disabled={false}
                            className="request-select"
                            label={<p className="input-label">{k}</p>}
                            placeholder="Select..."
                            onChange={(_, data: any) => {
                              setInstructionTypes(old => {
                                let listCopy = [...old];
                                let instCopy = { ...ei };
                                instCopy.empty[k] = data.value as string;
                                listCopy[idx] = instCopy;
                                return listCopy;
                              });
                            }}
                            options={partyOptions}
                            value={instructionTypes[idx].empty[k]}
                          />
                        );
                      } else {
                        return (
                          <Form.Input
                            disabled={false}
                            className="request-select"
                            label={<p className="input-label">{k}</p>}
                            placeholder="Select..."
                            onChange={(_, data: any) => {
                              setInstructionTypes(old => {
                                let listCopy = [...old];
                                let instCopy = { ...ei };
                                instCopy.empty[k] = data.value as string;
                                listCopy[idx] = instCopy;
                                return listCopy;
                              });
                            }}
                            value={instructionTypes[idx].empty[k]}
                          />
                        );
                      }
                    })}
                  </Form.Group>
                  <Divider horizontal> </Divider>
                </div>
              ))}
                <Form.Select
                  disabled={false}
                  className="request-select"
                  label={<p className="input-label">Party</p>}
                  placeholder="Select..."
                  onChange={(_, data: any) => {
                    setOnboardParty(data.value as string);
                  }}
                  options={partyOptions}
                  value={onboardParty}
                />
                <Button
                  onClick={() => {
                    const instructions = instructionTypes.map(inst => makeInstruction(inst));
                    console.log(instructionTypes);
                    doRunOnboarding(instructions);
                  }}
                >
                  {' '}
                  Go!
                </Button>
            </Form>
          </Segment>
        </div>
      </div>
    </QuickSetupPage>
  );

  async function doRunOnboarding(instructions: OnboardingInstruction[]) {
    await ledger.exercise(
      OperatorOnboarding.OperatorOnboard_Onboard,
      onboardingContract.contractId,
      {
        instructions,
        party: onboardParty,
      }
    );
    setOnboardParty('');
  }
};

export function formatTriggerName(name: string) {
  return name
    .split('#')[0]
    .split(':')[0]
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

export default InstructionsPage;
