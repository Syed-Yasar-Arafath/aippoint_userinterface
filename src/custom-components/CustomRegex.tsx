export const numberRegex = /^\d{6}$/
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const containsOnlyCharacters = /\D+/
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^&*])[A-Za-z\d@$!%^&*]{10,}$/
export const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/

export const loginPasswordRegex = /^[^\s]{13}$/

export const loginPasswordRegex1 = /^.*$/

// export const regularExp = /^(?![^ ]* {4})[a-zA-Z ]+$/
export const regularExp = /^(?!.* {4})([a-zA-Z/]+(?: [a-zA-Z/]+){0,3})$/

export const phoneRegex = /^\d{7,15}$/
export const characterOnlyRegex = /^[A-Za-z]+$/
// export const addressRegex = /^[A-Za-z\d\s.,#\-]+$/
export const pincodeRegex = /^\d{6}$/
export const countryRegex =
  /^(?=[a-zA-Z ]{4,}$)[a-zA-Z]+(?:[ ]?[a-zA-Z]+){0,2}$/
export const occupationRegex =
  /^(?=[a-zA-Z ]{4,}$)[a-zA-Z]+(?:[ ]?[a-zA-Z]+){0,5}$/
