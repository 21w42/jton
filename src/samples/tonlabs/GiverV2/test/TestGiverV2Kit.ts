import {TonClient} from '@tonclient/core'
import {GiverV2} from '../GiverV2'

export interface TestGiverV2Kit {
    client: TonClient
    timeout: number
    giver: GiverV2
}