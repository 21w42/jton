import {TonClient} from '@tonclient/core'
import {KeyPair} from '@tonclient/core/dist/modules'

export interface TestKit {
    client: TonClient
    timeout: number
    giverKeys: KeyPair
}