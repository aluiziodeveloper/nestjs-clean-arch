export type FieldsErrors = {
  [field: string]: string[]
}

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErrors
  validatedData: PropsValidated
  validate(data: any): boolean
}
