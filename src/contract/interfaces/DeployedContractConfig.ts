import {AbiContract, KeyPair} from '@tonclient/core/dist/modules'

export interface DeployedContractConfig {
    abi: AbiContract
    initialData?: Object
    keys?: KeyPair
    tvc?: string
    address: string
}