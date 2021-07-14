import {consoleTerminal, runCommand} from 'tondev'
import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {StringMap} from '../../types'
import {createClient} from '../../utils'
import {NetConfig} from '../../config'

export interface UpConfig {
    node: {
        version: string
        port: string | number
        dbPort: string | number
        instance: string
    }
    net: NetConfig
}

const SE: StringMap = {
    SET: 'se set',
    START: 'se start'
}

/**
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
export async function up(config: UpConfig): Promise<void> {
    await runCommand(consoleTerminal, SE.SET, {
        version: config.node.version,
        port: config.node.port,
        dbPort: config.node.dbPort,
        instance: config.node.instance
    })
    await runCommand(consoleTerminal, SE.START, {
        instance: config.node.instance
    })
    await waitAnswerFromNode(config.net)
}

/**
 * Wait answer from GraphQL.
 */
async function waitAnswerFromNode(config: NetConfig): Promise<void> {
    TonClient.useBinaryLibrary(libNode)
    const client: TonClient = createClient(config.url)
    await client.net.wait_for_collection({
        collection: 'accounts',
        result: 'id',
        timeout: config.timeout
    })
    client.close()
}