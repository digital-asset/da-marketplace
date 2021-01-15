import React from 'react'

import "./PageSection.scss"

type Props = {
    className?: string;
}

const PageSection: React.FC<Props> = ({ children, className }) => (
    <div className={`page-section ${className}`}>
        { children }
    </div>
)

export default PageSection;
