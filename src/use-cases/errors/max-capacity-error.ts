export class ExceededCapacityTypeError extends Error {
  constructor() {
    super('This room was exceeded capacity!')
  }
}
