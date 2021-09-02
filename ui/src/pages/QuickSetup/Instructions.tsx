import React, { useState } from 'react';

import { useLedger } from '@daml/react';
import { Party, Optional } from '@daml/types';
import _ from 'lodash';

import {
  OperatorOnboarding,
  OnboardingInstruction,
} from '@daml-ui.js/da-marketplace-ui/lib/UI/Onboarding';

import { useStreamQueries } from '../../Main';
import Credentials from '../../Credentials';
import { useVerifiedParties } from '../../config';
import QuickSetupPage from './QuickSetupPage';
import {
  Form,
  Button,
  Header,
  Segment,
  DropdownProps,
  InputOnChangeData,
  DropdownItemProps,
} from 'semantic-ui-react';
import { createDropdownProp } from '../common';
import { ArrowLeftIcon, ArrowRightIcon } from '../../icons/icons';

interface InstFieldsWithTitle {
  title: string;
  instructions: InstFieldsWithType[];
}

enum FieldType {
  PARTIES = 'PARTIES',
  TEXT = 'TEXT',
}

enum InstructionType {
  MARKETCLEARING = 'Market Clearing Service Request',
  CLEARING = 'Clearing Service Request',
  TRADING = 'Trading Service Request',
  CUSTODY = 'Custody Service Request',
  BIDDING = 'Bidding Service Request',
  ISSUANCE = 'Issuance Service Request',
  AUCTION = 'Auction Service Request',

  CLEARINGHOUSE = 'Clearing House',
  EXCHANGE = 'Exchange',
  CUSTODIAN = 'Custodian',
  DISTRIBUTOR = 'Distributor',

  INVESTOR = 'Investor',
  ISSUER = 'Issuer',
  BANK = 'Bank',
}

enum OnboardingTemplate {
  CUSTODY = 'OnboardCustody',
  MARKETCLEARING = 'OnboardMarketClearing',
  CLEARINGHOUSE = 'OnboardClearinghouse',
  CLEARING = 'OnboardClearing',
  EXCHANGE = 'OnboardExchange',
  DISTRIBUTOR = 'OnboardDistributor',
  CUSTODIAN = 'OnboardCustodian',
  TRADING = 'OnboardTrading',
  BIDDING = 'OnboardBidding',
  ISSUANCE = 'OnboardIssuance',
  AUCTION = 'OnboardAuction',
}

type InstructionFields = { [k: string]: string | undefined };

type CustodyInstructionFields = {
  provider?: string;
};

type TradingInstructionFields = {
  provider?: string;
  custodian?: string;
  tradingAccount?: string;
};

type ClearingInstructionFields = {
  provider?: string;
  custodian?: string;
  clearingAccount?: string;
};

type ClearingHouseInstructionFields = {
  custodian?: string;
  clearingAccount?: string;
};

type BiddingInstructionFields = {
  provider?: string;
  custodian?: string;
  tradingAccount?: string;
};

type IssuanceInstructionFields = {
  provider?: string;
  custodian?: string;
  safekeepingAccount?: string;
};

type AuctionInstructionFields = {
  provider?: string;
  custodian?: string;
  tradingAccount?: string;
  receivableAccount?: string;
};

type MarketClearingInstructionFields = {
  provider?: string;
};

type InstFieldsWithType = {
  instructionType: InstructionType;
  fields?: InstructionFields;
};

const InstructionsPage = (props: { adminCredentials: Credentials; isClearedExchange: boolean }) => {
  const { adminCredentials, isClearedExchange } = props;

  const [instructionFields, setInstructionFields] = useState<InstFieldsWithTitle>();

  const instructionTemplates = [
    InstructionType.EXCHANGE,
    InstructionType.BANK,
    InstructionType.CLEARINGHOUSE,
    InstructionType.INVESTOR,
    InstructionType.ISSUER,
  ];

  return (
    <QuickSetupPage className="instructions" adminCredentials={adminCredentials}>
      {!!instructionFields ? (
        <>
          <Header as="h2">{instructionFields.title}</Header>
          <Instructions
            instructionFields={instructionFields?.instructions || []}
            setInstructionFields={setInstructionFields}
          />
        </>
      ) : (
        <div className="setup-page main-select">
          <h4 className="title">Select a role to set up:</h4>
          {instructionTemplates.map(inst => (
            <Button className="main-button dark" onClick={_ => handleNewInstructionFields(inst)}>
              {inst}
            </Button>
          ))}
        </div>
      )}
    </QuickSetupPage>
  );

  function handleNewInstructionFields(inst: InstructionType) {
    switch (inst) {
      case InstructionType.INVESTOR:
        setInstructionFields({
          title: InstructionType.INVESTOR,
          instructions: investorInstructions(isClearedExchange),
        });
        break;
      case InstructionType.ISSUER:
        setInstructionFields({ title: InstructionType.ISSUER, instructions: issuerInstructions() });
        break;
      case InstructionType.EXCHANGE:
        setInstructionFields({
          title: InstructionType.EXCHANGE,
          instructions: exchangeInstructions(isClearedExchange),
        });
        break;
      case InstructionType.BANK:
        setInstructionFields({ title: InstructionType.BANK, instructions: bankInstructions() });
        break;
      default:
        setInstructionFields({
          title: inst,
          instructions: [
            {
              instructionType: inst,
              fields: newInstructionFields(inst),
            },
          ],
        });
    }
  }
};

const makeCustodyInstruction = (provider: Party): OnboardingInstruction => {
  return { tag: OnboardingTemplate.CUSTODY, value: { provider } };
};

const makeMarketClearingInstruction = (provider: Party): OnboardingInstruction => {
  return { tag: OnboardingTemplate.MARKETCLEARING, value: { provider } };
};

const makeClearingHouseInstruction = (
  custodian: string,
  optClearingAccount: Optional<string>
): OnboardingInstruction => {
  return { tag: OnboardingTemplate.CLEARINGHOUSE, value: { custodian, optClearingAccount } };
};

const makeClearingInstruction = (
  provider: Party,
  custodian: string,
  optClearingAccount: Optional<string>
): OnboardingInstruction => {
  return { tag: OnboardingTemplate.CLEARING, value: { custodian, provider, optClearingAccount } };
};

const makeTradingInstruction = (
  provider: Party,
  custodian: Party,
  optTradingAccount: Optional<string>
): OnboardingInstruction => {
  return { tag: OnboardingTemplate.TRADING, value: { custodian, provider, optTradingAccount } };
};

const makeBiddingInstruction = (
  provider: Party,
  custodian: Party,
  optTradingAccount: Optional<string>
): OnboardingInstruction => {
  return { tag: OnboardingTemplate.BIDDING, value: { custodian, provider, optTradingAccount } };
};

const makeIssuanceInstruction = (
  provider: Party,
  custodian: Party,
  optSafekeepingAccount: Optional<string>
): OnboardingInstruction => {
  return {
    tag: OnboardingTemplate.ISSUANCE,
    value: { custodian, provider, optSafekeepingAccount },
  };
};

const makeAuctionInstruction = (
  provider: Party,
  custodian: Party,
  optTradingAccount: Optional<string>,
  optReceivableAccount: Optional<string>
): OnboardingInstruction => {
  return {
    tag: OnboardingTemplate.AUCTION,
    value: { custodian, provider, optTradingAccount, optReceivableAccount },
  };
};

const makeInstruction = (inst: InstFieldsWithType): OnboardingInstruction => {
  switch (inst.instructionType) {
    case InstructionType.TRADING: {
      return makeTradingInstruction(
        inst.fields?.provider || '',
        inst.fields?.custodian || '',
        inst.fields?.tradingAccount || null
      );
    }
    case InstructionType.BIDDING: {
      return makeBiddingInstruction(
        inst.fields?.provider || '',
        inst.fields?.custodian || '',
        inst.fields?.tradingAccount || null
      );
    }
    case InstructionType.CLEARING: {
      return makeClearingInstruction(
        inst.fields?.provider || '',
        inst.fields?.custodian || '',
        inst.fields?.clearingAccount || null
      );
    }
    case InstructionType.AUCTION: {
      return makeAuctionInstruction(
        inst.fields?.provider || '',
        inst.fields?.custodian || '',
        inst.fields?.tradingAccount || null,
        inst.fields?.receivableAccount || null
      );
    }
    case InstructionType.ISSUANCE: {
      return makeIssuanceInstruction(
        inst.fields?.provider || '',
        inst.fields?.custodian || '',
        inst.fields?.safekeepingAccount || null
      );
    }
    case InstructionType.CUSTODY: {
      return makeCustodyInstruction(inst.fields?.provider || '');
    }
    case InstructionType.MARKETCLEARING: {
      return makeMarketClearingInstruction(inst.fields?.provider || '');
    }
    case InstructionType.CLEARINGHOUSE: {
      return makeClearingHouseInstruction(
        inst.fields?.custodian || '',
        inst.fields?.optClearingAccount || null
      );
    }
    case InstructionType.EXCHANGE: {
      return { tag: OnboardingTemplate.EXCHANGE, value: {} };
    }
    case InstructionType.DISTRIBUTOR: {
      return { tag: OnboardingTemplate.DISTRIBUTOR, value: {} };
    }
    case InstructionType.CUSTODIAN: {
      return { tag: OnboardingTemplate.CUSTODIAN, value: {} };
    }
    default: {
      return makeCustodyInstruction('');
    }
  }
};

const getFields = (inst: InstFieldsWithType) => {
  const provider = FieldType.PARTIES;
  const custodian = FieldType.PARTIES;
  const tradingAccount = FieldType.TEXT;
  const clearingAccount = FieldType.TEXT;
  const receivableAccount = FieldType.TEXT;
  const safekeepingAccount = FieldType.TEXT;

  switch (inst.instructionType) {
    case InstructionType.TRADING: {
      return {
        provider,
        custodian,
        tradingAccount,
      };
    }
    case InstructionType.CLEARINGHOUSE: {
      return {
        custodian,
        clearingAccount,
      };
    }
    case InstructionType.BIDDING: {
      return {
        provider,
        custodian,
        tradingAccount,
      };
    }
    case InstructionType.AUCTION: {
      return {
        provider,
        custodian,
        tradingAccount,
        receivableAccount,
      };
    }
    case InstructionType.ISSUANCE: {
      return {
        provider,
        custodian,
        safekeepingAccount,
      };
    }
    case InstructionType.CUSTODY: {
      return {
        provider,
      };
    }
    case InstructionType.MARKETCLEARING: {
      return {
        provider,
      };
    }
    case InstructionType.CLEARING: {
      return {
        provider,
        custodian,
        clearingAccount,
      };
    }
    default: {
      return {};
    }
  }
};

const newInstructionFields = (it: InstructionType) => {
  switch (it) {
    case InstructionType.TRADING: {
      return {} as TradingInstructionFields;
    }
    case InstructionType.CUSTODY: {
      return {} as CustodyInstructionFields;
    }
    case InstructionType.CLEARING: {
      return {} as ClearingInstructionFields;
    }
    case InstructionType.AUCTION: {
      return {} as AuctionInstructionFields;
    }
    case InstructionType.MARKETCLEARING: {
      return {} as MarketClearingInstructionFields;
    }
    case InstructionType.CLEARINGHOUSE: {
      return {} as ClearingHouseInstructionFields;
    }
    case InstructionType.BIDDING: {
      return {} as BiddingInstructionFields;
    }
    case InstructionType.ISSUANCE: {
      return {} as IssuanceInstructionFields;
    }
    default:
      return undefined;
  }
};

const investorInstructions = (isClearedExchange: boolean) => {
  let investorInsts = [InstructionType.CUSTODY, InstructionType.TRADING, InstructionType.BIDDING];
  if (isClearedExchange) {
    investorInsts = [...investorInsts, InstructionType.CLEARING];
  }
  return investorInsts.map(it => {
    return { instructionType: it, fields: newInstructionFields(it) };
  });
};

const bankInstructions = () => {
  return [InstructionType.CUSTODIAN, InstructionType.DISTRIBUTOR].map(it => {
    return { instructionType: it, fields: newInstructionFields(it) };
  });
};

const exchangeInstructions = (isClearedExchange: boolean) => {
  let exchangeInsts = [InstructionType.EXCHANGE];
  if (isClearedExchange) {
    exchangeInsts = [...exchangeInsts, InstructionType.MARKETCLEARING];
  }
  return exchangeInsts.map(it => {
    return { instructionType: it, fields: newInstructionFields(it) };
  });
};

const issuerInstructions = () => {
  return [InstructionType.ISSUANCE, InstructionType.AUCTION, InstructionType.CUSTODY].map(it => {
    return { instructionType: it, fields: newInstructionFields(it) };
  });
};

const Instructions = (props: {
  instructionFields: InstFieldsWithType[];
  setInstructionFields: React.Dispatch<React.SetStateAction<InstFieldsWithTitle | undefined>>;
}) => {
  const { instructionFields, setInstructionFields } = props;

  const ledger = useLedger();
  const { identities } = useVerifiedParties();

  const [onboardParty, setOnboardParty] = useState('');
  const [instructionIndex, setInstructionIndex] = useState(0);

  const { contracts: onboardingContracts } = useStreamQueries(OperatorOnboarding);

  const partyOptions = identities.map(p => {
    return createDropdownProp(p.payload.legalName.replaceAll("'", ''), p.payload.customer);
  });

  if (!onboardingContracts.length)
    return (
      <div className="missing-contract">
        <p>Operator is missing onboarding contract!</p>
      </div>
    );

  const onboardingContract = onboardingContracts[0];

  async function doRunOnboarding() {
    const instructions = instructionFields.map(inst => makeInstruction(inst));
    await ledger.exercise(
      OperatorOnboarding.OperatorOnboard_Onboard,
      onboardingContract.contractId,
      {
        instructions,
        party: onboardParty,
      }
    );
    setOnboardParty('');
    setInstructionFields(undefined);
  }

  const instructionFieldsToDisplay = instructionFields.filter(i => !!i.fields);

  return (
    <div className="instruction-list">
      <Segment basic>
        <Form>
          <h4>1. Select a party:</h4>
          <Form.Select
            disabled={false}
            className="request-select party"
            placeholder="Select..."
            onChange={(_, data: any) => {
              setOnboardParty(data.value as string);
            }}
            options={partyOptions}
            value={onboardParty}
          />
          {instructionFieldsToDisplay.length > 0 && (
            <h4>2. Configure this role's relationships:</h4>
          )}
          {instructionFieldsToDisplay.map((fields, idx) =>
            idx === instructionIndex ? (
              <InstructionFieldInputs
                currentFields={fields}
                idx={idx}
                instructionFields={instructionFields}
                setInstructionFields={setInstructionFields}
                partyOptions={partyOptions}
              />
            ) : null
          )}
          <div className="contract-browse-buttons">
            {instructionFieldsToDisplay.length > 1 && (
              <>
                {instructionIndex > 0 && (
                  <Button
                    className="ghost browse"
                    onClick={() => setInstructionIndex(instructionIndex - 1)}
                  >
                    <ArrowLeftIcon /> Previous
                  </Button>
                )}

                {instructionIndex < instructionFieldsToDisplay.length - 1 && (
                  <Button
                    className="ghost submit icon-right browse"
                    onClick={() => setInstructionIndex(instructionIndex + 1)}
                  >
                    Next <ArrowRightIcon />
                  </Button>
                )}
              </>
            )}

            {instructionIndex >= instructionFieldsToDisplay.length - 1 && (
              <Button className="ghost submit" onClick={doRunOnboarding}>
                Submit
              </Button>
            )}
          </div>
        </Form>
      </Segment>
    </div>
  );
};

type InstructionFieldsProps = {
  currentFields: InstFieldsWithType;
  idx: number;
  instructionFields: InstFieldsWithType[];
  setInstructionFields: React.Dispatch<React.SetStateAction<InstFieldsWithTitle | undefined>>;
  partyOptions: DropdownItemProps[];
};

const InstructionFieldInputs: React.FC<InstructionFieldsProps> = ({
  currentFields,
  idx,
  instructionFields,
  setInstructionFields,
  partyOptions,
}) => {
  return (
    <div className="instruction-fields">
      <Header as="h3">{currentFields.instructionType}</Header>
      <Form.Group>
        {_.toPairs(getFields(currentFields)).map(([k, field]) => {
          const updateInstructionTypes = (_: any, data: DropdownProps | InputOnChangeData) => {
            setInstructionFields(old => {
              let listCopy = [...(old?.instructions || [])];
              let instCopy = { ...currentFields };
              (instCopy.fields || {})[k] = data.value as string;
              listCopy[idx] = instCopy;
              return { title: old?.title || '', instructions: listCopy };
            });
          };
          if (field === FieldType.PARTIES) {
            return (
              <Form.Select
                disabled={false}
                className="request-select"
                label={<p className="input-label">{formatCamelcaseToString(k)}</p>}
                placeholder="Select..."
                onChange={updateInstructionTypes}
                options={partyOptions}
                value={(instructionFields[idx].fields || {})[k] || ''}
              />
            );
          } else {
            return (
              <Form.Input
                disabled={false}
                className="request-select"
                label={<p className="input-label">{formatCamelcaseToString(k)}</p>}
                placeholder="Select..."
                onChange={updateInstructionTypes}
                value={(instructionFields[idx].fields || {})[k]}
              />
            );
          }
        })}
      </Form.Group>
    </div>
  );
};

function formatCamelcaseToString(text: string) {
  var result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export default InstructionsPage;
