import React, { useContext } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/all';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import authFetch from '../../../authFetch';
import { UserContext } from '../../../UserContext';
import { MyInput } from '../../../components/FormikInput';

function LoginForm() {
    const { user, fetchUser } = useContext(UserContext);

    return (
        <div>
            {!user && (
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={Yup.object({
                        username: Yup.string().email('Must be a valid email').required(),
                        password: Yup.string().required(),
                    })}
                    onSubmit={(values, { setSubmitting, setStatus }) => {
                        setStatus('');

                        authFetch(
                            '/login',
                            {
                                method: 'POST',
                                body: new URLSearchParams(values),
                            },
                            false,
                        ).then(response => {
                            if (response?.status !== 200)
                                setStatus('Invalid username and/or password');
                            fetchUser();
                            setSubmitting(false);
                        });
                    }}
                >
                    {({ status, isSubmitting }) => (
                        <Form>
                            <MyInput
                                name="username"
                                type="email"
                                placeholder="Username"
                                leftIcon={<FaEnvelope />}
                            />
                            <MyInput
                                name="password"
                                type="password"
                                placeholder="Password"
                                leftIcon={<FaLock />}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="button is-block is-success is-fullwidth"
                            >
                                Log in
                            </button>
                            {status && <div className="has-text-danger">{status}</div>}
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
}

export default LoginForm;
