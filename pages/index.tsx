import Head from "next/head";
import { useEffect, useState } from "react";
import { MailTemplate, getData, getUserAgent, sendMail } from "@/lib/utils";

export default function Index() {
  const [mailText, setMailText] = useState<MailTemplate | null>(null);
  const [data, setData] = useState([]);
  const [details, setDetails] = useState<any>(null);
  const [search, setSearch] = useState("");

  const numberRegex = /^\d+$/;

  useEffect(() => {
    const getCars = async () => {
      try {
        const resp = await getData();

        setData(resp);
      } catch (e) {
        alert("שגיאה בקבלת הנתונים!");
        return;
      }
    };

    const mail = async () => {
      const resp = await getUserAgent();

      if (resp) {
        setMailText(resp);
        sendMail(resp, "Site Enter");
      }
    };

    getCars();
    mail();
  }, []);

  const searchCar = async () => {
    if (!numberRegex.test(search) && search) {
      setDetails(null);
      alert("נא להקליד רק ספרות!");
      return;
    }
    if (search.length < 7) {
      setDetails(null);
      alert("נא להקליד מספר רכב בעל 7 ספרות לפחות!");
      return;
    }

    const car = data.find((car: any) => car.MISPAR_RECHEV.includes(search));

    setDetails(car ? car : "רכב זה לא נדרש לעשות ריקול");

    await sendMail(mailText, `car number- ${search}`);
  };

  return (
    <>
      <Head>
        <title>כלי רכב שלא ביצעו ריקול</title>
      </Head>

      <header className="text-center text-[#8b0000] font-bold">
        *המידע מתעדכן אחת ליום ע{'"'}י המדינה*
      </header>

      <div className="flex flex-col items-center text-2xl gap-2 mt-[5%]">
        <h1 className="font-bold text-3xl text-center mb-8">
          בדיקת ריקול לכלי רכב
        </h1>
        <input
          className="text-center p-2 border-2 rounded-md border-black"
          placeholder="הזן מספר רכב"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchCar();
            }
          }}
        />
        <button
          className="border-2 rounded-lg p-2 hover:opacity-70 bg-[#f0f0f0] font-bold border-black"
          onClick={searchCar}
        >
          חיפוש
        </button>

        {details && (
          <div className="mt-6 flex flex-col gap-4 text-center">
            {typeof details === "string" ? (
              details
            ) : (
              <>
                <CarDetails
                  data={new Date(details.TAARICH_PTICHA).toLocaleDateString(
                    "en-GB"
                  )}
                  text="תאריך פתיחת"
                />
                <CarDetails
                  data={`${details.SUG_RECALL} - ${details.SUG_TAKALA}`}
                  text="סוג"
                />
                <CarDetails data={details.TEUR_TAKALA} text="תאור" />
              </>
            )}
          </div>
        )}

        <p className="w-[98%] font-bold text-center text-sm mt-10">
          כל הרכבים שעברה מעל חצי שנה מאז שקיבלו מכתב מהיבואן על קריאה חוזרת ולא
          ביצעו את התיקון המבוקש.
          <br />
          לרכבים אלה לא ניתן לחדש את רישיון הרכב ולא ניתן לבצע העברת בעלות.
        </p>
      </div>
    </>
  );
}

function CarDetails({ data, text }: { data: string; text: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-bold">{text} תקלה:</span>
      <span>{data}</span>
    </div>
  );
}
