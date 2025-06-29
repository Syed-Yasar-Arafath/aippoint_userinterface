import { t } from 'i18next'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';

type FormValues = {
  [key: string]: {
    value: string
    error: boolean
    errorMessage: any
  }
}
export function useLogInForm() {
  const { t } = useTranslation();
 
  const [formValues, setFormValues] = useState<FormValues>({
    email: {
      value: '',
      error: false,
      // errorMessage: 'Please enter valid email',
      errorMessage: t('emailError'),
    },
    password: {
      value: '',
      error: false,
      errorMessage: t('resetpasswordError'),
    },
  })
  return { formValues, setFormValues }
}
