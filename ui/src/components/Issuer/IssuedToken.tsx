import React from 'react'
import { useParams } from 'react-router-dom'
import { Header, List } from 'semantic-ui-react'

import { useStreamQuery } from '@daml/react'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import Page from '../common/Page'
import PageSection from '../common/PageSection'

import './IssueAsset.css'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const IssuedToken: React.FC<Props> = ({ sideNav, onLogout }) => {
    const { tokenId } = useParams<{tokenId: string}>()

    const token = useStreamQuery(Token).contracts.find(c => c.contractId === decodeURIComponent(tokenId))
    const signatories = Object.keys(token?.payload.id.signatories.textMap || [])
    const observers = Object.keys(token?.payload.observers.textMap || [])

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h3'>{token?.payload.id.label}</Header>}
            onLogout={onLogout}
        >
            <PageSection border='blue' background='white'>
                <p>{token?.payload.description}</p>

                <p><b>Public: </b>{(!!token?.payload.isPublic).toString()}</p>

                <p><b>Issuer:</b></p>
                <List verticalAlign='middle'>
                    {signatories.map(s =>
                        <List.Item key={s}>
                            <List.Content>
                                <p>{s}</p>
                            </List.Content>
                        </List.Item>
                    )}
                </List>

                <p><b>Quantity Precision:</b> {token?.payload.quantityPrecision}</p>

                <p><b>Observers:</b></p>
                <List verticalAlign='middle'>
                    {observers.map(o =>
                        <List.Item key={o}>
                            <List.Content>
                                <p>{o}</p>
                            </List.Content>
                        </List.Item>
                    )}
                </List>
            </PageSection>
        </Page>
    )
}

export default IssuedToken;
