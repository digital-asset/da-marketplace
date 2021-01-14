import React from 'react'

import "./PageSection.scss"

type Props = {
    background: 'white' | 'grey';
    border: 'grey' | 'blue';
    className?: string;
}

const PageSection: React.FC<Props> = ({ children, border, background, className }) => (
    <div className={`page-section ${background} ${border}-border ${className}`}>
        { children }
    </div>
)

export default PageSection;
