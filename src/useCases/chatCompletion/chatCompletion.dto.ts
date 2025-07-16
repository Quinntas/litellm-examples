import type z from "zod";

type Model = string

type FileInput = {
    type: "file",
    file: {
        file_data: string
    }
}

type TextInput = {
    type: "text",
    text: string
}

type Input = {
    role: 'system' | 'developer' | 'user' | 'assistant',
    content: Array<FileInput | TextInput>
}

type Metadata = {
    tags?: string[]
}

export interface ChatCompletionDto {
    temperature?: number
    systemPrompt?: string
    model: Model,
    messages: Input[],
    format?: z.ZodObject<any>
    metadata?: Metadata
    stream?: boolean
    responseFormat?: {
        type: "json_object"
    } | {
        type: "json_schema",
        json_schema: z.ZodObject<any>
    }
}

export interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
            refusal: null | string;
            annotations: any[];
        };
        logprobs: null | any;
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        prompt_tokens_details: {
            cached_tokens: number;
            audio_tokens: number;
        };
        completion_tokens_details: {
            reasoning_tokens: number;
            audio_tokens: number;
            accepted_prediction_tokens: number;
            rejected_prediction_tokens: number;
        };
    };
    service_tier: string;
}

export type ChatCompletionResponseDto<T = string> = T