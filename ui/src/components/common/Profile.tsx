import React, { useEffect, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import "./Profile.css"

type FieldType = 'text' | 'password';

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
    disabled?: boolean;
    field: ProfileField;
    setField: (field: ProfileField) => void;
}

const ProfileField: React.FC<FieldProps> = ({ disabled, field, setField }) => {
    switch(field.type) {
        case 'text':
        case 'password':
            return (
                <Form.Input
                    fluid
                    className='profile-form-field'
                    disabled={disabled}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={field.value}
                    type={field.type}
                    onChange={e => setField({ ...field, value: e.currentTarget.value })}/>
            )
    }
}

type ProfileProps = {
    disabled?: boolean;
    defaultProfile: Profile;
    submitProfile?: (profile: Profile) => void;
}

const Profile: React.FC<ProfileProps> = ({ disabled, defaultProfile, submitProfile }) => {
    const [ profile, setProfile ] = useState<Profile>(defaultProfile);

    useEffect(() => {
        setProfile(defaultProfile);
    }, [ defaultProfile ]);

    const fields = Object.keys(profile).map(key => (
        <ProfileField
            key={key}
            disabled={disabled}
            field={profile[key]}
            setField={field => setProfile({ ...profile, [key]: field })}/>
    ));

    const disableButton = Object.keys(profile).reduce((accumulator, key) => {
        return accumulator || !profile[key].value;
    }, false);

    return (
        <>
            { fields }
            { !disabled && <Button
                primary
                className='profile-submit-button'
                content='Submit'
                disabled={disableButton}
                onClick={() => submitProfile && submitProfile(profile)}
                type='submit'/> }
        </>
    )
}

export default Profile;
