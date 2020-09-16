type DamlApiError = {
    errors: string[];
}

function isDamlError(err: any): err is DamlApiError {
    return err.errors !== undefined;
}

export type ErrorMessage = {
    header: string;
    message: string;
}

export function parseError(err: any): ErrorMessage | undefined {
    if (isDamlError(err)) {
        return { header: "DAML API Error", message: err.errors.join('\n') };
    }

    if (typeof err === "string") {
        return { header: "Unknown Error", message: err };
    }

    console.error("An unparsable error object was received: ", err);
}
