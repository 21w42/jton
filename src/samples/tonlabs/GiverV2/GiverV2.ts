import {KeyPair, ResultOfProcessMessage} from '@tonclient/core/dist/modules'
import {Contract} from '../../../contract'
import GiverV2Contract from './code/GiverV2'
import {TonClient} from '@tonclient/core'

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
    /**
     * @param input
     * Example:
     *     {
     *         dest: '0:0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         value: 1_000_000_000,
     *         bounce: false
     *     }
     * @param keys
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     */
    public sendTransaction(
        input: {
            dest: string
            value: number
            bounce?: boolean
        },
        keys?: KeyPair
    ): Promise<ResultOfProcessMessage> {
        input.bounce = input.bounce ?? false
        return this.call('sendTransaction', input, keys)
    }

    /**
     * @param input
     * Example:
     *     {
     *         code: '0344abc...'
     *     }
     */
    public async upgrade(
        input: {
            code: string
        }
    ): Promise<ResultOfProcessMessage> {
        return await this.call('upgrade', input)
    }
}