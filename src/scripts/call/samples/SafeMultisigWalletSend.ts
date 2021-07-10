import {Call} from '../Call'
import {CallConfigInterface} from '../interfaces/CallConfigInterface'
import {SafeMultisigWalletSendEnum} from './SafeMultisigWalletSendEnum'
import {KeyPair} from '@tonclient/core/dist/modules'
import {Contract} from '../../../contract'
import {StringMap} from '../../../types'
import {GiverSendEnum} from './GiverSendEnum'
import {readInt} from '../readers/readInt'
import {readBoolean} from '../readers/readBoolean'
import {SafeMultisigWallet} from '../../../contracts'

export class SafeMultisigWalletSend extends Call {
    /**
     * @param config {InfoConfigInterface}
     * Example:
     *     {
     *         net: {
     *             url: 'http://localhost',
     *             timeout: 30_000
     *         },
     *         locale: 'EN',
     *         keys: `${__dirname}/../library/keys/GiverV2.se.keys.json`
     *     }
     */
    public constructor(config: CallConfigInterface) {
        super(config, Object.values(SafeMultisigWalletSendEnum))
    }

    /**
     * Create and return contract object.
     * @param keys {KeyPair}
     * Example:
     *     {
     *         public: '0x2ada2e65ab8eeab09490e3521415f45b6e42df9c760a639bcf53957550b25a16',
     *         secret: '0x172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3'
     *     }
     */
    protected _getContract(keys: KeyPair): Contract {
        return new SafeMultisigWallet(this._client, this._config.net.timeout, keys)
    }

    /**
     * Create and return target contract object.
     * @param map {StringMap}
     * Example:
     *     {
     *         address: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff'
     *     }
     */
    protected _getTargetContract(map: StringMap): Contract {
        return new Contract(this._client, this._config.net.timeout,{
            abi: {},
            address: map[GiverSendEnum.ADDRESS]
        })
    }

    /**
     * Call the public method with an external message.
     * @param contract {Contract} A contract on which we call the public method with an external message.
     * @param keys {KeyPair}
     * Example:
     *     {
     *         public: '0x2ada2e65ab8eeab09490e3521415f45b6e42df9c760a639bcf53957550b25a16',
     *         secret: '0x172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3'
     *     }
     * @param map {StringMap}
     * Example:
     *     {
     *         address: '0x123... ',
     *         value: '1_000_000_000',
     *         bounce: 'false'
     *     }
     */
    protected async _call(contract: SafeMultisigWallet, map: StringMap, keys?: KeyPair): Promise<void> {
        const address: string = map[SafeMultisigWalletSendEnum.ADDRESS]
        const value: number = readInt(map[SafeMultisigWalletSendEnum.VALUE])
        const bounce: boolean = readBoolean(map[SafeMultisigWalletSendEnum.BOUNCE])
        const flags: number = readInt(map[SafeMultisigWalletSendEnum.FLAGS])
        const comment: string = map[SafeMultisigWalletSendEnum.COMMENT]
        await contract.sendTransactionWithComment(address, value, bounce, flags, comment, keys)
    }
}