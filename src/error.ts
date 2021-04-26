export class ModelValidationError extends Error {
    constructor(msg?: string) {
        super(msg)
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = ModelValidationError.name
    }
}
