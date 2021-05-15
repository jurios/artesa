import {IArgument, INormalizedArgument} from "../src/command/input/argument";

export function createMockINormalizedArgument(name: string): INormalizedArgument {
    return {
        name: name,
        description: name + ' description',
        required: false,
        type: String
    }
}