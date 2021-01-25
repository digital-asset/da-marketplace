import React, { useEffect, useState } from 'react'
import { Button, Form, Header } from 'semantic-ui-react'

import { NavLink } from 'react-router-dom'

import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { ArrowRightIcon, EditIcon } from '../../icons/Icons';

import classNames from 'classnames'

import { StringKeyedObject } from './utils'

type FieldType = 'text';

type ProfileField = {
    value: string;
    label: string;
    placeholder: string;
    type: FieldType; 
}

export const createField = (
    value: string,
    label: string,
    placeholder: string,
    type: FieldType
): ProfileField => ({ value, label, placeholder, type });

export type Profile = StringKeyedObject<ProfileField>;

type FieldProps = {
    field: ProfileField;
    setField: (field: ProfileField) => void;
    inviteAcceptTile?: boolean;
}

const ProfileField: React.FC<FieldProps> = ({ field, setField, inviteAcceptTile }) => {
    return (
        <Form.Input
            label={<p className={classNames('p2', {'dark': inviteAcceptTile})}>{field.label}</p>}
            placeholder={field.placeholder}
            value={field.value}
            className='profile-form-field'
            type={field.type}
            onChange={e => setField({ ...field, value: e.currentTarget.value })}/>
    )
}

type ProfileProps = {
    content: string;
    role: MarketRole;
    defaultProfile: Profile;
    inviteAcceptTile?: boolean;
    profileLinks?: IProfileLinkItem[];
    submitProfile?: (profile: Profile) => void;
}

const Profile: React.FC<ProfileProps> = ({ content, defaultProfile, submitProfile, inviteAcceptTile, role, profileLinks }) => {
    const [ profile, setProfile ] = useState<Profile>(defaultProfile);
    const [ editing, setEditing ] = useState<boolean>(false)

    useEffect(() => {
        setProfile(defaultProfile);
    }, [ defaultProfile ]);

    const fields = Object.keys(profile).map(key => (
        <ProfileField
            key={key}
            field={profile[key]}
            setField={field => setProfile({ ...profile, [key]: field })}
            inviteAcceptTile={inviteAcceptTile}/>
    ));

    const disableButton = Object.keys(profile).reduce((accumulator, key) => {
        return accumulator || !profile[key].value;
    }, false);

    const profileForm =
        <Form>
            { fields }
            <Button
                className={classNames('ghost', {'dark': inviteAcceptTile})}
                content={content}
                disabled={disableButton}
                onClick={() => handleSubmitProfile(profile)}
                type='submit'/>
        </Form>

    const profileValues =
        <div className='profile-values'>
            {Object.keys(profile).map(key => {
                if (profile[key].label === 'Name') {
                return (
                        <>
                            <Header className='profile-name'>
                                @{profile[key].value}
                            </Header>
                            <p className='bold'>{role.replace('Role', '')}</p>
                        </>
                    )
                }
                return <p className='field-value'>{profile[key].label}: {profile[key].value}</p>
            })}
        </div>

    return (
        <div className='profile'>
            <div className={classNames('profile-form', {'landing-page': !inviteAcceptTile})}>
                { inviteAcceptTile ? profileForm : editing? profileForm : profileValues }
                { !inviteAcceptTile && !editing &&
                    <a className='a2 bold edit-profile' onClick={() => setEditing(true)}> Edit Profile </a>
                }
            </div>
            { !inviteAcceptTile && profileLinks?.map(item => <ProfileLink item={item}/>) }
        </div>
    )

    function handleSubmitProfile(profile: Profile) {
        if (submitProfile) {
            setEditing(false)
            submitProfile(profile)
        }
    }
}

export type IProfileLinkItem = {
    to: string,
    title: string,
    subtitle?: string
}

const ProfileLink = (props: { item: IProfileLinkItem }) => (
    <NavLink className='profile-link' to={props.item.to}>
        <div className='title'>
            <a className='bold'>{props.item.title}</a>
            <ArrowRightIcon/>
        </div>
        <p>{props.item.subtitle}</p>
    </NavLink>
)

export default Profile;
