import {TonClient} from '@tonclient/core'
import {GiverV2} from '../GiverV2'
import {TestGiverKit} from '../../../../scripts/test/TestGiverKit'

export interface TestGiverV2Kit extends TestGiverKit {
    client: TonClient
    timeout: number
    giver: GiverV2
}