import { HttpStatus } from "@nestjs/common";

export class ResponseFormatter {
    public static success(message: string, data: any,
        statusCode: number = HttpStatus.OK) {
        return {
            statusCode,
            message,
            data: data ?? [],
        };
    }

    public static error(message: string, errorDetails: string, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR) {
        const error = new Error(errorDetails);
        return {
            statusCode,
            error: {
                message,
                details: errorDetails,
                stack: error.stack,
            }
        }
    }
}