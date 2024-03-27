export class InvalidResourceError extends Error {
  constructor() {
    super('Invalid Resource or resource not found')
  }
}
