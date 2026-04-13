import { shopifyFetch } from './client'

export type ShopLocale = {
  isoCode: string
  name: string
  endonymName: string
}

const LOCALE_FLAGS: Record<string, string> = {
  EN: '🇺🇸',
  AR: '🇸🇦',
  FR: '🇫🇷',
  DE: '🇩🇪',
  ES: '🇪🇸',
  JA: '🇯🇵',
}

export function getLocaleFlag(isoCode: string): string {
  return LOCALE_FLAGS[isoCode.toUpperCase()] ?? '🌐'
}

export async function getShopLocales(): Promise<ShopLocale[]> {
  try {
    const data = await shopifyFetch<{
      localization: { availableLanguages: ShopLocale[] }
    }>({
      query: `query {
        localization {
          availableLanguages {
            isoCode
            name
            endonymName
          }
        }
      }`,
      cache: 'force-cache',
    })
    return data.localization.availableLanguages
  } catch {
    return [{ isoCode: 'EN', name: 'English', endonymName: 'English' }]
  }
}
