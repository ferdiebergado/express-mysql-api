export interface RegisterDTO {
  email: string
  password: string
  passwordConfirmation: string
}

export type LoginDTO = Omit<RegisterDTO, 'passwordConfirmation'>
