import classNames from 'classnames'
import React from 'react'

import Page from './Page'
import PageSection from './PageSection'
import WelcomeHeader from './WelcomeHeader'

type Props = {
    className?: string;
    profile?: React.ReactElement;
    marketRelationships?: React.ReactElement;
    notifications?: React.ReactElement[];
}

const LandingPage: React.FC<Props> = ({
    className,
    profile,
    marketRelationships,
    notifications,
    children,
}) => (
    <Page
        className={classNames('landing-page')}
        menuTitle={<WelcomeHeader/>}
        notifications={notifications}
        landingPage={true}
    >
        <PageSection>
            <div className={classNames('landing-page-section', className)}>
                <div className='landing-page-column'>
                    { profile }
                </div>

                <div className='landing-page-column'>
                    { marketRelationships }
                </div>

                { children }
            </div>
        </PageSection>
    </Page>
)

export default LandingPage;
