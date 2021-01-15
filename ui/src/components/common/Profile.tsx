import React, { useEffect, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { StringKeyedObject } from './utils'
import './Profile.scss'

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
            fluid
            label={<p className={`p2 ${inviteAcceptTile && 'dark'}`}>{field.label}</p>}
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
         <Form className='profile-form'>
            { fields }
            <Button
                className={`ghost ${inviteAcceptTile && 'dark'}`}
                content={content}
                disabled={disableButton}
                onClick={() => submitProfile && submitProfile(profile)}
                type='submit'/>
        </Form>
    )
}

export default Profile;
