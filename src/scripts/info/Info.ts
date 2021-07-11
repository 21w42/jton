import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {InfoConfig} from './interfaces/InfoConfig'
import {Contract} from '../../contract'
import transferAbi from '../../contract/abi/transfer.abi.json'
import {KeyPair} from '@tonclient/core/dist/modules'
import {Printer} from '../../printer'
import {createClient, createRandomKeyFileIfNotExists} from '../../utils'

export class Info {
    protected readonly _client: TonClient

    /**
     * @param _config
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
    constructor(protected readonly _config: InfoConfig) {
        TonClient.useBinaryLibrary(libNode)
        this._client = createClient(this._config.net.url)
    }

    /**
     * Run command.
     */
    async run(): Promise<void> {
        const printer: Printer = new Printer(this._config.locale)
        const keys: KeyPair = await createRandomKeyFileIfNotExists(this._config.keys, this._client)
        const contract: Contract = this._getContract(keys)

        /////////////
        // Network //
        /////////////
        printer.network(this._config.net.url)

        ///////////////////
        // Contract data //
        ///////////////////
        await printer.account(contract)

        this._client.close()
    }


    ////////////////////////
    // MUST BE OVERRIDDEN //
    ////////////////////////
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
        return new Contract(this._client, this._config.net.timeout, {
            abi: transferAbi,
            keys: keys,
            address: '0:0000000000000000000000000000000000000000000000000000000000000000'
        })
    }
}