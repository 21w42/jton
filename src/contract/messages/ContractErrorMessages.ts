import colors from 'colors'
import {StringMap} from '../../types'

export const ContractErrorMessages: StringMap = {
    CONTRACT_KEYS_IS_UNDEFINED: colors.red('CONTRACT KEYS IS UNDEFINED'),
    CONTRACT_TVC_IS_UNDEFINED: colors.red('CONTRACT TVC IS UNDEFINED'),
    ARGUMENTS: 'ARGUMENTS',
    CALL: 'CALL...',
    DONE: colors.green('DONE')
}