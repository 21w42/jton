import {Extension} from '../types/Extension'
import {Export} from '../types/Export'

export interface MakeConfig {
    root: string,
    compile?: string[]
    wrap?: string[]
    compiler?: string
    linker?: string
    stdlib?: string
    extension?: Extension
    export?: Export
}