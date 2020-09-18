type DamlApiError = {
    errors: string[];
}

function isDamlError(err: any): err is DamlApiError {
    return err.errors !== undefined;
}

type RuntimeError = {
    stack: string;
    message: string;
}

function isRuntimeError(err: any): err is RuntimeError {
    return err.stack !== undefined && err.message !== undefined;
}

export type ErrorMessage = {
    header: string;
    message: string;
}

export function parseError(err: any): ErrorMessage | undefined {
    if (isDamlError(err)) {
        return { header: "DAML API Error", message: err.errors.join('\n') };
    }

    if (isRuntimeError(err)) {
        console.error(err);
        return { header: "An Error Occurred", message: err.message };
    }

    if (typeof err === "string") {
        return { header: "Unknown Error", message: err };
    }

    console.error("An unparsable error was received: ", err);
}
