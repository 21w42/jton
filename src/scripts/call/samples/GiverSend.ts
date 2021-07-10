import {Call} from '../Call'
import {CallConfig} from '../interfaces/CallConfig'
import {GiverSendEnum} from './GiverSendEnum'
import {KeyPair} from '@tonclient/core/dist/modules'
import {Contract} from '../../../contract'
import {GiverV2} from '../../../contracts'
import {StringMap} from '../../../types'
import {readInt} from '../readers/readInt'
import {readBoolean} from '../readers/readBoolean'

export class GiverSend extends Call {
    /**
     * @param config
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
    constructor(config: CallConfig) {
        super(config, Object.values(GiverSendEnum))
    }

    /**
     * Create and return contract object.
     * @param keys
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     */
    protected _getContract(keys: KeyPair): Contract {
        return new GiverV2(this._client, this._config.net.timeout, keys)
    }

    /**
     * Create and return target contract object.
     * @param map
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
     * @param contract A contract on which we call the public method with an external message.
     * @param keys
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     * @param map
     * Example:
     *     {
     *         address: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff ',
     *         value: '1_000_000_000',
     *         bounce: 'false'
     *     }
     */
    protected async _call(contract: GiverV2, map: StringMap, keys: KeyPair): Promise<void> {
        const address: string = map[GiverSendEnum.ADDRESS]
        const value: number = readInt(map[GiverSendEnum.VALUE])
        const bounce: boolean = readBoolean(map[GiverSendEnum.BOUNCE])
        await contract.sendTransaction(address, value, bounce, keys)
    }
}