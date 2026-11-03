# Переписка с AI-assisted поддержкой OpenAI — ChatGPT Tab Safe Monitor

**Зафиксировано в репозитории:** 2026-11-03. **Дата самого обращения:** отдельно не подтверждена.

**Происхождение:** владелец репозитория передал полный текст своего обращения и полученного ответа в ChatGPT и приложил скриншот окна `help.openai.com`. Здесь сохранена предоставленная пользователем текстовая копия; оригинальная переписка в системе поддержки не проверялась независимо. Скриншот не публикуется, чтобы не раскрывать сведения об аккаунте.

**Важный статус:** ответ начинается с «I’m AI-assisted support». Это автоматизированная служба поддержки OpenAI, **не подтверждённый ответ человека, не официальное юридическое разрешение и не гарантия от мер в отношении аккаунта**. Это не ответ текущего GPT-6-ассистента, разрабатывающего расширение; конкретная модель бота поддержки неизвестна.

## Вопрос пользователя — полный текст (передан владельцем)

```text
Hello OpenAI Support,

I'm developing a personal, open-source Firefox extension to monitor browser tab performance while using ChatGPT.

The initial version uses only Firefox's official Tabs API. It does not read messages, prompts, responses, DOM content, cookies, authentication tokens, or internal ChatGPT APIs. It does not send any requests to OpenAI or transmit collected data. It only displays browser-provided tab metadata and allows the user to manually discard inactive tabs using Firefox's built-in API.

Could you please confirm whether this specific functionality complies with OpenAI's Terms of Use?

Separately, would counting only the number of rendered messages, characters, and DOM nodes locally, without extracting or storing message content, be permitted?

My main concern is avoiding any risk of account suspension. Please clarify whether these two approaches are allowed, and whether you can provide written guidance.

Repository(very safe version, have not even use it, still): https://github.com/devinsondev/TABS_INFO_ChatGPT_FIREFOX

Thank you.
```

## Ответ AI-assisted поддержки — полный текст (передан владельцем)

```text
I’m AI-assisted support. I can’t provide an official compliance determination or “written confirmation” that would protect against enforcement, but I can share the relevant public rules to check against.

Based on what you described (Firefox Tabs API only; no reading ChatGPT content/cookies/tokens; no calls to OpenAI; no bypassing access controls), nothing in our public docs specifically prohibits a local-only performance/metadata tool—but you still must comply with the **Terms of Use** and **Usage Policies** and avoid any attempt to circumvent security/access restrictions.  
https://openai.com/terms/  
https://openai.com/policies/usage-policies/

For the second approach: counting rendered message count/character count/DOM node counts **locally** without extracting or storing message content isn’t explicitly addressed in our public docs; the key is to avoid collecting/transmitting ChatGPT content or credentials and avoid automation/scraping that could be seen as circumventing restrictions.
```

## Что следует и чего НЕ следует из ответа

- По описанию **первой, metadata-only версии** AI-assisted поддержка не указала на конкретный запрет в общедоступных документах. Это **не** позитивное официальное решение о соблюдении условий.
- **Второй подход** (локальный счётчик сообщений/символов/DOM-узлов) в публичных документах явно не урегулирован; ответ его не разрешает и не подтверждает отсутствие риска.
- В любом случае остаётся обязательство соблюдать [Terms of Use](https://openai.com/terms/) и [Usage Policies](https://openai.com/policies/usage-policies/).
- **Никаких гарантий от блокировки** не выдавалось. Из ответа нельзя вывести согласие на скрейпинг, извлечение текста, модификацию интерфейса ChatGPT или обход ограничений.
- В [Safe-версии](README.md) намеренно остаются только функции Firefox Tabs API; проектный контекст и моя независимая, неофициальная оценка — в [AUTHOR_ASSESSMENT.md](AUTHOR_ASSESSMENT.md).

Данный файл — **свидетельство переданного пользователем ответа**, а не самостоятельное подтверждение OpenAI или предписание расширению выполнять действия.
