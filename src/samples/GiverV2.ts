import {KeyPair, ResultOfProcessMessage} from '@tonclient/core/dist/modules'
import {Contract} from '../contract'
import GiverV2Contract from './GiverV2/GiverV2'
import {TonClient} from '@tonclient/core'

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
     * DEPLOY *
     **********/
    public async deploy(): Promise<boolean> {
        return await this._deploy()
    }



    /**********
     * PUBLIC *
     **********/
    /**
     * @param dest Destination address.
     * Example:
     *     '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff'
     * @param value Value in nano crystals.
     * Example:
     *     1_000_000_000
     * @param bounce It's set and deploying falls (only at computing phase, not at action phase!)
     * then funds will be returned.
     * Example:
     *     false
     * @param keys
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     */
    public sendTransaction(
        dest: string,
        value: number,
        bounce: boolean = false,
        keys?: KeyPair
    ): Promise<ResultOfProcessMessage> {
        return this._call('sendTransaction', {
            dest: dest,
            value: value,
            bounce: bounce
        }, keys)
    }
}