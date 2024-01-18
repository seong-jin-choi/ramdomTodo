import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "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" });

/* 
es (Spanish)
de (German)
en (English)
it (Italian)
en-US (English/United States)
en-GR (English/United Kingdom)
es-ES (Spanish/Spain)
es-MX (Spanish/Mexico)
pt-BR (Portuguese/Brazil)
ja-JP (Japan)
ko-KR (Korean)
*/

type languageCode = "es" | "de" | "en" | "it" | "ko-KR" | "en-US" | "en-GR" | "es-ES" | "es-MX" | "pt-BR" | "ja-JP" | "ko-KR";
interface IBody {
  AccountLanguage: languageCode | undefined;
  todoCount: string | undefined;
}
const getLanguage = (body: IBody, headers: Request["headers"]): languageCode => {
  if (body.AccountLanguage) {
    return body.AccountLanguage;
  }
  if (headers["accept-language"]) {
    return headers["accept-language"].split(",")[0] as languageCode;
  }
  return "en-US";
};

const makeTodo = async (count: string) => {
  const makeResult = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      {
        role: "user",
        content: `Generate ${count} simple tasks that can be done in daily life. Each task should be separated by a comma and should not be listed. Also, each task should not exceed 50 characters.`,
      },
    ],
    temperature: 1.2,
    max_tokens: 500,
  });
  const result = makeResult.choices[0].message.content;
  if (!result) throw new Error();
  const todos = Object.values(JSON.parse(result))[0] as string[];
  return todos;
};
const translateTodo = async (todos: string[], language: languageCode) => {
  const translateResult = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      {
        role: "user",
        content: `Translate the elements of ${todos} array into ${language}, only contains ${language}`,
      },
    ],
  });
  const result = translateResult.choices[0].message.content;
  if (!result) throw null;
  return Object.values(JSON.parse(result))[0];
};

export const getTodo = async (req: Request, res: Response) => {
  try {
    const body: IBody = req.body;
    const language = getLanguage(body, req.headers);

    const tiemoutPromise = new Promise<string>((resolve, reject) => {
      setTimeout(resolve, 10000, "응답시간 초과됨.");
    });
    if (!body.todoCount) return res.sendStatus(400);

    const completion = await Promise.race([makeTodo(body.todoCount), tiemoutPromise]);

    if (typeof completion === "string") return res.status(408).json("408 Request Timeout");
    if (language === "en-US") return res.status(200).json(completion);

    return res.status(200).json(await translateTodo(completion, language));
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
