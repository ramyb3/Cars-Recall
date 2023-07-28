import axios from "axios";

export type MailTemplate = {
  resolution: string;
  response: string;
  name: string;
};

export async function sendMail(mailText: MailTemplate | null, text: string) {
  try {
    //@ts-ignore
    await axios.post(process.env.NEXT_PUBLIC_MAIL, { ...mailText, text });
  } catch (e) {
    console.error(e);
  }
}

export async function getUserAgent() {
  let body = null;

  try {
    const response = await axios.get(
      `https://api.apicagent.com/?ua=${navigator.userAgent}`
    );

    body = {
      resolution: `${window.screen.width} X ${window.screen.height}`,
      response: JSON.stringify(response.data, null, 2),
      name: "Cars Recall",
    };
  } catch (e) {
    console.error(e);
  }

  return body;
}

export const getData = async () => {
  try {
    const resp = await axios.get("/api/data");
    return resp.data.result.records;
  } catch (e) {
    console.error(e);
    return [];
  }
};
