export interface FormProps {
  disabled?: boolean
}

export interface FormEmits {
  validate: [isValid: boolean, message: string]
}
