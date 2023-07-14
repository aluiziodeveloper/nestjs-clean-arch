export class InvalidCredentialsError extends Error {
  constructor(public message: string) {
    super(message)
    this.name = 'InvalidCredentialsError'
  }
}
