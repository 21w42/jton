import {TonClient} from '@tonclient/core'
import {Contract} from '../../contract'

export interface TestGiverKit {
    client: TonClient
    timeout: number
    giver: Contract
}