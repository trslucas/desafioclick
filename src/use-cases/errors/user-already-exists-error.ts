export class UserAlreadyExistisError extends Error {
  constructor() {
    super('User Already exists')
  }
}
