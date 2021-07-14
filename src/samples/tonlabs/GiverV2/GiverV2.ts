import {KeyPair} from '@tonclient/core/dist/modules'
import {Contract} from '../../../contract'
import GiverV2Contract from './code/GiverV2'
import {TonClient} from '@tonclient/core'
import {ResultOfCall} from '../../../contract/interfaces/ResultOfCall'
import {GetMessagesResult, SendTransactionIn, UpgradeIn} from './interfaces'

/**
 * @see https://github.com/tonlabs/tonos-se/tree/master/contracts/giver_v2
 */
export class GiverV2 extends Contract {
    constructor(client: TonClient, timeout: number, keys: KeyPair) {
        super(client, timeout, {
            abi: GiverV2Contract.abi,
            initialData: {},
            keys: keys,
            tvc: GiverV2Contract.tvc
        })
    }


    /**********
     * PUBLIC *
     **********/
    public sendTransaction(
        input: SendTransactionIn,
        keys?: KeyPair
    ): Promise<ResultOfCall> {
        input.bounce = input.bounce ?? false
        return this.call('sendTransaction', input, keys)
    }

    public async upgrade(
        input: UpgradeIn
    ): Promise<ResultOfCall> {
        return await this.call('upgrade', input)
    }

    public async getMessages(): Promise<GetMessagesResult> {
        return await this.call('getMessages')
    }
}