import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput } from '../dtos/user-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace GetUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)
      return entity.toJSON()
    }
  }
}
