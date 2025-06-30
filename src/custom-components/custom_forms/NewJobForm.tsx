import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
type FormValues = {
  [key: string]: {
    value: string
    error: boolean
    errorMessage: any
  }
}
export function useNewJobForm() {
  const { t, i18n } = useTranslation()

  const [formValues, setFormValues] = useState<FormValues>({
    job_title: {
      value: '',
      error: false,
      // errorMessage: 'Please enter a job title',
      errorMessage: t('jobTitleError'),
    },
    job_role: {
      value: '',
      error: false,
      // errorMessage: 'Please enter a job role',
      errorMessage: t('jobRoleError'),
    },
    experience_required: {
      value: '',
      error: false,
      // errorMessage: 'Please Select experience',
      errorMessage: t('experienceRequiredError'),
    },
    job_type: {
      value: '',
      error: false,
      errorMessage: 'Please enter a job type',
      // errorMessage: t('locationError'),
    },
    work_mode: {
      value: '',
      error: false,
      errorMessage: 'Please enter your work mode',
      // errorMessage: t('locationError'),
    },
    location: {
      value: '',
      error: false,
      // errorMessage: 'Please enter a location',
      errorMessage: t('locationError'),
    },
    primary_skills: {
      value: '',
      error: false,
      errorMessage: 'Please enter a primary skills',
      // errorMessage: t('skillError'),
    },
    secondary_skills: {
      value: '',
      error: false,
      errorMessage: 'Please enter a secondary skills',
      // errorMessage: t('skillError'),
    },
    company_name: {
      value: '',
      error: false,
      // errorMessage: 'Please enter a company name',
      errorMessage: t('companyNameError'),
    },
  })

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      job_title: {
        ...prev.job_title,
        errorMessage: t('jobTitleError'),
      },
      job_role: {
        ...prev.job_role,
        errorMessage: t('jobRoleError'),
      },
      experience_required: {
        ...prev.experience_required,
        errorMessage: t('experienceRequiredError'),
      },
      location: {
        ...prev.location,
        errorMessage: t('locationError'),
      },

      job_type: {
        ...prev.job_type,
        errorMessage: 'Please enter a job type',
        // errorMessage: t('locationError'),
      },
      work_mode: {
        ...prev.work_mode,
        errorMessage: 'Please enter your work mode',
        // errorMessage: t('locationError'),
      },

      primary_skills: {
        ...prev.primary_skills,
        errorMessage: 'Please enter a primary skills',
        // errorMessage: t('skillError'),
      },
      secondary_skills: {
        ...prev.secondary_skills,
        errorMessage: 'Please enter a secondary skills',
        // errorMessage: t('skillError'),
      },
      skills: {
        ...prev.skills,
        errorMessage: t('skillError'),
      },
      company_name: {
        ...prev.company_name,
        errorMessage: t('companyNameError'),
      },
    }))
  }, [i18n.language])

  return { formValues, setFormValues }
}
