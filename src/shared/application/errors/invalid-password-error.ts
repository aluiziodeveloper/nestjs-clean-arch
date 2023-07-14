export class InvalidPasswordError extends Error {
  constructor(public message: string) {
    super(message)
    this.name = 'InvalidPasswordError'
  }
}
