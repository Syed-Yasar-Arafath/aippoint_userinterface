import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
type FormValues = {
  [key: string]: {
    value: string
    error: boolean
    errorMessage: any
  }
}
export function useSignInForm() {
  const { t, i18n } = useTranslation()

  const [formValues, setFormValues] = useState<FormValues>({
    email: {
      value: '',
      error: false,
      errorMessage: 'Please enter valid email',
      // errorMessage: t('emailError'),
    },
    password: {
      value: '',
      error: false,
      errorMessage:
        'Password: ≥1 uppercase, lowercase, special character, number; min. 10 chars',
      // errorMessage: t('passwordError'),
    },
  })

  // useEffect(() => {
  //   setFormValues((prev) => ({
  //     ...prev,
  //     email: {
  //       ...prev.email,
  //       errorMessage: t('emailError'),
  //     },
  //     password: {
  //       ...prev.password,
  //       errorMessage: t('passwordError'),
  //     },
  //   }))
  // }, [i18n.language])

  return { formValues, setFormValues }
}
