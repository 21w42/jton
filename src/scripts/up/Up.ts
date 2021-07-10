import {UpConfig} from './interfaces/UpConfig'
import {consoleTerminal, runCommand} from 'tondev'
import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {StringMap} from '../../types'
import {createClient} from '../../utils'

export class Up {
    private static readonly COMMAND: StringMap = {
        SE_SET: 'se set',
        SE_START: 'se start'
    }

    private readonly _config: UpConfig

    /**
     *
     * @param config
     * You can get version from `tondev se version`
     * Example:
     *     {
     *         node: {
     *             version: 'latest',
     *             port: 8080,
     *             dbPort: 'none',
     *             instance: 'default'
     *         },
     *         net: {
     *             url: 'http://localhost',
     *             timeout: 30_000
     *         }
     *     }
     */
    constructor(config: UpConfig) {
        this._config = config
    }

    /**
     * Run command.
     */
    async run(): Promise<void> {
        await runCommand(consoleTerminal, Up.COMMAND.SE_SET, {
            version: this._config.node.version,
            port: this._config.node.port,
            dbPort: this._config.node.dbPort,
            instance: this._config.node.instance
        })
        await runCommand(consoleTerminal, Up.COMMAND.SE_START, {
            instance: this._config.node.instance
        })
        await this._waitAnswerFromNode()
    }

    /**
     * Wait answer from GraphQL.
     */
    async _waitAnswerFromNode(): Promise<void> {
        TonClient.useBinaryLibrary(libNode)
        const client: TonClient = createClient(this._config.net.url)
        await client.net.wait_for_collection({
            collection: 'accounts',
            result: 'id',
            timeout: this._config.net.timeout
        })
        client.close()
    }
}