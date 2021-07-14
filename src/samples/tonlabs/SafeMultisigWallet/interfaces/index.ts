import {ResultOfCall} from '../../../../contract/interfaces/ResultOfCall'

export interface SafeMultisigWalletDeployIn {
    owners: string[] | number[],
    reqConfirms: number
}


export interface SafeMultisigWalletSendTransactionIn {
    dest: string
    value: number
    bounce: boolean
    flags: number
    payload: string
}


export interface SafeMultisigWalletSubmitTransactionIn {
    dest: string
    value: number
    bounce: boolean
    allBalance: boolean
    payload: string
}

export interface SafeMultisigWalletSubmitTransactionResult extends ResultOfCall {
    out: SubmitTransactionOut
}

export interface SubmitTransactionOut extends ResultOfCall {
    transId: string
}


export interface ConfirmTransactionIn {
    transactionId: string
}