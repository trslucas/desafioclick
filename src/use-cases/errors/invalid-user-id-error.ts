export class InvalidUserError extends Error {
  constructor() {
    super('User not found')
  }
}
