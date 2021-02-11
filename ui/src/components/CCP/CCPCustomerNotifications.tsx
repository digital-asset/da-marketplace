import React from 'react'

import { useLedger } from '@daml/react'
import { ContractId } from '@daml/types'
import { RejectedMarginCalculation } from '@daml.js/da-marketplace/lib/Marketplace/Clearing'

import { RejectedMarginCalculationInfo } from '../common/damlTypes'
import { useRegistryLookup } from '../common/RegistryLookup'
import { useContractQuery } from '../../websocket/queryStream'
import ActionRequiredNotification from '../common/ActionRequiredNotification'

type RejectedMarginCalculationProps = {
    calculation: RejectedMarginCalculationInfo;
    calculationCancel: () => Promise<void>;
}

export const useCCPCustomerNotifications = () => {
    const ledger = useLedger();
    const marginCallFailures = useContractQuery(RejectedMarginCalculation)
        .map(rejectedCalculation => <RejectedMarginCalculationNotification key={rejectedCalculation.contractId}
            calculation={rejectedCalculation}
            calculationCancel={async () => await cancelMarginCalculation(rejectedCalculation.contractId)}/>);

    const cancelMarginCalculation = async (cid: ContractId<RejectedMarginCalculation>) => {
        const choice = RejectedMarginCalculation.RejectedMarginCalculation_Cancel;
        await ledger.exercise(choice, cid, {});
    }

    return marginCallFailures;
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
