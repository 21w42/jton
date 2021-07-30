import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {KeyPair} from '@tonclient/core/dist/modules'
import {getKeysByName, getNetConfig, readKeys} from '../'
import {Config, NetConfig} from '../../config'
import {StringMap} from '../../types'
import {Contract} from '../../contract'

export interface TestKit {
    client: TonClient
    giverKeys: KeyPair
}

export interface TestGiverKit {
    client: TonClient
    giver: Contract
}

export function prepare(config: Config, keysMap: StringMap): TestKit {
    TonClient.useBinaryLibrary(libNode)
    const netConfig: NetConfig = getNetConfig(config)
    const client: TonClient = new TonClient(netConfig.client)

    const giverKeysFile: string = getKeysByName(keysMap, netConfig.transactions.giver)
    const giverKeys: KeyPair = readKeys(giverKeysFile)
    return {
        client: client,
        giverKeys: giverKeys
    }
}