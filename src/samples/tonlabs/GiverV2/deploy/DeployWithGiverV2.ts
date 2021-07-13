import {DeployWithGiver} from '../../../../scripts'
import {KeyPair, ResultOfProcessMessage} from '@tonclient/core/dist/modules'
import {Contract} from '../../../../contract'
import {GiverV2} from '../GiverV2'

export class DeployWithGiverV2 extends DeployWithGiver {
    /**
     * Create and return giver object.
     * @param keys
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     */
    protected _getGiver(keys: KeyPair): Contract {
        return new GiverV2(this._client, this._config.net.timeout, keys)
    }

    /**
     * @param giver
     * @param address
     * Example:
     *     '0:0000000000000000000000000000000000000000000000000000000000000000'
     * @param needSendToTarget
     * Example:
     *     1_000_000_000
     */
    protected async _send(giver: GiverV2, address: string, needSendToTarget: number): Promise<ResultOfProcessMessage> {
        return await giver.sendTransaction({
            dest: address,
            value: needSendToTarget
        })
    }
}