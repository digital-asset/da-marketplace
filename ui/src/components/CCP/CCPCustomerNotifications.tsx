import React from 'react'

import {useLedger} from '@daml/react'
import {ContractId, Party} from '@daml/types'
import {
  RejectedMarginCalculation,
  RejectedMarkToMarketCalculation
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing'

import {useContractQuery} from '../../websocket/queryStream'
import {RejectedMarginCalculationInfo, RejectedMarkToMarketCalculationInfo} from '../common/damlTypes'
import {useRegistryLookup} from '../common/RegistryLookup'
import ActionRequiredNotification from '../common/ActionRequiredNotification'

type RejectedMarginCalculationProps = {
    calculation: RejectedMarginCalculationInfo;
    calculationCancel: () => Promise<void>;
}

type RejectedMarkToMarketCalculationProps = {
    calculation: RejectedMarkToMarketCalculationInfo;
    calculationCancel: () => Promise<void>;
}

export const useCCPCustomerNotifications = (customer?: Party) => {
    const ledger = useLedger();
    const marginCallFailures = useContractQuery(RejectedMarginCalculation)
        .filter(mc => customer ? mc.contractData.customer === customer : true)
        .map(rejectedCalculation => <RejectedMarginCalculationNotification key={rejectedCalculation.contractId}
            calculation={rejectedCalculation}
            calculationCancel={async () => await cancelMarginCalculation(rejectedCalculation.contractId)}/>);

    const cancelMarginCalculation = async (cid: ContractId<RejectedMarginCalculation>) => {
        const choice = RejectedMarginCalculation.RejectedMarginCalculation_Cancel;
        await ledger.exercise(choice, cid, {});
    }

    const mtmFailures = useContractQuery(RejectedMarkToMarketCalculation)
        .filter(calc => customer ? calc.contractData.customer === customer : true)
        .map(rejectedCalculation => <RejectedMarkToMarketCalculationNotification key={rejectedCalculation.contractId}
            calculation={rejectedCalculation}
            calculationCancel={async () => await retryMtmCalculation(rejectedCalculation.contractId)}/>);

    const retryMtmCalculation = async (cid: ContractId<RejectedMarkToMarketCalculation>) => {
        const choice = RejectedMarkToMarketCalculation.RejectedMarkToMarketCalculation_Cancel;
        await ledger.exercise(choice, cid, {});
    }

    return [...mtmFailures, ...marginCallFailures];
}

const RejectedMarginCalculationNotification: React.FC<RejectedMarginCalculationProps> = ({
    calculation,
    calculationCancel
}) => {
    const { investorMap } = useRegistryLookup();
    const name = investorMap.get(calculation.contractData.customer)?.name || calculation.contractData.customer;
    return (
        <ActionRequiredNotification onAction={calculationCancel} actionText = 'Cancel'>
            <p>Investor <b>@{name}</b>: {calculation.contractData.note}</p>
        </ActionRequiredNotification>
    )
}

const RejectedMarkToMarketCalculationNotification: React.FC<RejectedMarkToMarketCalculationProps> = ({
    calculation,
    calculationCancel
}) => {
    const { investorMap } = useRegistryLookup();
    const name = investorMap.get(calculation.contractData.customer)?.name || calculation.contractData.customer;
    return (
        <ActionRequiredNotification onAction={calculationCancel} actionText = 'Cancel'>
            <p>Investor <b>@{name}</b>: {calculation.contractData.note}</p>
        </ActionRequiredNotification>
    )
}
