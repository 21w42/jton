import {ResultOfCall} from '../../../../contract/interfaces/ResultOfCall'

export interface DeployIn {
    owners: string[] | number[],
    reqConfirms: number
}


export interface SendTransactionIn {
    dest: string
    value: number
    bounce: boolean
    flags: number
    payload: string
}


export interface SubmitTransactionIn {
    dest: string
    value: number
    bounce: boolean
    allBalance: boolean
    payload: string
}

export interface SubmitTransactionResult extends ResultOfCall {
    out: SubmitTransactionOut
}

export interface SubmitTransactionOut extends ResultOfCall {
    transId: string
}


export interface ConfirmTransactionIn {
    transactionId: string
}