import colors from 'colors'
import {StringMap} from '../../../types'

export const CallMessages: StringMap = {
    INVALID_ARGUMENTS_COUNT: colors.red('INVALID ARGUMENTS COUNT'),
    ACCOUNT_IS_NOT_ACTIVE: colors.red('ACCOUNT IS NOT ACTIVE'),
    ARGUMENTS: 'ARGUMENTS',
    CALL: 'CALL...',
    DONE: colors.green('DONE')
}