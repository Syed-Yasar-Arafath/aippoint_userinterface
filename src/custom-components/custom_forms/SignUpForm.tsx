import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
type FormValues = {
  [key: string]: {
    value: string
    error: boolean
    errorMessage: any
  }
}
export function useSignUpForm() {
  const { t, i18n } = useTranslation()

  const [formValues, setFormValues] = useState<FormValues>({
    first_name: {
      value: '',
      error: false,
      // errorMessage: 'Please enter first name',
      errorMessage: t('firstNameError'),
    },
    last_name: {
      value: '',
      error: false,
      // errorMessage: 'Please enter last name',
      errorMessage: t('firstNameError'),
    },
    email: {
      value: '',
      error: false,
      // errorMessage: 'Please enter valid email',
      errorMessage: t('emailError'),
    },
    password: {
      value: '',
      error: false,
      // errorMessage:
      //   'Password: ≥1 uppercase, lowercase, special character, number; min. 10 chars',
      errorMessage: t('passwordError'),
    },
    confirm_password: {
      value: '',
      error: false,
      // errorMessage:
      //   'Password: ≥1 uppercase, lowercase, special character, number; min. 10 chars',
      errorMessage: t('confirmPasswordError'),
    },
  })

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      first_name: {
        ...prev.first_name,
        errorMessage: t('firstNameError'),
      },
      last_name: {
        ...prev.last_name,
        errorMessage: t('lastNameError'),
      },
      email: {
        ...prev.email,
        errorMessage: t('emailError'),
      },
      password: {
        ...prev.password,
        errorMessage: t('passwordError'),
      },
      confirm_password: {
        ...prev.confirm_password,
        errorMessage: t('confirmPasswordError'),
      },
    }))
  }, [i18n.language])

  return { formValues, setFormValues }
}
