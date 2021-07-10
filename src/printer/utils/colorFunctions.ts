import colors, {Color} from 'colors'

type ColorFunctionMap = {[key: string]: Color}
export const colorFunctions: ColorFunctionMap = {
    '-1': colors.gray,
    '0': colors.yellow,
    '1': colors.green,
    '2': colors.blue,
    '3': colors.red
}
