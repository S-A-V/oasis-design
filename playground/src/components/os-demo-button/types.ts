export interface ButtonProps {
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  disabled?: boolean
}

export interface ButtonEmits {
  click: [event: MouseEvent]
}
