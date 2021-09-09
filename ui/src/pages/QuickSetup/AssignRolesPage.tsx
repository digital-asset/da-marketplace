import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Form,
  Button,
  Header,
  Checkbox,
  Segment,
  DropdownProps,
  InputOnChangeData,
  DropdownItemProps,
} from 'semantic-ui-react';
import classNames from 'classnames';
import _ from 'lodash';

import { useLedger } from '@daml/react';
import { Party, Optional } from '@daml/types';

import {
  OperatorOnboarding,
  OnboardingInstruction,
} from '@daml-ui.js/da-marketplace-ui/lib/UI/Onboarding';

import { ArrowLeftIcon, ArrowRightIcon } from '../../icons/icons';
import { useVerifiedParties } from '../../config';
import { useStreamQueries } from '../../Main';
import { createDropdownProp } from '../common';
import Credentials from '../../Credentials';

import { LoadingWheel } from './QuickSetup';
import QuickSetupPage from './QuickSetupPage';

interface InstFieldsWithTitle {
  title: string;
  instructions: InstFieldsWithType[];
}

enum FieldType {
  PARTIES = 'PARTIES',
  TEXT = 'TEXT',
}

enum InstructionType {
  MARKETCLEARING = 'Market Clearing Service',
  CLEARING = 'Clearing Service',
  TRADING = 'Trading Service',
  CUSTODY = 'Custody Service ',
  BIDDING = 'Bidding Service',
  ISSUANCE = 'Issuance Service',
  AUCTION = 'Auction Service',

  CUSTODIAN = 'Custodian Role',
  DISTRIBUTOR = 'Distributor Role',
  CLEARINGHOUSE = 'Clearing House Role',

  EXCHANGE = 'Exchange Role',
  INVESTOR = 'Investor Role',
  ISSUER = 'Issuer Role',
  BANK = 'Bank Role',
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
  custodian?: string;
};

type InstFieldsWithType = {
  instructionType: InstructionType;
  fields?: InstructionFields;
};

const AssignRolesPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;

  const history = useHistory();

  const [instructionFields, setInstructionFields] = useState<InstFieldsWithTitle>();
  const [isClearedExchange, setIsClearedExchange] = useState(false);

  const instructionTemplates = [
    InstructionType.EXCHANGE,
    InstructionType.BANK,
    InstructionType.CLEARINGHOUSE,
    InstructionType.INVESTOR,
    InstructionType.ISSUER,
  ];

  return (
    <QuickSetupPage
      className={classNames('assign-roles', { 'main-select': !instructionFields })}
      adminCredentials={adminCredentials}
    >
      <Button
        className="ghost dark control-button"
        onClick={() => (instructionFields ? setInstructionFields(undefined) : history.goBack())}
      >
        <ArrowLeftIcon color={'white'} />
        Back
      </Button>
      {!!instructionFields ? (
        <>
          <Header as="h2">{instructionFields.title}</Header>
          <Instructions
            instructionFields={instructionFields}
            setInstructionFields={setInstructionFields}
            isClearedExchange={isClearedExchange}
            toggleIsClearedExchange={handleToggleIsClearedExchange}
          />
        </>
      ) : (
        <>
          <h4 className="title dark">Select a role to set up:</h4>
          {instructionTemplates.map(inst => (
            <Button
              className="main-button ghost dark"
              onClick={_ => handleNewInstructionFields(inst)}
            >
              {inst.replace('Role', '')}
            </Button>
          ))}
        </>
      )}
    </QuickSetupPage>
  );

  function handleToggleIsClearedExchange() {
    const title = instructionFields?.title as InstructionType;

    switch (title) {
      case InstructionType.INVESTOR:
        setInstructionFields({
          title: InstructionType.INVESTOR,
          instructions: investorInstructions(!isClearedExchange),
        });
        break;
      case InstructionType.EXCHANGE:
        setInstructionFields({
          title: InstructionType.EXCHANGE,
          instructions: exchangeInstructions(!isClearedExchange),
        });
        break;
    }
    setIsClearedExchange(!isClearedExchange);
  }

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

const makeMarketClearingInstruction = (
  provider: Party,
  custodian: string
): OnboardingInstruction => {
  return { tag: OnboardingTemplate.MARKETCLEARING, value: { provider, custodian } };
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
      return makeMarketClearingInstruction(
        inst.fields?.provider || '',
        inst.fields?.custodian || ''
      );
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
        custodian,
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
      return undefined;
    }
  }
};

const newInstructionFields = (it: InstructionType, provider?: string, custodian?: string) => {
  switch (it) {
    case InstructionType.TRADING: {
      return {
        provider,
        custodian,
        tradingAccount: 'Exchange-TradingAccount',
      } as TradingInstructionFields;
    }
    case InstructionType.CUSTODY: {
      return { provider } as CustodyInstructionFields;
    }
    case InstructionType.CLEARING: {
      return {
        provider,
        custodian,
        clearingAccount: 'Clearing-ClearingAccount',
      } as ClearingInstructionFields;
    }
    case InstructionType.AUCTION: {
      return {
        provider,
        custodian,
        tradingAccount: 'Auction-TradingAccount',
        receivableAccount: 'Auction-ReceivableAccount',
      } as AuctionInstructionFields;
    }
    case InstructionType.MARKETCLEARING: {
      return { provider, custodian } as MarketClearingInstructionFields;
    }
    case InstructionType.CLEARINGHOUSE: {
      return {
        custodian,
        clearingAccount: 'Clearing-Bank',
      } as ClearingHouseInstructionFields;
    }
    case InstructionType.BIDDING: {
      return {
        provider,
        custodian,
        tradingAccount: 'Bidding-TradingAccount',
      } as BiddingInstructionFields;
    }
    case InstructionType.ISSUANCE: {
      return {
        provider,
        custodian,
        safekeepingAccount: 'Issuance-optSafekeepingAccount',
      } as IssuanceInstructionFields;
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
  return [InstructionType.CUSTODY, InstructionType.ISSUANCE, InstructionType.AUCTION].map(it => {
    return { instructionType: it, fields: newInstructionFields(it) };
  });
};

const Instructions = (props: {
  instructionFields: InstFieldsWithTitle;
  setInstructionFields: React.Dispatch<React.SetStateAction<InstFieldsWithTitle | undefined>>;
  isClearedExchange: boolean;
  toggleIsClearedExchange: () => void;
}) => {
  const { instructionFields, setInstructionFields, isClearedExchange, toggleIsClearedExchange } =
    props;

  const ledger = useLedger();

  const { instructions, title } = instructionFields;

  const { identities, loading: loadingIdentities } = useVerifiedParties();

  const partyOptions = identities.map(p => {
    return createDropdownProp(p.payload.legalName.replaceAll("'", ''), p.payload.customer);
  });

  const currentParty = identities
    .filter(p => title.includes(p.payload.legalName.replaceAll("'", '') as string))
    .map(pa => pa.payload.customer);

  const [onboardParties, setOnboardParties] = useState<string[]>(currentParty);
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [loadingInstructions, setLoadingInstructions] = useState(false);

  const { contracts: onboardingContracts, loading } = useStreamQueries(OperatorOnboarding);

  useEffect(() => {
    setInstructionIndex(0);
  }, [isClearedExchange]);

  if (loadingInstructions || loading || loadingIdentities) {
    return <LoadingWheel label={'Loading'} />;
  }

  if (!onboardingContracts.length)
    return (
      <div className="missing-contract">
        <p>Operator is missing onboarding contract!</p>
      </div>
    );

  const onboardingContract = onboardingContracts[0];

  async function doRunOnboarding() {
    if (onboardParties.length === 0) {
      return;
    }
    setLoadingInstructions(true);

    const commandInstructions = instructions.map(inst => makeInstruction(inst));

    await Promise.all(
      onboardParties.map(async party => {
        await ledger.exercise(
          OperatorOnboarding.OperatorOnboard_Onboard,
          onboardingContract.contractId,
          {
            instructions: commandInstructions,
            party: party,
          }
        );
      })
    )
      .then(_ => {
        setOnboardParties([]);
        setInstructionFields(undefined);
        setLoadingInstructions(false);
      })
      .catch(_ => setLoadingInstructions(false));
  }

  return (
    <>
      {(title === InstructionType.INVESTOR || title === InstructionType.EXCHANGE) && (
        <div className="checkbox-cleared">
          <Checkbox checked={isClearedExchange} onClick={toggleIsClearedExchange} />
          <p className="cleared-exchange"> Cleared Exchange</p>
        </div>
      )}
      <div className="instruction-list">
        <Segment basic>
          <div className="party-select">
            <h4>1. Select a party or parties:</h4>
            <Form.Select
              disabled={false}
              className="request-select party"
              placeholder="Select..."
              onChange={(_, data: any) => setOnboardParties(data.value)}
              options={partyOptions}
              search
              multiple
              value={onboardParties}
            />
          </div>
          {instructions.length > 0 && <h4>2. Configure roles and services:</h4>}
          {instructions.map((fields, idx) =>
            idx === instructionIndex ? (
              <InstructionFieldInputs
                currentFields={fields}
                idx={idx}
                instructionFields={instructions || []}
                setInstructionFields={setInstructionFields}
                partyOptions={partyOptions}
              />
            ) : null
          )}
          <div className="contract-browse-buttons">
            {instructions.length > 1 && (
              <>
                {instructionIndex > 0 && (
                  <Button
                    className="ghost browse"
                    onClick={() => setInstructionIndex(instructionIndex - 1)}
                  >
                    <ArrowLeftIcon /> Previous
                  </Button>
                )}

                {instructionIndex < instructions.length - 1 && (
                  <Button
                    className="ghost submit icon-right browse"
                    onClick={() => setInstructionIndex(instructionIndex + 1)}
                  >
                    {instructionIndex + 1} of {instructions.length}
                    <ArrowRightIcon />
                  </Button>
                )}
              </>
            )}

            {instructionIndex === instructions.length - 1 && (
              <Button
                className="ghost submit"
                onClick={doRunOnboarding}
                disabled={onboardParties.length === 0}
              >
                Submit
              </Button>
            )}
          </div>
        </Segment>
      </div>
    </>
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
      {!!getFields(currentFields) ? (
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
      ) : (
        <p>This contract has nothing to configure.</p>
      )}
    </div>
  );
};

function formatCamelcaseToString(text: string) {
  var result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export default AssignRolesPage;
