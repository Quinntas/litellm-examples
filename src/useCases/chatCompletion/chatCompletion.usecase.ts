import {ChatCompletionDto, ChatCompletionResponse, ChatCompletionResponseDto} from "./chatCompletion.dto";
import {zodResponseFormat} from "openai/helpers/zod";
import {env} from "../../utils/env";

export async function chatCompletion<T = string>(dto: ChatCompletionDto): Promise<ChatCompletionResponseDto<T>> {
    const url = new URL(`${env.LITELLM_URL}/chat/completions`)

    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.LITELLM_API_KEY}`,
        },
        body: JSON.stringify({
            model: dto.model,
            temperature: dto.temperature ?? 1,
            messages: dto.messages,
            metadata: dto.metadata,
            stream: dto.stream ?? false,
            response_format: dto.responseFormat ?
                dto.responseFormat.type === 'json_object' ?
                    dto.responseFormat :
                    zodResponseFormat(dto.responseFormat.json_schema, "json_response") :
                undefined
        },),
    })

    const json = await res.json() as unknown as ChatCompletionResponse

    if (!res.ok)
        throw new Error(JSON.stringify(json))

    let modelResponse = json.choices[0].message.content

    if (!dto.responseFormat)
        return modelResponse as T

    if (dto.responseFormat.type === "json_object")
        return JSON.parse(modelResponse) as T

    return dto.responseFormat.json_schema.parse(JSON.parse(modelResponse)) as T
}