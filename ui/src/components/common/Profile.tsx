import React, { useEffect, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
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
    defaultProfile: Profile;
    inviteAcceptTile?: boolean;
    submitProfile?: (profile: Profile) => void;
}

const Profile: React.FC<ProfileProps> = ({ content, defaultProfile, submitProfile, inviteAcceptTile }) => {
    const [ profile, setProfile ] = useState<Profile>(defaultProfile);

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

    return (
        <Form className='profile'>
            { fields }
            <Button
                className={classNames('ghost', {'dark': inviteAcceptTile})}
                content={content}
                disabled={disableButton}
                onClick={() => submitProfile && submitProfile(profile)}
                type='submit'/>
        </Form>
    )
}

export default Profile;
