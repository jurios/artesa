import {IArgument, INormalizedArgument} from "../src/command/argument";

export function createMockINormalizedArgument(name: string): INormalizedArgument {
    return {
        name: name,
        description: name + ' description',
        required: false,
        type: String
    }
}