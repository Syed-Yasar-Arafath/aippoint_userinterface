import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
type FormValues = {
  [key: string]: {
    value: string
    error: boolean
    errorMessage: any
  }
}
export function useQuestionFormatForm() {
  const { t, i18n } = useTranslation()

  const [formValues, setFormValues] = useState<FormValues>({
    jobDescription: {
      value: '',
      error: false,
      // errorMessage: 'Please select a job description',
      errorMessage: t('selectAJobDescriptionError'),
    },
    collection: {
      value: '',
      error: false,
      // errorMessage: 'Please select a collection',
      errorMessage: t('selectANameError'),
    },
    questionLevel: {
      value: '',
      error: false,
      // errorMessage: 'Please select a question level',
      errorMessage: t('selectAQuestionLevelError'),
    },
    questionLength: {
      value: '',
      error: false,
      // errorMessage: 'Please select a question length',
      errorMessage: t('selectQuestionLengthError'),
    },
  })

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      jobDescription: {
        ...prev.jobDescription,
        errorMessage: t('selectAJobDescriptionError'),
      },
      collection: {
        ...prev.collection,
        errorMessage: t('selectANameError'),
      },
      questionLevel: {
        ...prev.questionLevel,
        errorMessage: t('selectAQuestionLevelError'),
      },
      questionLength: {
        ...prev.questionLength,
        errorMessage: t('selectQuestionLengthError'),
      },
    }))
  }, [i18n.language])

  return { formValues, setFormValues }
}
