import React from 'react'

import Page from './Page'
import PageSection from './PageSection'
import WelcomeHeader from './WelcomeHeader'

type Props = {
    profile?: React.ReactElement;
    marketRelationships?: React.ReactElement;
    sideNav: React.ReactElement;
    notifications?: React.ReactElement[];
    onLogout: () => void;
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}

const LandingPage: React.FC<Props> = ({
    profile,
    marketRelationships,
    sideNav,
    notifications,
    onLogout,
    showNotificationAlert,
    handleNotificationAlert
}) => (
    <Page
        sideNav={sideNav}
        onLogout={onLogout}
        menuTitle={<WelcomeHeader/>}
        notifications={notifications}
        landingPage={true}
        showNotificationAlert={showNotificationAlert}
        handleNotificationAlert={handleNotificationAlert}
    >
        <PageSection>
            <div className='landing-page'>
                <div className='landing-page-column'>
                    { profile }
                </div>

                <div className='landing-page-column'>
                    { marketRelationships }
                </div>
            </div>
        </PageSection>
    </Page>
)

export default LandingPage;
