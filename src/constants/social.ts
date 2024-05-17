export const SOCIAL_PROVIDERS = {
    GOOGLE: 'google',
    GITHUB: 'github',
} as const

export type SocialProviderType = typeof SOCIAL_PROVIDERS[keyof typeof SOCIAL_PROVIDERS];