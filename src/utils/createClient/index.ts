import {TonClient} from '@tonclient/core'

/**
 * Creates client.
 * @param url
 * Examples:
 *     'http://localhost'
 *     'https://net.ton.dev'
 */
export function createClient(url: string): TonClient {
    return new TonClient({
        network: {
            server_address: url
        }
    })
}