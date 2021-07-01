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
import { Label, Form, Button } from 'semantic-ui-react';
import { createDropdownProp } from '../common';

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
  custodian: Party,
  provider: Party,
  optTradingAccount: Optional<string>
): OnboardingInstruction => {
  return { tag: 'OnboardTrading', value: { custodian, provider, optTradingAccount } };
};

type EmptyIntstruction = EmptyCustodyInstruction | EmptyTradingInstruction;

type EmptyCustodyInstruction = {
  provider?: string;
};

type EmptyTradingInstruction = {
  custodian?: string;
  provider?: string;
  tradingAccount?: string;
};

enum FieldType {
  PARTIES = 'PARTIES',
  TEXT = 'TEXT',
}

enum InstructionType {
  TRADING = 'Trading Instruction',
  CUSTODY = 'Custody Instruction',
}

type InstFieldsWithType = {
  instructionType: InstructionType;
  empty: EmptyIntstruction;
};

const getFields = (inst: InstFieldsWithType) => {
  switch (inst.instructionType) {
    case InstructionType.TRADING: {
      return {
        custodian: FieldType.PARTIES,
        provider: FieldType.PARTIES,
        tradingAccount: FieldType.TEXT,
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

const TestInstructions = () => {
  const ledger = useLedger();
  const automations = useAutomations();

  const { identities, loading: identitiesLoading } = useVerifiedParties();

  const [onboardParty, setOnboardParty] = useState('');
  const [instructions, setInstructions] = useState<OnboardingInstruction[]>([]);
  // const [emptyInstructions, setEmptyInstructions] = useState<EmptyIntstruction[]>([]);
  const [instructionTypes, setInstructionTypes] = useState<InstFieldsWithType[]>([]);

  const [currentAddInstruction, setCurrentAddInstruction] = useState<InstructionType | undefined>();

  const { contracts: onboardingContracts, loading: onboardingLoading } =
    useStreamQueries(OperatorOnboarding);

  if (!onboardingContracts.length) return <></>;
  const onboardingContract = onboardingContracts[0];
  const newEmptyInstruction = (it: InstructionType) => {
    switch (it) {
      case InstructionType.TRADING: {
        return {} as EmptyTradingInstruction;
      }
      case InstructionType.CUSTODY: {
        return {} as EmptyCustodyInstruction;
      }
    }
  };
  // _.toPairs(getFields(ei)).map(([k, fieldType]) => {
  // switch(fieldType) {
  //   case FieldType.PARTIES: {
  //     return <div>parties</div>
  //   };
  //   case FieldType.TEXT: {
  //     return <div>text</div>
  //   }
  //
  // }

  return (
    <QuickSetupPage
      className="test-instructions"
      title="Create Instructions List"
      nextItem={MenuItems.REQUEST_SERVICES}
    >
      <div className="page-row">
        <div>
          <p className="bold">Parties</p>
          <div className="party-names">
            {instructionTypes.map(ei => (
              <>
                <div>{ei.instructionType}</div>
                <div>
                  {_.toPairs(getFields(ei)).map(([k, field]) => {
                    if (field === FieldType.PARTIES) {
                      return <div>{k}: Parties!</div>
                    } else {
                      return <div>{k}: Text!</div>
                    }
                  })}
                </div>
              </>
            ))}
          </div>
          <Form>
            <Form.Select
              options={[
                createDropdownProp('Trading', InstructionType.TRADING),
                createDropdownProp('Custody', InstructionType.CUSTODY),
              ]}
              onChange={(_, data) => {
                setCurrentAddInstruction(data.value as InstructionType);
                console.log(data);
              }}
            />
            <Button
              disabled={!currentAddInstruction}
              onClick={() => {
                if (!currentAddInstruction) return;
                setInstructionTypes([
                  ...instructionTypes,
                  {
                    instructionType: currentAddInstruction,
                    empty: newEmptyInstruction(currentAddInstruction),
                  },
                ]);
              }}
            >
              Add
            </Button>
          </Form>
        </div>
      </div>
    </QuickSetupPage>
  );

  async function doRunOnboarding() {
    return await ledger.exercise(
      OperatorOnboarding.OperatorOnboard_Onboard,
      onboardingContract.contractId,
      {
        instructions,
        party: onboardParty,
      }
    );
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
