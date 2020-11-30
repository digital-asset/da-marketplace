import React, { useEffect, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import "./Profile.css"

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

export type Profile = {
    [key: string]: ProfileField
};

type FieldProps = {
    field: ProfileField;
    setField: (field: ProfileField) => void;
}

const ProfileField: React.FC<FieldProps> = ({ field, setField }) => {
    return (
        <Form.Input
            fluid
            label={field.label}
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
    submitProfile?: (profile: Profile) => void;
}

const Profile: React.FC<ProfileProps> = ({ content, defaultProfile, submitProfile }) => {
    const [ profile, setProfile ] = useState<Profile>(defaultProfile);

    useEffect(() => {
        setProfile(defaultProfile);
    }, [ defaultProfile ]);

    return (
        <>
            {Object.keys(profile).map(key => (
                <Form.Group className='inline-form-group profile'>            
                    <ProfileField
                        key={key}
                        field={profile[key]}
                        setField={field => setProfile({ ...profile, [key]: field })}/>
                    <Button
                        secondary
                        content={content}
                        disabled={!profile[key].value}
                        onClick={() => submitProfile && submitProfile(profile)}
                        type='submit'/>
                </Form.Group>
            ))}
        </>
    )
}

export default Profile;
