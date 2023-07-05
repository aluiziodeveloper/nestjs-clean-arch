import { HashProvider } from '@/shared/application/providers/hash-provider'
import { compare, hash } from 'bcryptjs'

export class BcryptjsHashProvider implements HashProvider {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 6)
  }

  async compareHash(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash)
  }
}
