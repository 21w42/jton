import {Config, NetConfig} from '../../config'

/**
 * @param config
 * Example:
 *     {
 *         net: {
 *             local: {
 *                 url: 'http://localhost:8080',
 *                 timeout: 30_000,
 *                 transactionFee: 0.02,
 *                 tolerance: 0.000_001,
 *                 giver: 'se'
 *             },
 *             dev: {
 *                 url: 'https://net.ton.dev',
 *                 timeout: 60_000,
 *                 transactionFee: 0.02,
 *                 tolerance: 0.000_001,
 *                 giver: 'dev'
 *             }
 *         },
 *         defaultNet: 'local'
 *     }
 * @return
 * Example:
 *     {
 *         url: 'http://localhost:8080',
 *         timeout: 30_000,
 *         transactionFee: 0.02,
 *         tolerance: 0.000_001,
 *         giver: 'se'
 *     }
 */
export function getConfig(config: Config): NetConfig {
    const PARAMETER: string = 'net'
    const ERROR_MESSAGE: string = 'UNKNOWN NETWORK'
    const net: string = process.env[PARAMETER] ?? config.defaultNet
    if (!config.net.hasOwnProperty(net))
        throw new Error(`${ERROR_MESSAGE} ${net}`)
    return config.net[net]
}