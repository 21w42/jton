import transferAbi from './abi/transfer.abi.json'
import {
    Abi,
    AbiContract,
    DecodedMessageBody,
    KeyPair,
    ResultOfEncodeMessage,
    ResultOfEncodeMessageBody,
    ResultOfProcessMessage,
    ResultOfQueryCollection,
    ResultOfRunTvm
} from '@tonclient/core/dist/modules'
import {TonClient} from '@tonclient/core'
import {stringToHex} from '../utils'
import {StringMap} from '../types'
import colors from 'colors'

export interface ContractConfig {
    abi: AbiContract
    initialData: Object
    keys: KeyPair
    tvc: string
    address?: string
}

export interface DeployedContractConfig {
    abi: AbiContract
    initialData?: Object
    keys?: KeyPair
    tvc?: string
    address: string
}

export interface ResultOfCall {
    out: any
    result: ResultOfProcessMessage
}

export enum AccountType {
    notFound = -1,
    unInit = 0,
    active = 1,
    frozen = 2,
    nonExist = 3
}

const messages: StringMap = {
    CONTRACT_KEYS_IS_UNDEFINED: colors.red('CONTRACT KEYS IS UNDEFINED'),
    CONTRACT_TVC_IS_UNDEFINED: colors.red('CONTRACT TVC IS UNDEFINED'),
    ARGUMENTS: 'ARGUMENTS',
    CALL: 'CALL...',
    DONE: colors.green('DONE')
}

export class Contract {
    private readonly _abi: Abi
    private readonly _initialData: Object | undefined
    private readonly _keys: KeyPair | undefined
    private readonly _tvc: string | undefined
    private _address: string | undefined
    private _lastTransactionLogicTime: number = 0


    /**********
     * PUBLIC *
     **********/
    /**
     * @param _client
     * @param _timeout
     * Examples:
     *     3000
     *     30000
     *     60000
     * @param config
     * Examples:
     *     // Already deployed contract
     *     {
     *         abi: {'ABI version': 2, '...'}
     *         address: '0:7777777777777777777777777777777777777777777777777777777777777777'
     *     }
     *
     *     // New contract
     *     {
     *         abi: {'ABI version': 2, '...'}
     *         initialData: {name: 'bot'}
     *         keys: {public: '...', secret: '...'}
     *         tvc: 'te6ccg...'
     *     }
     */
    constructor(
        private readonly _client: TonClient,
        private readonly _timeout: number,
        config: ContractConfig | DeployedContractConfig
    ) {
        this._abi = Contract._getAbi(config.abi)
        this._initialData = config.initialData
        this._tvc = config.tvc
        this._keys = config.keys
        this._address = config.address
    }

    /**
     * Calculates the address only once. Next time it returns the already calculated address.
     * You can use if you want to know the address of the contract before deployment.
     * Example:
     *     const client: TonClient = ...
     *     const timeout: number = ...
     *     const keys: KeyPair = ...
     *     const root: ArtRoot = new ArtRoot(client, timeout, keys)
     *     const rootAddress: string = await root.address()
     * @return
     * Example:
     *     '0:97b53be2604579e89bd0077a5456456857792eb2ff09849d14321fc2c167f29e'
     */
    public async address(): Promise<string> {
        if (this._address)
            return this._address

        if (!this._keys)
            throw Error(messages.CONTRACT_KEYS_IS_UNDEFINED)

        if (!this._tvc)
            throw Error(messages.CONTRACT_TVC_IS_UNDEFINED)

        const encodedMessage: ResultOfEncodeMessage = await this._client.abi.encode_message({
            abi: this._abi,
            signer: {
                type: 'Keys',
                keys: this._keys
            },
            deploy_set: {
                tvc: this._tvc,
                initial_data: this._initialData
            }
        })
        return this._address = encodedMessage.address
    }

    /**
     * Use this if you want to wait for a transaction from one contract to another.
     * Example:
     *     const client: TonClient = ...
     *     const timeout: number = ...
     *     const keys: KeyPair = ...
     *     const sender: SenderContract = new SenderContract(client, timeout, keys)
     *     const receiver: ReceiverContract = new ReceiverContract(client, timeout, keys)
     *     await sender.send(await receiver.address(), 1_000_000_000)
     *     const waitingResult: boolean = await receiver.waitForTransaction(5000)
     * @param timeout Time in milliseconds.
     * Examples:
     *     3000
     *     5000
     */
    public async waitForTransaction(timeout?: number): Promise<boolean> {
        timeout = timeout ?? this._timeout
        try {
            const queryCollectionResult: ResultOfQueryCollection = await this._client.net.wait_for_collection({
                collection: 'accounts',
                filter: {
                    id: {
                        eq: await this.address()
                    },
                    last_trans_lt: {
                        gt: this._lastTransactionLogicTime.toString()
                    }
                },
                result: 'last_trans_lt',
                timeout: timeout
            })
            const result: any = queryCollectionResult.result
            this._lastTransactionLogicTime = parseInt(result['last_trans_lt'] ?? '0')
            return true
        } catch (error: any) {
            return false
        }
    }

    /**
     * Return contract balance.
     * Example:
     *     const client: TonClient = ...
     *     const timeout: number = ...
     *     const keys: KeyPair = ...
     *     const safeMultisigWallet: SafeMultisigWallet = new SafeMultisigWallet(client, timeout, keys)
     *     const balance: string = await safeMultisigWallet.balance()
     */
    public async balance(): Promise<string> {
        const queryCollectionResult: ResultOfQueryCollection = await this._client.net.query_collection({
            collection: 'accounts',
            filter: {
                id: {
                    eq: await this.address()
                }
            },
            result: 'balance, last_trans_lt'
        })
        const result: any[] = queryCollectionResult.result
        if (!result.length)
            return '0x0'

        this._lastTransactionLogicTime = result[0]['last_trans_lt']
        return result[0]['balance']
    }

    /**
     * Return contract account type.
     * Example:
     *     const client: TonClient = ...
     *     const timeout: number = ...
     *     const keys: KeyPair = ...
     *     const safeMultisigWallet: SafeMultisigWallet = new SafeMultisigWallet(client, timeout, keys)
     *     const accountType: AccountType = await safeMultisigWallet.accountType()
     */
    public async accountType(): Promise<AccountType> {
        const queryCollectionResult: ResultOfQueryCollection = await this._client.net.query_collection({
            collection: 'accounts',
            filter: {
                id: {
                    eq: await this.address()
                }
            },
            result: 'acc_type, last_trans_lt'
        })
        const result: any[] = queryCollectionResult.result
        if (!result.length)
            return AccountType.notFound

        this._lastTransactionLogicTime = result[0]['last_trans_lt']
        return result[0]['acc_type']
    }

    /**
     * Run method locally.
     * @param method Method name.
     * Example:
     *     'getHistory'
     * @param input
     * Example:
     *     {
     *         offset: 0,
     *         limit: 10
     *     }
     */
    public async run(method: string, input: Object = {}): Promise<DecodedMessageBody> {
        //////////////
        // Read boc //
        //////////////
        const queryCollectionResult: ResultOfQueryCollection = await this._client.net.query_collection({
            collection: 'accounts',
            filter: {
                id: {
                    eq: await this.address()
                }
            },
            result: 'boc'
        })
        const account: string = queryCollectionResult.result[0]['boc']

        /////////
        // Run //
        /////////
        const encodedMessage: ResultOfEncodeMessage = await this._client.abi.encode_message({
            abi: this._abi,
            signer: {
                type: 'None'
            },
            call_set: {
                function_name: method,
                input: input
            },
            address: this._address
        })
        const message: ResultOfRunTvm = await this._client.tvm.run_tvm({
            message: encodedMessage.message,
            account: account
        })

        ///////////////////
        // Decode result //
        ///////////////////
        const outMessages: string = message.out_messages[0]
        return await this._client.abi.decode_message({
            abi: this._abi,
            message: outMessages
        })
    }

    /**
     * External call.
     * @param method Method name.
     * Example:
     *     'getHistory'
     * @param input
     * Example:
     *     {
     *         offset: 0,
     *         limit: 10
     *     }
     * @param [keys] Use it if you want call contact with another keys. this._keys used by default.
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     */
    public async call(method: string, input: Object = {}, keys?: KeyPair): Promise<ResultOfCall> {
        const keysPair: KeyPair | undefined = keys ?? this._keys

        if (!keysPair)
            throw Error(messages.CONTRACT_KEYS_IS_UNDEFINED)

        const resultOfProcessMessage: ResultOfProcessMessage = await this._client.processing.process_message({
            message_encode_params: {
                abi: this._abi,
                signer: {
                    type: 'Keys',
                    keys: keysPair
                },
                address: await this.address(),
                call_set: {
                    function_name: method,
                    input: input
                }
            },
            send_events: false
        })
        this._lastTransactionLogicTime = resultOfProcessMessage.transaction.lt ?? this._lastTransactionLogicTime
        return {
            out: resultOfProcessMessage.decoded ? resultOfProcessMessage.decoded.output ?? {} : {},
            result: resultOfProcessMessage
        }
    }

    /**
     * Deploy.
     * @param input
     * Example:
     *     {
     *         count: 500
     *     }
     */
    public async deploy(input: Object = {}): Promise<ResultOfProcessMessage> {
        if (!this._keys)
            throw Error(messages.CONTRACT_KEYS_IS_UNDEFINED)

        if (!this._tvc)
            throw Error(messages.CONTRACT_TVC_IS_UNDEFINED)

        /////////////////////////////
        // Waiting for balance > 0 //
        /////////////////////////////
        await this._client.net.wait_for_collection({
            collection: 'accounts',
            filter: {
                id: {
                    eq: await this.address()
                },
                data: {
                    eq: null
                },
                code: {
                    eq: null
                },
                balance: {
                    gt: '0'
                }
            },
            result: 'last_trans_lt'
        })

        ////////////
        // Deploy //
        ////////////
        const resultOfProcessMessage: ResultOfProcessMessage = await this._client.processing.process_message({
            message_encode_params: {
                abi: this._abi,
                signer: {
                    type: 'Keys',
                    keys: this._keys
                },
                deploy_set: {
                    tvc: this._tvc,
                    initial_data: this._initialData
                },
                call_set: {
                    function_name: 'constructor',
                    input: input
                }
            },
            send_events: false
        })
        this._lastTransactionLogicTime = resultOfProcessMessage.transaction.lt ?? this._lastTransactionLogicTime
        return resultOfProcessMessage
    }


    /*************
     * PROTECTED *
     *************/
    /**
     * Generate payload message for internal call.
     * @param abi
     * Example:
     *     {'ABI version': 2, '...'}
     * @param method
     * Example:
     *     'bet'
     * @param input
     * Example:
     *     {
     *         value: 1_000_000_000,
     *         luckyNumber: 50
     *     }
     */
    protected async _getPayloadToCallAnotherContract(
        abi: AbiContract,
        method: string,
        input: Object = {}
    ): Promise<string> {
        const resultOfEncoding: ResultOfEncodeMessageBody = await this._client.abi.encode_message_body({
            abi: Contract._getAbi(abi),
            signer: {
                type: 'None'
            },
            call_set: {
                function_name: method,
                input: input
            },
            is_internal: true
        })
        return resultOfEncoding.body
    }

    /**
     * Generate payload message with comment for transfer.
     * @param comment
     * Example:
     *     'for homeless'
     */
    protected async _getPayloadToTransferWithComment(comment: string = ''): Promise<string> {
        const resultOfEncoding: ResultOfEncodeMessageBody = await this._client.abi.encode_message_body({
            abi: Contract._getAbi(transferAbi),
            signer: {
                type: 'None'
            },
            call_set: {
                function_name: 'transfer',
                input: {
                    comment: stringToHex(comment)
                }
            },
            is_internal: true
        })
        return resultOfEncoding.body
    }


    /***********
     * PRIVATE *
     ***********/
    private static _getAbi(abi: AbiContract): Abi {
        return {
            type: 'Contract',
            value: abi
        }
    }
}