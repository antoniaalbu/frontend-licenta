import React, { useState } from 'react';
import Select from 'react-select';
import './Register.css';
import Navbar from '../Navbar/Navbar';

const countries = [
    { value: 'AL', label: 'Albania' },
    { value: 'AD', label: 'Andorra' },
    { value: 'AT', label: 'Austria' },
    { value: 'BY', label: 'Belarus' },
    { value: 'BE', label: 'Belgium' },
    { value: 'BA', label: 'Bosnia and Herzegovina' },
    { value: 'BG', label: 'Bulgaria' },
    { value: 'HR', label: 'Croatia' },
    { value: 'CY', label: 'Cyprus' },
    { value: 'CZ', label: 'Czech Republic' },
    { value: 'DK', label: 'Denmark' },
    { value: 'EE', label: 'Estonia' },
    { value: 'FI', label: 'Finland' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
    { value: 'GR', label: 'Greece' },
    { value: 'HU', label: 'Hungary' },
    { value: 'IS', label: 'Iceland' },
    { value: 'IE', label: 'Ireland' },
    { value: 'IT', label: 'Italy' },
    { value: 'LV', label: 'Latvia' },
    { value: 'LI', label: 'Liechtenstein' },
    { value: 'LT', label: 'Lithuania' },
    { value: 'LU', label: 'Luxembourg' },
    { value: 'MT', label: 'Malta' },
    { value: 'MD', label: 'Moldova' },
    { value: 'MC', label: 'Monaco' },
    { value: 'ME', label: 'Montenegro' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'MK', label: 'North Macedonia' },
    { value: 'NO', label: 'Norway' },
    { value: 'PL', label: 'Poland' },
    { value: 'PT', label: 'Portugal' },
    { value: 'RO', label: 'Romania' },
    { value: 'RU', label: 'Russia' },
    { value: 'SM', label: 'San Marino' },
    { value: 'RS', label: 'Serbia' },
    { value: 'SK', label: 'Slovakia' },
    { value: 'SI', label: 'Slovenia' },
    { value: 'ES', label: 'Spain' },
    { value: 'SE', label: 'Sweden' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'TR', label: 'Turkey' },
    { value: 'UA', label: 'Ukraine' },
    { value: 'VA', label: 'Vatican City' }
];

function RegistrationForm() {
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [country, setCountry] = useState(null);
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameExists, setUsernameExists] = useState(false);
    const [registrationError, setRegistrationError] = useState('');
    const [gdprError, setGdprError] = useState('');
    const [isChecked, setIsChecked] = useState(false); // State to track checkbox state

    const checkUsernameExists = async (value) => {
        try {
            const response = await fetch(`http://localhost:8081/api/existsByUsername/${value}`);
            if (response.ok) {
                setUsernameExists(false);
            } else if (response.status === 400) {
                setUsernameExists(true);
            }
        } catch (error) {
            console.error('Error checking username existence:', error);
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleUsernameBlur = async () => {
        if (username.trim() !== '') {
            await checkUsernameExists(username);
        }
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePreviousStep = () => {
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isChecked) {
            console.log("err")
            setGdprError('You must agree to the GDPR terms and conditions.');
            return;
        }
        setGdprError('');

        // Determine the role based on the email domain
        const domain = email.split('@')[1];
        const role = domain === 'tinysentinel.com' ? 'doctor' : 'parent';

        // Create the form data object
        const formData = {
            email,
            password,
            username,
            telephone,
            firstName,
            lastName,
            country: country ? country.value : '',
            city,
            street,
            number,
            role
        };

        try {
            const response = await fetch('http://localhost:8081/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Handle successful registration
                console.log('Registration successful');
            } else {
                if (response.status === 400) {
                    setUsernameExists(true);
                } else {
                    // Handle other registration errors
                    const text = await response.text();
                    console.error('Registration error:', response.status, text);
                    setRegistrationError(text);
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setRegistrationError('An error occurred during registration');
        }
    };

    return (
        <>
            <Navbar />
            <div className="background-image-register">
                <div className="register-form">
                    <h2 className="custom-text-component">Register</h2>
                    {step === 1 && (
                        <form onSubmit={handleNextStep} className="form">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="input-register-form"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="input-register-form"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-register-form"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Telephone"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                className="input-register-form"
                                required
                            />
                            <Select
                                options={countries}
                                value={country}
                                onChange={setCountry}
                                placeholder="Select country"
                                classNamePrefix="select-country"
                                className="select-country"
                                required
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="input-register-form"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Street"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                className="input-register-form"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Number"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                className="input-register-form"
                                required
                            />
                            <div className="button-container">
                                <button className="register-page-button" type="submit">Next</button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="form">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={handleUsernameChange}
                                onBlur={handleUsernameBlur}
                                className={`input-register-form ${usernameExists ? 'username-exists' : ''}`}
                                    required
                                />
                                {usernameExists && <p className="error-message-register">Username already exists</p>}
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-register-form"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-register-form"
                                    required
                                />
                                <div className="gdpr-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => setIsChecked(e.target.checked)}
                                        id="gdpr-checkbox"
                                        required
                                    />
                                    <label htmlFor="gdpr-checkbox">
                                        I agree to the GDPR terms and conditions
                                    </label>
                                    {gdprError && <p className="error-message-register">{gdprError}</p>}
                                </div>
                                <div className="button-container">
                                    <button className="register-page-button" type="submit" disabled={!isChecked}>
                                        Register
                                    </button>
                                    <button type="button" onClick={handlePreviousStep} className="register-page-button">
                                        Back
                                    </button>
                                </div>
                                {registrationError && <p className="error-message-register">{registrationError}</p>}
                            </form>
                        )}
                    </div>
                </div>
            </>
        );
    }
    
    export default RegistrationForm;
    