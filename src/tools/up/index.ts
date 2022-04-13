import {consoleTerminal, runCommand} from 'everdev'
import {ClientConfig, TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {StringMap} from '../../types'

export interface UpConfig {
    node: {
        version: string
        port: string | number
        dbPort: string | number
        instance: string
    }
    client: ClientConfig
}

const SE: StringMap = {
    SET: 'se set',
    START: 'se start'
}

/**
 * @param config
 * You can get version from `everdev se version`
 * Example:
 *     {
 *         node: {
 *             version: 'latest',
 *             port: 8080,
 *             dbPort: 'none',
 *             instance: 'default'
 *         },
 *         client: {
 *             ...
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
    await waitAnswerFromNode(config.client)
}

/**
 * Wait answer from GraphQL.
 */
async function waitAnswerFromNode(config: ClientConfig): Promise<void> {
    TonClient.useBinaryLibrary(libNode)
    const client: TonClient = new TonClient(config)
    await client.net.wait_for_collection({
        collection: 'accounts',
        result: 'id'
    })
    client.close()
}