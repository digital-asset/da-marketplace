import React from 'react'

import OnboardingTile from './OnboardingTile'

type Props = {
    title?: string;
}

const LoadingScreen: React.FC<Props> = ({
    title,
    children
}) => (
    <OnboardingTile>
        <div className='loading-screen'>Loading...</div>
    </OnboardingTile>
)

export default LoadingScreen;
