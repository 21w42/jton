import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {KeyPair} from '@tonclient/core/dist/modules'
import {createClient, getKeysByName, getNetConfig, readKeys} from '../index'
import {Config, NetConfig} from '../../config'
import {StringMap} from '../../types'
import {Contract} from '../../contract'

export interface TestKit {
    client: TonClient
    timeout: number
    giverKeys: KeyPair
}

export interface TestGiverKit {
    client: TonClient
    timeout: number
    giver: Contract
}

export function prepare(config: Config, keysMap: StringMap): TestKit {
    TonClient.useBinaryLibrary(libNode)
    const netConfig: NetConfig = getNetConfig(config)
    const client: TonClient = createClient(netConfig.url)

    const timeout: number = netConfig.timeout
    const giverKeysFile: string = getKeysByName(keysMap, netConfig.giver)
    const giverKeys: KeyPair = readKeys(giverKeysFile)
    return {
        client: client,
        timeout: timeout,
        giverKeys: giverKeys
    }
}