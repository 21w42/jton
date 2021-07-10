import {NetConfig} from '../config'
import {Config} from '../config'

export class Net {
    private static readonly PARAMETER: string = 'net'
    private static readonly ERROR_MESSAGE: string = 'UNKNOWN NETWORK'

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
    public static getConfig(config: Config): NetConfig {
        const net: string = process.env[Net.PARAMETER] ?? config.defaultNet
        if (!config.net.hasOwnProperty(net))
            throw new Error(`${Net.ERROR_MESSAGE} ${net}`)
        return config.net[net]
    }
}