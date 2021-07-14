import colors from 'colors'
import {StringMap} from '../../types'

export const messages: StringMap = {
    NOT_ENOUGH_BALANCE: colors.red('NOT ENOUGH BALANCE'),
    ALREADY_DEPLOYED: colors.green('CONTRACT ALREADY DEPLOYED'),
    FROZEN: colors.red('ACCOUNT FROZEN'),
    NON_EXIST: colors.red('ACCOUNT NON EXIST'),
    DEPLOYING: 'DEPLOYING...',
    DEPLOYED: colors.green('DEPLOYED'),
    SENDING: 'SENDING...',
    SENT: colors.green('SENT')
}