import React, { useState, useEffect, useCallback } from 'react';
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
import { useVerifiedParties, MarketplaceTrigger, isHubDeployment } from '../../config';
import { useStreamQueries } from '../../Main';
import { createDropdownProp, usePublicParty } from '../common';
import Credentials, { computeLocalToken } from '../../Credentials';

import { LoadingWheel } from './QuickSetup';
import QuickSetupPage from './QuickSetupPage';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import { useAutomationInstances, useAutomations } from '@daml/hub-react';
import { retrieveParties } from '../../Parties';

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
};

type IssuanceInstructionFields = {
  provider?: string;
  custodian?: string;
};

type AuctionInstructionFields = {
  provider?: string;
  custodian?: string;
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
              key={inst}
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
    if (instructionFields) {
      handleNewInstructionFields(instructionFields.title as InstructionType);
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
        setInstructionFields({
          title: InstructionType.ISSUER,
          instructions: issuerInstructions(),
        });
        break;
      case InstructionType.EXCHANGE:
        setInstructionFields({
          title: InstructionType.EXCHANGE,
          instructions: exchangeInstructions(isClearedExchange),
        });
        break;
      case InstructionType.BANK:
        setInstructionFields({
          title: InstructionType.BANK,
          instructions: bankInstructions(),
        });
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

const makeClearingHouseInstruction = (custodian: string): OnboardingInstruction => {
  return { tag: OnboardingTemplate.CLEARINGHOUSE, value: { custodian } };
};

const makeClearingInstruction = (provider: Party, custodian: string): OnboardingInstruction => {
  return { tag: OnboardingTemplate.CLEARING, value: { custodian, provider } };
};

const makeTradingInstruction = (provider: Party, custodian: Party): OnboardingInstruction => {
  return { tag: OnboardingTemplate.TRADING, value: { custodian, provider } };
};

const makeBiddingInstruction = (provider: Party, custodian: Party): OnboardingInstruction => {
  return { tag: OnboardingTemplate.BIDDING, value: { custodian, provider } };
};

const makeIssuanceInstruction = (provider: Party, custodian: Party): OnboardingInstruction => {
  return {
    tag: OnboardingTemplate.ISSUANCE,
    value: { custodian, provider },
  };
};

const makeAuctionInstruction = (provider: Party, custodian: Party): OnboardingInstruction => {
  return {
    tag: OnboardingTemplate.AUCTION,
    value: { custodian, provider },
  };
};

const makeInstruction = (inst: InstFieldsWithType): OnboardingInstruction => {
  switch (inst.instructionType) {
    case InstructionType.TRADING: {
      return makeTradingInstruction(inst.fields?.provider || '', inst.fields?.custodian || '');
    }
    case InstructionType.BIDDING: {
      return makeBiddingInstruction(inst.fields?.provider || '', inst.fields?.custodian || '');
    }
    case InstructionType.CLEARING: {
      return makeClearingInstruction(inst.fields?.provider || '', inst.fields?.custodian || '');
    }
    case InstructionType.AUCTION: {
      return makeAuctionInstruction(inst.fields?.provider || '', inst.fields?.custodian || '');
    }
    case InstructionType.ISSUANCE: {
      return makeIssuanceInstruction(inst.fields?.provider || '', inst.fields?.custodian || '');
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
      return makeClearingHouseInstruction(inst.fields?.custodian || '');
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
  const clearingAccount = FieldType.TEXT;

  switch (inst.instructionType) {
    case InstructionType.TRADING: {
      return {
        provider,
        custodian,
      };
    }
    case InstructionType.CLEARINGHOUSE: {
      return {
        custodian,
      };
    }
    case InstructionType.BIDDING: {
      return {
        provider,
        custodian,
      };
    }
    case InstructionType.AUCTION: {
      return {
        provider,
        custodian,
      };
    }
    case InstructionType.ISSUANCE: {
      return {
        provider,
        custodian,
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
      } as AuctionInstructionFields;
    }
    case InstructionType.MARKETCLEARING: {
      return { provider, custodian } as MarketClearingInstructionFields;
    }
    case InstructionType.CLEARINGHOUSE: {
      return {
        custodian,
      } as ClearingHouseInstructionFields;
    }
    case InstructionType.BIDDING: {
      return {
        provider,
        custodian,
      } as BiddingInstructionFields;
    }
    case InstructionType.ISSUANCE: {
      return {
        provider,
        custodian,
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

const getInstructionTriggers = (inst: InstructionType) => {
  switch (inst) {
    case InstructionType.CLEARINGHOUSE:
      return [MarketplaceTrigger.ClearingTrigger];
    case InstructionType.EXCHANGE:
      return [MarketplaceTrigger.SettlementInstructionTrigger];
    default:
      return [];
  }
};

const Instructions = (props: {
  instructionFields: InstFieldsWithTitle;
  setInstructionFields: React.Dispatch<React.SetStateAction<InstFieldsWithTitle | undefined>>;
  isClearedExchange: boolean;
  toggleIsClearedExchange: () => void;
}) => {
  const { instructionFields, setInstructionFields, isClearedExchange, toggleIsClearedExchange } =
    props;

  const { instructions, title } = instructionFields;

  const ledger = useLedger();
  const { automations } = useAutomations();
  const { deployAutomation } = useAutomationInstances();
  const { identities, loading: loadingIdentities } = useVerifiedParties();
  const displayErrorMessage = useDisplayErrorMessage();

  const publicParty = usePublicParty();
  const parties = retrieveParties(publicParty);

  const allTriggers =
    automations?.flatMap(auto => {
      if (auto.automationEntity.tag === 'DamlTrigger') {
        return auto.automationEntity.value.triggerNames.map(tn => {
          return `${tn}#${auto.artifactHash}`;
        });
      } else {
        return `${auto.automationEntity.value.entityName}#${auto.artifactHash}`;
      }
    }) || [];

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
      .then(async _ => {
        const triggers = getInstructionTriggers(title as InstructionType);
        await Promise.all(
          onboardParties.map(async party => {
            const token = isHubDeployment
              ? parties.find(p => p.party === party)?.token
              : computeLocalToken(party);

            if (!token) {
              setLoadingInstructions(false);
              return displayErrorMessage({
                header: 'Failed to fetch party token',
                message: `Could not find party token for party ID: ${party}`,
              });
            }

            await Promise.all(triggers.map(async t => await handleDeployment(token, t)));
          })
        );
      })
      .then(_ => {
        setOnboardParties([]);
        setInstructionFields(undefined);
        setLoadingInstructions(false);
      })
      .catch(_ => {
        setLoadingInstructions(false);
        return displayErrorMessage({
          message:
            'An error occurred while onboarding this role. Please confirm all required fields are filled out and that an Operator Onboarding contract exists on the ledger.',
        });
      });
  }

  async function handleDeployment(token: string, autoName: string) {
    if (!isHubDeployment) {
      return;
    }

    const trigger = allTriggers.find(auto => auto.startsWith(autoName));

    if (trigger) {
      const [name, hash] = trigger.split('#');
      if (hash && deployAutomation) {
        await deployAutomation(hash, name, token);
      }
    }
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

const autoFillInfo = [
  {
    instruction: InstructionType.CUSTODY,
    instructionFieldName: 'provider',
    autoFillFieldName: 'custodian',
  },
];

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
  const [doAutoFill, setDoAutofill] = useState(true);

  const updateInstruction = useCallback(
    (newVal: string, key: string) => {
      setInstructionFields(old => {
        let listCopy = [...(old?.instructions || [])];
        let instCopy = { ...currentFields };
        (instCopy.fields || {})[key] = newVal as string;
        listCopy[idx] = instCopy;
        return { title: old?.title || '', instructions: listCopy };
      });
    },
    [currentFields, idx, setInstructionFields]
  );

  useEffect(() => {
    if (doAutoFill) {
      _.toPairs(getFields(currentFields)).forEach(([k, _]) => {
        const autofill = autoFillInfo.find(i => i.autoFillFieldName === k);
        const prevContract = instructionFields.find(
          f => f.instructionType === autofill?.instruction
        )?.fields;
        if (autofill && prevContract) {
          const option = partyOptions.find(
            c => c.value === prevContract[autofill.instructionFieldName]
          );
          if (!!option) {
            updateInstruction(option.value as string, autofill.autoFillFieldName);
          }
        }
      });
      setDoAutofill(false);
    }
  }, [partyOptions, updateInstruction, instructionFields, currentFields, doAutoFill]);

  return (
    <div className="instruction-fields">
      <Header as="h3">{currentFields.instructionType}</Header>
      {!!getFields(currentFields) ? (
        <Form.Group>
          {_.toPairs(getFields(currentFields)).map(([k, field]) => {
            const updateInstructionTypes = (_: any, data: DropdownProps | InputOnChangeData) => {
              updateInstruction(data.value as string, k);
            };
            if (field === FieldType.PARTIES) {
              return (
                <Form.Select
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
