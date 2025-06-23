// import internalApi from '../utilities/internalApiPy'
// const organisation = localStorage.getItem('organisation')

// // export async function postResume(data: any) {
// //   try {
// //     const response = await internalApi.post(`/get_resume/${organisation}`, data)
// //     return response.data
// //   } catch (error) {
// //     return error
// //   }
// // }

// export async function postResume(data: any, organisation: any) {
//   try {
//     const response = await internalApi.post(
//       `/get_resume/`, // Corrected API endpoint
//       data,
//       {
//         headers: {
//           Organization: organisation, // Passing organization dynamically
//           'Content-Type': 'application/json',
//         },
//       },
//     )
//     return response.data
//   } catch (error) {
//     console.error('Error fetching resume:', error)
//     return error
//   }
// }

// export async function getResumeById(requestData: any) {
//   try {
//     const response = await internalApi.post(
//       `/get_resume/${organisation}`,
//       requestData,
//     )
//     return response.data
//   } catch (error) {
//     return error
//   }
// }

// export async function getAllResume(data: any) {
//   try {
//     const response = await internalApi.post(`/get_score/${organisation}`, data)
//     return response.data
//   } catch (error) {
//     return error
//   }
// }

// export async function getResume() {
//   try {
//     const response = await internalApi.post(`/get_score/${organisation}`)
//     return response.data
//   } catch (error) {
//     return error
//   }
// }

// // export async function uploadResume(data: any) {
// //   try {
// //     const response = await internalApi.post('/upload/', data)
// //     return response.data
// //   } catch (error) {
// //     return error
// //   }
// // }
// export async function uploadResume(data: any, headers = {}) {
//   try {
//     const response = await internalApi.post(`/upload/${organisation}`, data, {
//       headers,
//     })
//     return response.data
//   } catch (error) {
//     console.error('Upload failed:', error)
//     throw error // Throw the error to be handled properly in `handleUpload`
//   }
// }

// export async function resumeScoring(data: any) {
//   try {
//     const response = await internalApi.post(`/new_resume/${organisation}`, data)
//     return response.data
//   } catch (error) {
//     return error
//   }
// }
// // export async function getResumeCount() {
// //   try {
// //     const response = await internalApi.get(`/get_resume_count/${organisation}`)
// //     return response.data
// //   } catch (error) {
// //     return error
// //   }
// // }
// export async function getResumeCount(organisation: any) {
//   try {
//     const response = await internalApi.get(`/get_resume_count/`, {
//       headers: {
//         Organization: organisation, // Adding organisation in headers
//       },
//     })
//     return response.data
//   } catch (error) {
//     return error
//   }
// }

// export async function uploadStatus(data: any) {
//   try {
//     const response = await internalApi.post(
//       `/resume_upload_status/${organisation}`,
//       data,
//     )
//     return response.data
//   } catch (error) {
//     return error
//   }
// }
// // export async function scoreResume(data: any, organisation:any) {
// //   try {
// //     const response = await internalApi.post(`/new_jd/${organisation}`, data)
// //     return response.data
// //   } catch (error) {
// //     return error
// //   }
// // }
// export async function scoreResume(data: any, organisation: any) {
//   try {
//     const response = await internalApi.post(
//       `/new_jd/`, // Corrected API endpoint
//       data,
//       {
//         headers: {
//           Organization: organisation, // Passing organization dynamically
//           'Content-Type': 'application/json',
//         },
//       },
//     )
//     return response.data
//   } catch (error) {
//     console.error('Error scoring resumes:', error)
//     return error
//   }
// }

// export async function getResumeScore(data: any, organisation: any) {
//   try {
//     const response = await internalApi.post(
//       `/get_jd_score/${organisation}`,
//       data,
//       {
//         headers: {
//           Organization: organisation, // Pass the organisation dynamically
//           'Content-Type': 'application/json',
//         },
//       },
//     )
//     return response.data
//   } catch (error) {
//     return error
//   }
// }
// //newly added feedbackscore
// export async function getAllInterviews() {
//   try {
//     const response = await internalApi.get(
//       `/get_all_interview_data/${organisation}`,
//     )
//     return response.data
//   } catch (error) {
//     return error
//   }
// }
// export async function getSkillScore(objectId: string) {
//   try {
//     const response = await internalApi.post(
//       `/generate-skills/${organisation}`,
//       {
//         object_id: objectId,
//       },
//     )
//     return response.data
//   } catch (error) {
//     return error
//   }
// }
// //questionformat
// export async function generateQuestions(formData: FormData) {
//   try {
//     const response = await internalApi.post(
//       `/question_generation/${organisation}`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       },
//     )
//     return response.data
//   } catch (error) {
//     return error
//   }
// }
import internalApi from '../utilities/internalApiPy'

const organisation = localStorage.getItem('organisation')

// ✅ Post Resume API (Fixed Organisation Handling)
export async function postResume(data: any) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.post('/get_resume/', data, {
      headers: {
        Organization: organisation,
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching resume:', error)
    return error
  }
}

// ✅ Get Resume by ID
export async function getResumeById(requestData: any) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.post('/get_resume/', requestData, {
      headers: { Organization: organisation },
    })
    return response.data
  } catch (error) {
    return error
  }
}

// ✅ Get All Resumes (Fixed Organisation Handling)
export async function getAllResume(data: any) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.post('/get_score/', data, {
      headers: { Organization: organisation },
    })
    return response.data
  } catch (error) {
    return error
  }
}

// ✅ Upload Resume (Fixed Organisation Handling)
export async function uploadResume(data: any) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.post('/upload/', data, {
      headers: { Organization: organisation },
    })
    return response.data
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}

// ✅ Score Resume API
export async function scoreResume(data: any) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.post('/new_jd/', data, {
      headers: {
        Organization: organisation,
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error scoring resumes:', error)
    return error
  }
}

// ✅ Get Resume Score
export async function getResumeScore(data: any) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.post('/get_jd_score/', data, {
      headers: { Organization: organisation },
    })
    return response.data
  } catch (error) {
    return error
  }
}

// ✅ Get Resume Count (Fixed Organisation Handling)
// export async function getResumeCount() {
//   try {
//     const response = await internalApi.get('/get_resume_count/', {
//       headers: { Organization: organisation },
//     })
//     return response.data
//   } catch (error) {
//     return error
//   }
// }
export async function getResumeCount(organization: any) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.get('/get_resume_count/', {
      headers: { Organization: organization }, // ✅ Pass organization dynamically
    })
    return response.data
  } catch (error) {
    console.error('Error fetching resume count:', error)
    throw error
  }
}

// ✅ Upload Status API
export async function uploadStatus(data: any) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.post('/resume_upload_status/', data, {
      headers: { Organization: organisation },
    })
    return response.data
  } catch (error) {
    return error
  }
}

// ✅ Get All Interviews (Fixed Organisation Handling)
export async function getAllInterviews() {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.get('/get_all_interview_data/', {
      headers: { Organization: organisation },
    })
    return response.data
  } catch (error) {
    return error
  }
}

// ✅ Get Skill Score
export async function getSkillScore(objectId: string) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.post(
      '/generate-skills/',
      { object_id: objectId },
      {
        headers: { Organization: organisation },
      },
    )
    return response.data
  } catch (error) {
    return error
  }
}

// ✅ Generate Interview Questions (Multipart Form Data)
export async function generateQuestions(formData: FormData) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.post('/question_generation/', formData, {
      headers: {
        Organization: organisation,
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    return error
  }
}
export async function CodingAssessment(formData: FormData) {
  const organisation = localStorage.getItem('organisation')
  try {
    const response = await internalApi.post('/coding_questions/', formData, {
      headers: {
        Organization: organisation,
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    return error
  }
}
