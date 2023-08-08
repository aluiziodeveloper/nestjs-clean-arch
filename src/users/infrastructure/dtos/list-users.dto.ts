import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase'
import { IsOptional } from 'class-validator'

export class ListUsersDto implements ListUsersUseCase.Input {
  @IsOptional()
  page?: number

  @IsOptional()
  perPage?: number

  @IsOptional()
  sort?: string

  @IsOptional()
  sortDir?: SortDirection

  @IsOptional()
  filter?: string
}
