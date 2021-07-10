import {
    Abi,
    AbiContract,
    DecodedMessageBody,
    KeyPair,
    ResultOfEncodeMessage,
    ResultOfEncodeMessageBody,
    ResultOfProcessMessage,
    ResultOfQueryCollection,
    ResultOfRunTvm,
    ResultOfWaitForCollection
} from '@tonclient/core/dist/modules'
import {TonClient} from '@tonclient/core'
import {ContractConfig} from './interfaces/ContractConfig'
import {DeployedContractConfig} from './interfaces/DeployedContractConfig'
import transferAbi from '../contract/abi/transfer.abi.json'
import {AccountType} from './enums/AccountType'
import {contractErrorMessages} from './contractErrorMessages'
import {string} from '../utils'

export class Contract {
    private readonly _client: TonClient
    private readonly _timeout: number
    private readonly _abi: Abi
    private readonly _initialData: Object | undefined
    private readonly _keys: KeyPair | undefined
    private readonly _tvc: string | undefined
    private _address: string | undefined
    private _lastTransactionLogicTime: number



    /**********
     * PUBLIC *
     **********/
    /**
     * @param client
     * @param timeout
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
        client: TonClient,
        timeout: number,
        config: ContractConfig | DeployedContractConfig
    )
    {
        this._client = client
        this._timeout = timeout
        this._abi = Contract._getAbi(config.abi)
        this._initialData = config.initialData
        this._tvc = config.tvc
        this._keys = config.keys
        this._address = config.address
        this._lastTransactionLogicTime = 0
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
            throw Error(contractErrorMessages.CONTRACT_KEYS_IS_UNDEFINED)

        if (!this._tvc)
            throw Error(contractErrorMessages.CONTRACT_TVC_IS_UNDEFINED)

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
            return AccountType.NOT_FOUND

        this._lastTransactionLogicTime = result[0]['last_trans_lt']
        return result[0]['acc_type']
    }



    /*************
     * PROTECTED *
     *************/
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
    protected async _run(method: string, input: Object = {}): Promise<DecodedMessageBody> {
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
    protected async _call(method: string, input: Object = {}, keys?: KeyPair): Promise<ResultOfProcessMessage> {
        const keysPair: KeyPair | undefined = keys ?? this._keys

        if (!keysPair)
            throw Error(contractErrorMessages.CONTRACT_KEYS_IS_UNDEFINED)

        const processMessageResult: ResultOfProcessMessage = await this._client.processing.process_message({
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
        await this.waitForTransaction()
        return processMessageResult
    }

    /**
     * Deploy.
     * @param input
     * Example:
     *     {
     *         count: 500
     *     }
     * @return
     * Example:
     *     true
     */
    protected async _deploy(input: Object = {}): Promise<boolean> {
        if (!this._keys)
            throw Error(contractErrorMessages.CONTRACT_KEYS_IS_UNDEFINED)

        if (!this._tvc)
            throw Error(contractErrorMessages.CONTRACT_TVC_IS_UNDEFINED)

        /////////////////////////////
        // Waiting for balance > 0 //
        /////////////////////////////
        const waitingNoCodeCollectionResult: ResultOfWaitForCollection = await this._client.net.wait_for_collection({
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
        this._lastTransactionLogicTime = waitingNoCodeCollectionResult.result['last_trans_lt']

        ////////////
        // Deploy //
        ////////////
        const encodedMessage: ResultOfEncodeMessage = await this._client.abi.encode_message({
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
        })
        await this._client.processing.send_message({
            message: encodedMessage.message,
            send_events: false
        })

        ////////////////////////////////////////
        // Waiting for deployment transaction //
        ////////////////////////////////////////
        return await this.waitForTransaction()
    }

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
                    comment: string(comment)
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