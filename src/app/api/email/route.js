import openClient from "@/lib/open-router";

const PURPOSE_SUBJECTS = {
  "meeting-request": "Request for a quick meeting",
  "follow-up": "Following up on our last conversation",
  introduction: "Introduction",
  "thank-you": "Thank you",
  apology: "Apologies for the inconvenience",
  "job-application": "Application for the open role",
  "sales-pitch": "A quick idea for your team",
  custom: "Quick note",
};

export async function POST(request) {
  try {
    const {
      purpose,
      recipient,
      sender,
      keyPoints,
      tone,
      length,
    } = await request.json();

    if (!keyPoints?.trim()) {
      return Response.json(
        { error: "Add at least one key point for the email" },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert business email writer.
      Generate a professional email using the following information.

      Purpose:
      ${purpose}

      Recipient:
      ${recipient || "Not specified"}

      Sender:
      ${sender || "Not specified"}

      Tone:
      ${tone}

      Length:
      ${length}

      Key Points:
      ${keyPoints}

      Return ONLY valid JSON.

      {
        "subject": "",
        "greeting": "",
        "body": "",
        "signOff": ""
      }
    `;

    const response = await openClient.chat.completions.create({
      model: "openai/gpt-oss-20b:free",

      messages: [
        {
          role: "system",
          content:
            "You are a professional email writing assistant. Always return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      response_format: {
        type: "json_object",
      },
    });

    const content = response.choices[0].message.content;

    let email;

    try {
      email = JSON.parse(content);
    } catch {

      return Response.json(
        {
          error: "Model returned invalid JSON.",
          raw: content,
          response
        },
        { status: 500 }
      );
    }

    return Response.json({
      subject:
        email.subject ||
        PURPOSE_SUBJECTS[purpose] ||
        "Quick note",

      greeting: email.greeting,

      body: email.body,

      signOff: email.signOff,

      meta: {
        purpose,
        tone,
        length,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to generate email.",
      },
      {
        status: 500,
      }
    );
  }
}