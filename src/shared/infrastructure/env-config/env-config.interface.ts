export interface EnvConfig {
  getAppPort(): number
  getNodeEnv(): string
  getJwtSecret(): string
  getJwtExpiresInSeconds(): number
}
