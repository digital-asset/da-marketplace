import React, { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { Button, Form, Header, Loader } from 'semantic-ui-react'
import classNames from 'classnames'

import { useLedger, useParty } from '@daml/react'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { User } from '@daml.js/da-marketplace/lib/Marketplace/Onboarding'

import { ArrowRightIcon } from '../../icons/Icons'

import { roleLabel, roleRoute, StringKeyedObject } from './utils'
import FormErrorHandled from './FormErrorHandled'
import { useOperator } from './common'
import { wrapDamlTuple } from './damlTypes'

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

const RoleSelectForm: React.FC<{role: MarketRole}> = ({role}) => {
    const [ selectedRole, setSelectedRole ] = useState<MarketRole>(role);

    const history = useHistory();
    const ledger = useLedger();
    const user = useParty();
    const operator = useOperator();

    const options = MarketRole.keys.map(role => ({
        key: role,
        value: role,
        text: roleLabel(role)
    }))

    const onSubmit = async () => {
        if (selectedRole === role) {
            return;
        }

        const choice = User.User_RequestRoleChange;
        const key = wrapDamlTuple([operator, user]);
        const args = { newRole: selectedRole };

        await ledger.exerciseByKey(choice, key, args);

        history.push(roleRoute(selectedRole));
    }

    const onChange = async (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setSelectedRole(result.value);
        }
    }

    return (
        <FormErrorHandled onSubmit={onSubmit}>
            <Form.Select
                required
                label='Role'
                options={options}
                onChange={onChange}
                value={selectedRole}/>
            <Button
                content='Save'
                className='ghost'
                disabled={!selectedRole}
                type='submit'/>

        </FormErrorHandled>
    )
}

type ProfileProps = {
    content: string;
    defaultProfile: Profile;
    inviteAcceptTile?: boolean;
    receivedInvitation?: boolean;
    role: MarketRole;
    profileLinks?: IProfileLinkItem[];
    submitProfile?: (profile: Profile) => void;
}

const Profile: React.FC<ProfileProps> = ({
    children,
    content,
    defaultProfile,
    inviteAcceptTile,
    receivedInvitation,
    role,
    profileLinks,
    submitProfile
}) => {
    const [ profile, setProfile ] = useState<Profile>(defaultProfile);
    const [ editing, setEditing ] = useState<boolean>(false);
    const [ roleSelect, setRoleSelect ] = useState<boolean>(false);

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
    }, false) || (inviteAcceptTile && !receivedInvitation);

    const profileForm =
        <Form>
            { fields }
            { children }
            <div className='button-row'>
                <Button
                    className={classNames('ghost', {'dark': inviteAcceptTile})}
                    content={content}
                    disabled={disableButton}
                    onClick={() => handleSubmitProfile(profile)}
                    type='submit'/>

                { inviteAcceptTile && !receivedInvitation &&
                    <div className='invite-indicator'>
                        <p className='p2 dark'>Waiting for Operator invitation...</p>
                        <Loader active indeterminate size='small'/>
                    </div>
                }
            </div>
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

    const actions = <div className='profile-actions'>
        <a className='a2 bold edit-profile' onClick={() => setEditing(true)}>Edit Profile</a>
        <p>or</p>
        <a className='a2 bold switch-roles' onClick={() => setRoleSelect(true)}>Add a Role</a>
    </div>

    const getTileContent = () => {
        if (inviteAcceptTile) {
            return profileForm;
        } else {
            if (editing) {
                return profileForm;
            }

            if (roleSelect) {
                return <RoleSelectForm role={role}/>;
            }

            return <>
                { profileValues }
                { actions }
            </>
        }
    }

    return (
        <div className='profile'>
            <div className={classNames('profile-form', {'landing-page': !inviteAcceptTile})}>
                { getTileContent() }
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
