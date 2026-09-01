import { test, expect } from '@playwright/test'
import 'dotenv/config'
import fs from 'fs'

const baseUrl = "https://advanced-multilanguage-ai-translator-api-with-fast-responses.p.rapidapi.com/translate.php";
const apiHost = "advanced-multilanguage-ai-translator-api-with-fast-responses.p.rapidapi.com";
const apiKey = process.env.RAPIDAPI_KEY;

if (!apiKey) {
    throw new Error('RAPIDAPI_KEY environment variable is not set.');
}

const csvEscape = (value: unknown) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}
const testCases = {
    en: [
        "How are you?",
        "Where is the train station?",
        "It's raining cats and dogs.",
        "I deposited money at the bank.",
        "The movie starts at 7:30 PM.",
        "I don't think that's a good idea.",
        "María lives in New York.",
        "Can you help me with this problem?",
        "The package weighs 12.5 kilograms.",
        "Although it was late, we kept working."
    ],
    es: [
        "¿Cómo estás?",
        "¿Dónde está la estación de tren?",
        "Está lloviendo a cántaros.",
        "Deposité dinero en el banco.",
        "La película empieza a las 7:30 de la tarde.",
        "No creo que sea una buena idea.",
        "María vive en Nueva York.",
        "¿Puedes ayudarme con este problema?",
        "El paquete pesa 12,5 kilogramos.",
        "Aunque era tarde, seguimos trabajando."
    ],
    fr: [
        "Comment allez-vous ?",
        "Où est la gare ?",
        "Il pleut des cordes.",
        "J'ai déposé de l'argent à la banque.",
        "Le film commence à 19 h 30.",
        "Je ne pense pas que ce soit une bonne idée.",
        "María habite à New York.",
        "Peux-tu m'aider avec ce problème ?",
        "Le colis pèse 12,5 kilogrammes.",
        "Même s'il était tard, nous avons continué à travailler."
    ]
};

test('test translation', async ({request}) => {
    const response = await request.post(baseUrl, {
        headers: {
            "x-rapidapi-host": apiHost,
            "x-rapidapi-key": apiKey,
            "Content-Type": "application/json"
        },

        data: {
            "text": "This is silly.",
            "source": "en",
            "target": "es"
        }
    })

    const body = await response.json()

    // console.log(response.status())
    // console.log(body.translation)

}
)

test.only('multilingual translation', async ({request}) => {
    test.setTimeout(30 * 60 * 1000)
    const results = [];

    const langArray = [
        {
            source: "en",
            target: "es"
        },
        {
            source: "es",
            target: "en"
        },
        {
            source: "en",
            target: "fr"
        },
        {
            source: "fr",
            target: "en"
        }
    ] as const;

    const runs = Array.from({ length: 10}, (_, i) => i + 1)

    for (const lang of langArray) { 
        for (const testCase of testCases[lang.source]) {
            for (const run of runs) {
                const startTime = Date.now()
                const response = await request.post(baseUrl, {
                    headers: {
                        "x-rapidapi-host": apiHost,
                        "x-rapidapi-key": apiKey,
                        "Content-Type": "application/json"
                    },

                    data: {
                        "text": testCase,
                        "source": lang.source,
                        "target": lang.target
                    }
                })
                const endTime = Date.now()
                const response_time_ms = endTime - startTime

                if (response.status() === 429) {
                    break;
                }

                expect(response.status()).toBe(200)

                console.log(`Response time: ${response_time_ms} ms`)
                console.log(response.status())
                const body = await response.json();
                console.log(body)

                results.push({
                    run,
                    category: "basic translation",
                    source: lang.source,
                    target: lang.target,
                    input: testCase,
                    status: response.status(),
                    result: response.status() == 200 ? "PASS" : "FAIL",
                    response_time_ms,
                    translation: body.translation
                });

            }

        }
    }

    const headers = [
                    "run",
                    "category",
                    "source",
                    "target",
                    "input",
                    "status",
                    "result",
                    "response_time_ms",
                    "translation"
                ]

    const headerRow = headers.join(",")

    const rows = results.map(result => {
        return [
            result.run,
            result.category,
            result.source,
            result.target,
            result.input,
            result.status,
            result.result,
            result.response_time_ms,
            result.translation
        ].map(csvEscape).join(",");
    });

    const csv = [headerRow, ...rows].join("\n");
    fs.writeFileSync("translation_results.csv", csv, "utf-8")

    console.log(results)


});