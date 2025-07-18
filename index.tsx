import { promises as fs } from "fs";
import * as XLSX from "xlsx";
import { renderToString } from "react-dom/server";
import React from "react";
import { format } from "date-fns/format";
import { google } from "googleapis";

type Slot = {
  name: string;
  times: string;
  class: string;
};

const slot1: Slot = {
  name: "Slot 1",
  times: "11:00 - 12:30",
  class: "slot-slot1",
};
const slot2: Slot = {
  name: "Slot 2",
  times: "15:00 - 16:30",
  class: "slot-slot2",
};
const slot3: Slot = {
  name: "Slot 3",
  times: "16:30 - 17:45",
  class: "slot-slot3",
};
const evening1: Slot = {
  name: "Evening",
  times: "20:30 - 22:00",
  class: "slot-evening",
};
const evening2: Slot = {
  name: "Late Evening",
  times: "22:30 - 23:30",
  class: "slot-late-evening",
};

const slots: Slot[] = [slot1, slot2, slot3, evening1, evening2];

const date27th = new Date("2025-07-27T00:00:00Z");
const date28th = new Date("2025-07-28T00:00:00Z");
const date29th = new Date("2025-07-29T00:00:00Z");
const date30th = new Date("2025-07-30T00:00:00Z");
const date31st = new Date("2025-07-31T00:00:00Z");
const date1st = new Date("2025-08-01T00:00:00Z");
const date2nd = new Date("2025-08-02T00:00:00Z");
const date3rd = new Date("2025-08-03T00:00:00Z");
const date4th = new Date("2025-08-04T00:00:00Z");
const date5th = new Date("2025-08-05T00:00:00Z");

const dates: Date[] = [date27th, date28th, date29th, date30th, date31st, date1st, date2nd, date3rd, date4th, date5th];

type SlotOnDay = {
  date: Date;
  slot: Slot;
  row: number;
};

const slotsOnDays: SlotOnDay[] = [
  {
    date: date27th,
    slot: evening1,
    row: 4,
  },
  {
    date: date28th,
    slot: slot1,
    row: 6,
  },
  {
    date: date28th,
    slot: slot2,
    row: 7,
  },
  {
    date: date28th,
    slot: slot3,
    row: 8,
  },
  {
    date: date29th,
    slot: slot1,
    row: 10,
  },
  {
    date: date29th,
    slot: slot2,
    row: 11,
  },
  {
    date: date29th,
    slot: slot3,
    row: 12,
  },
  {
    date: date29th,
    slot: evening1,
    row: 13,
  },
  {
    date: date29th,
    slot: evening2,
    row: 14,
  },
  {
    date: date30th,
    slot: slot2,
    row: 16,
  },
  {
    date: date30th,
    slot: evening1,
    row: 17,
  },
  {
    date: date31st,
    slot: slot1,
    row: 19,
  },
  {
    date: date31st,
    slot: slot2,
    row: 20,
  },
  {
    date: date31st,
    slot: slot3,
    row: 21,
  },
  {
    date: date31st,
    slot: evening1,
    row: 22,
  },
  {
    date: date31st,
    slot: evening2,
    row: 23,
  },
  {
    date: date1st,
    slot: slot1,
    row: 25,
  },
  {
    date: date1st,
    slot: slot2,
    row: 26,
  },
  {
    date: date1st,
    slot: evening1,
    row: 27,
  },
  {
    date: date2nd,
    slot: slot1,
    row: 29,
  },
  {
    date: date2nd,
    slot: slot2,
    row: 30,
  },
  {
    date: date2nd,
    slot: slot3,
    row: 31,
  },
  {
    date: date2nd,
    slot: evening1,
    row: 32,
  },
  {
    date: date2nd,
    slot: evening2,
    row: 33,
  },
  {
    date: date3rd,
    slot: slot1,
    row: 35,
  },
  {
    date: date3rd,
    slot: evening1,
    row: 36,
  },
  {
    date: date4th,
    slot: slot1,
    row: 38,
  },
  {
    date: date4th,
    slot: slot2,
    row: 39,
  },
  {
    date: date4th,
    slot: slot3,
    row: 40,
  },
  {
    date: date4th,
    slot: evening1,
    row: 41,
  },
  {
    date: date4th,
    slot: evening2,
    row: 42,
  },
  {
    date: date5th,
    slot: evening1,
    row: 44,
  },
];

type Center = {
  name: string;
  slug: string;
  columns: number[];
  image?: string; // Optional image URL for the center
};

const centers: Center[] = [
  {
    name: "Planet Utopia",
    slug: "planet-utopia",
    columns: [3],
  },
  {
    name: "STEM Cell",
    slug: "stem-cell",
    columns: [4],
  },
  {
    name: "MEST-UP",
    slug: "mest-up",
    columns: [5],
  },
  {
    name: "Arts & Crafts",
    slug: "arts-crafts",
    columns: [6, 7, 8],
  },
  {
    name: "Kids Rule the World",
    slug: "kids-rule-the-world",
    columns: [9],
  },
  {
    name: "People's Printing Press",
    slug: "peoples-printing-press",
    columns: [10, 11],
  },
  {
    name: "Ecology",
    slug: "ecology",
    columns: [12, 13],
  },
  {
    name: "Peace & Conflict",
    slug: "peace-conflict",
    columns: [14],
  },
  {
    name: "Puzzles",
    slug: "puzzles",
    columns: [15, 16, 17],
  },
  {
    name: "Trade Union",
    slug: "trade-union",
    columns: [18],
  },
  {
    name: "Trailblazers",
    slug: "trailblazers",
    columns: [19],
  },
  {
    name: "Centres centre",
    slug: "centres-centre",
    columns: [20],
  },
  {
    name: "Cinema 100",
    slug: "cinema-100",
    columns: [21],
    image: "https://camp100.org.uk/wp-content/uploads/2025/07/Cinema-100-Final-Schedule-1-scaled.jpg"
  },
  {
    name: "Main Stage",
    slug: "main-stage",
    columns: [22],
  }
];

type Activity = {
  slotOnDay: SlotOnDay;
  center: Center;
  title: string;
  u12: boolean;
  ml: boolean;
  s: boolean;
  lgbt: boolean;
  prebook: boolean;
  minAge?: number;
};

const activities: Activity[] = [];

async function getGoogleSheetData(sheetId: string, range: string): Promise<string[][]> {
  const sheets = google.sheets({ version: "v4", auth: process.env.GOOGLE_SHEET_API_KEY });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  return response.data.values as string[][];
}

// Example usage:
const sheetId = process.env.SHEET_ID!;
const range = "Sheet1!A1:Z100";
const jsonData: string[][] = await getGoogleSheetData(sheetId, range);

/* async function readFileToArrayBuffer(filePath: string): Promise<ArrayBuffer> {
  const buffer = await fs.readFile(filePath);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

const xslData = await readFileToArrayBuffer("Final Agenda for Core Centres_2025.07.15.xlsx");
const programmeData = XLSX.read(xslData, { type: "array" });

const jsonData: string[][] = XLSX.utils.sheet_to_json(programmeData.Sheets[programmeData.SheetNames[0]], { header: 1 }); */

slotsOnDays.forEach((slot) => {
  centers.forEach((center) => {
    center.columns.forEach((column) => {
      if (jsonData[slot.row - 1][column - 1] !== undefined && jsonData[slot.row - 1][column - 1] !== "") {
        const title = jsonData[slot.row - 1][column - 1];
        const activity: Activity = {
          slotOnDay: slot,
          center: center,
          title: title,
          u12: title.includes("(U12)"),
          ml: title.includes("(ML)"),
          s: title.includes("(S)"),
          lgbt: title.includes("(LGBT)"),
          prebook: title.includes("(pre-book)"), //@ts-expect-error
          minAge: title.match(/(\d+)\+/) ? parseInt(title.match(/(\d+)\+/)[1]) : undefined,
        };
        activities.push(activity);
      }
    });
  });
});

for (const activity of activities) {
  console.log(
    `Slot: ${activity.slotOnDay.date} - ${activity.slotOnDay.slot.name}, Center: ${activity.center.name}, Title: ${activity.title}, U12: ${activity.u12}, ML: ${activity.ml}, S: ${activity.s}, LGBT: ${activity.lgbt}, Min Age: ${activity.minAge}`
  );
}

const ActivityCard: React.FC<{ activity: Activity; showCenter: boolean }> = ({ activity, showCenter }) => {
  return (
    <div className={`activityCard activityCard-${activity.slotOnDay.slot.class} activityCard-center-${activity.center.slug}`}>
      <p className="activityCard-title">{activity.title.split("(")[0]}</p>
      {showCenter ? <p className="activityCard-center-p">{activity.center.name}</p> : null}
      <div className="activity-badges">
        {activity.u12 && (
          <div className="badge u12" data-tooltip="Under 12s">
            <span>U12</span>
          </div>
        )}
        {activity.ml && (
          <div className="badge ml" data-tooltip="Minimal Language">
            <span>ML</span>
          </div>
        )}
        {activity.s && (
          <div className="badge s" data-tooltip="Sustainability themed">
            <span>S</span>
          </div>
        )}
        {activity.lgbt && (
          <div className="badge lgbt" data-tooltip="LGBT+ themed (open to all)">
            <span>🏳️‍🌈</span>
          </div>
        )}
        {activity.prebook && (
          <div className="badge prebook" data-tooltip="Pre-book">
            <span>Pre‑book</span>
          </div>
        )}
        {activity.minAge && (
          <div className="badge min-age">
            <span>{activity.minAge}+</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ChipKey: React.FC = () => (
  <div className="chip-key activityCard">
    <div>
      <div className="badge u12">
        <span>U12</span>
      </div>
      <p><a href="../under-12">Under 12s</a></p>
    </div>
    <div>
      <div className="badge ml">
        <span>ML</span>
      </div>
      <p><a href="../minimal-language">Minimal language</a></p>
    </div>
    <div>
      <div className="badge s">
        <span>S</span>
      </div>
      <p><a href="../sustainability">Sustainability themed</a></p>
    </div>
    <div>
      <div className="badge lgbt">
        <span>🏳️‍🌈</span>
      </div>
      <p><a href="../lgbt">LGBT+ themed (open to all)</a></p>
    </div>
  </div>
);
const PageForCenter: React.FC<{ activities: Activity[]; center: Center }> = ({ activities, center }) => {
  const activitiesForCenter = activities.filter((activity) => activity.center === center);
  return (
    <>
       { center.image && (
        <div className="center-image">
            <img src={center.image} alt={`Activities at ${center.name}`} />
        </div>
      )}
      <div className="center-timetable-table">
        <table className="programme-table programme-table-center">
          <thead>
            <tr>
              <th></th>
              {dates.map((date) => {
                const activitiesForDate = activitiesForCenter.filter((activity) => activity.slotOnDay.date === date);
                if (activitiesForDate.length === 0) return null;
                return (
                  <th key={date.toISOString()}>
                    <a href={`../${format(date, "MM-dd")}`}>{format(date, "eeee do MMMM")}</a>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => {
              const activitiesForSlot = activitiesForCenter.filter((activity) => activity.slotOnDay.slot === slot);
              if (activitiesForSlot.length === 0) return null;
              return (
                <tr key={slot.name}>
                  <td>
                    <p>{slot.name}</p>
                    <p className="times">{slot.times}</p>
                  </td>
                  {dates.map((date) => {
                    const activitiesForDate = activitiesForCenter.filter((activity) => activity.slotOnDay.date === date);
                    if (activitiesForDate.length === 0) return null;
                    const activitiesForSlot = activitiesForCenter.filter((activity) => activity.slotOnDay.date === date && activity.slotOnDay.slot === slot);
                    return (
                      <td key={`${date.toISOString()}-${slot.name}`}>
                        {activitiesForSlot.map((activity, index) => (
                          <ActivityCard key={`${date.toISOString()}-${slot.name}-${index}`} activity={activity} showCenter={false} />
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ChipKey />
      {dates.map((date) => {
        const activitiesForDate = activitiesForCenter.filter((activity) => activity.slotOnDay.date === date);
        if (activitiesForDate.length === 0) return null;
        return (
          <div key={date.toISOString()} className="programme-date-section programme-table-center">
            <h3>{format(date, "eeee do MMMM")}</h3>
            {slots.map((slot) => {
              const activitiesForSlot = activitiesForDate.filter((activity) => activity.slotOnDay.slot === slot);
              if (activitiesForSlot.length === 0) return null;
              return (
                <div key={`${date.toISOString()}-${slot.name}`} className="programme-slot-section">
                  <h4>{slot.name}</h4>
                  <p>{slot.times}</p>
                  <div className="programme-activity-list-items">
                    {activitiesForSlot.map((activity, index) => {
                      return <ActivityCard key={`${date.toISOString()}-${slot.name}-${index}`} activity={activity} showCenter={false} />;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const PageForTag: React.FC<{ activities: Activity[]; filter: (activity: Activity) => boolean }> = ({ activities, filter }) => {
  const activitiesForCenter = activities.filter(filter);
  return (
    <>
      <div className="center-timetable-table">
        <table className="programme-table programme-table-day">
          <thead>
            <tr>
              <th></th>
              {dates.map((date) => {
                const activitiesForDate = activitiesForCenter.filter((activity) => activity.slotOnDay.date === date);
                if (activitiesForDate.length === 0) return null;
                return (
                  <th key={date.toISOString()}>
                    <a href={`../${format(date, "MM-dd")}`}>{format(date, "eeee do MMMM")}</a>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => {
              const activitiesForSlot = activitiesForCenter.filter((activity) => activity.slotOnDay.slot === slot);
              if (activitiesForSlot.length === 0) return null;
              return (
                <tr key={slot.name}>
                  <td>
                    <p>{slot.name}</p>
                    <p className="times">{slot.times}</p>
                  </td>
                  {dates.map((date) => {
                    const activitiesForDate = activitiesForCenter.filter((activity) => activity.slotOnDay.date === date);
                    if (activitiesForDate.length === 0) return null;
                    const activitiesForSlot = activitiesForDate.filter((activity) => activity.slotOnDay.slot === slot);
                    return (
                      <td key={`${date.toISOString()}-${slot.name}`}>
                        {activitiesForSlot.map((activity, index) => (
                          <ActivityCard key={`${date.toISOString()}-${slot.name}-${index}`} activity={activity} showCenter={true} />
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ChipKey />
      {dates.map((date) => {
        const activitiesForDate = activitiesForCenter.filter((activity) => activity.slotOnDay.date === date);
        if (activitiesForDate.length === 0) return null;
        return (
          <div key={date.toISOString()} className="programme-date-section programme-table-day">
            <h3>{format(date, "eeee do MMMM")}</h3>
            {slots.map((slot) => {
              const activitiesForSlot = activitiesForDate.filter((activity) => activity.slotOnDay.slot === slot);
              if (activitiesForSlot.length === 0) return null;
              return (
                <div key={`${date.toISOString()}-${slot.name}`} className="programme-slot-section">
                  <h4>{slot.name}</h4>
                  <p>{slot.times}</p>
                  <div className="programme-activity-list-items">
                    {activitiesForSlot.map((activity, index) => {
                      return <ActivityCard key={`${date.toISOString()}-${slot.name}-${index}`} activity={activity} showCenter={false} />;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const PageForDay: React.FC<{ activities: Activity[]; date: Date }> = ({ activities, date }) => {
  const activitiesForDate = activities.filter((activity) => activity.slotOnDay.date === date);
  return (
    <>
      <div className="center-timetable-table">
        <table className="programme-table programme-table-day">
          <thead>
            <tr>
              <th></th>
              {centers.map((center) => (
                <th key={center.slug}>
                  <a href={`../${center.slug}`}>{center.name}</a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => {
              const activitiesForRow = activitiesForDate.filter((activity) => activity.slotOnDay.slot === slot);
              if (activitiesForRow.length === 0) return null;

              return (
                <tr key={slot.name}>
                  <td>
                    <p>{slot.name}</p>
                    <p className="times">{slot.times}</p>
                  </td>
                  {centers.map((center) => {
                    const activitiesForCenter = activitiesForDate.filter((activity) => activity.center === center && activity.slotOnDay.slot === slot);
                    return (
                      <td key={`${date.toISOString()}-${center.slug}-${slot.name}`}>
                        {activitiesForCenter.map((activity, index) => (
                          <ActivityCard key={`${date.toISOString()}-${center.slug}-${slot.name}-${index}`} activity={activity} showCenter={true} />
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ChipKey />
      {slots.map((slot) => {
        const activitiesForSlot = activitiesForDate.filter((activity) => activity.slotOnDay.slot === slot);
        return (
          <div key={slot.name} className={`programme-slot-section programme-slot-${slot.class} programme-table-day`}>
            <h4>{slot.name}</h4>
            <p>{slot.times}</p>
            <div className="programme-activity-list-items">
              {activitiesForSlot.map((activity, index) => {
                return <ActivityCard key={`${date.toISOString()}-${slot.name}-${index}`} activity={activity} showCenter={true} />;
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

const wordpressPageUpsert = async (details: Record<string, any> & { slug: string }) => {
  const pages = await fetch(`${process.env.WORDPRESS_URL}/pages?slug=${details.slug}&status=publish,future,draft,pending,private`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString("base64")}`,
    },
  });

  const responseJson = await pages.json();

  if (pages.ok && responseJson.length > 0) {
    const response = await fetch(`${process.env.WORDPRESS_URL}/pages/${responseJson[0].id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString("base64")}`,
      },
      body: JSON.stringify(details),
    });
    return response;
  } else {
    const response = await fetch(`${process.env.WORDPRESS_URL}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString("base64")}`,
      },
      body: JSON.stringify(details),
    });
    return response;
  }
};

const wordpressGetID = async (slug: string) => {
  const pages = await fetch(`${process.env.WORDPRESS_URL}/pages?slug=${slug}&status=publish,future,draft,pending,private`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString("base64")}`,
    },
  });
  const responseJson = await pages.json();
  if (pages.ok && responseJson.length > 0) {
    return responseJson[0].id;
  }
  throw new Error(`Page with slug ${slug} not found`);
};

const parentPageId = await wordpressGetID("programme");

for (const center of centers) {
  const htmlString = renderToString(<PageForCenter activities={activities} center={center} />);

  console.log(htmlString);

  const htmlFile = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Programme Activities</title>
  <style>
  ${await fs.readFile("fragment.css", "utf8")}
  </style>
</head>
<body>
${htmlString}
</body>
</html>`;

  await fs.writeFile(`programme-${center.name}.html`, htmlFile, "utf8");
  await wordpressPageUpsert({
    slug: center.slug,
    title: `Activities - ${center.name}`,
    content: htmlString,
    parent: parentPageId,
    status: "publish",
  });
}

for (const day of dates) {
  const htmlString = renderToString(<PageForDay activities={activities} date={day} />);

  console.log(htmlString);

  const htmlFile = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Programme Activities</title>
  <style>
  ${await fs.readFile("fragment.css", "utf8")}
  </style>
</head>
<body>
${htmlString}
</body>
</html>`;

  await fs.writeFile(`programme-${format(day, "MM-dd")}.html`, htmlFile, "utf8");
  await wordpressPageUpsert({
    slug: format(day, "MM-dd"),
    title: `Activities - ${format(day, "eeee do MMMM")}`,
    content: htmlString,
    parent: parentPageId,
    status: "publish",
  });
}

const htmlLGBT = renderToString(<PageForTag activities={activities} filter={(activity) => activity.lgbt} />);
await fs.writeFile("programme-lgbt.html", htmlLGBT, "utf8");
await wordpressPageUpsert({
  slug: "lgbt",
  title: "Activities - LGBT+ themed",
  content: htmlLGBT,
  parent: parentPageId,
  status: "publish",
});

const htmlUnder12 = renderToString(<PageForTag activities={activities} filter={(activity) => activity.u12} />);
await fs.writeFile("programme-under12.html", htmlUnder12, "utf8");
await wordpressPageUpsert({
  slug: "under-12",
  title: "Activities - Under 12s",
  content: htmlUnder12,
  parent: parentPageId,
  status: "publish",
});

const htmlSustainability = renderToString(<PageForTag activities={activities} filter={(activity) => activity.s} />);
await fs.writeFile("programme-sustainability.html", htmlSustainability, "utf8");
await wordpressPageUpsert({
  slug: "sustainability",
  title: "Activities - Sustainability themed",
  content: htmlSustainability,
  parent: parentPageId,
  status: "publish",
});

const htmlMinimalLanguage = renderToString(<PageForTag activities={activities} filter={(activity) => activity.ml} />);
await fs.writeFile("programme-minimal-language.html", htmlMinimalLanguage, "utf8");
await wordpressPageUpsert({
  slug: "minimal-language",
  title: "Activities - Minimal language",
  content: htmlMinimalLanguage,
  parent: parentPageId,
  status: "publish",
});

//console.log(JSON.stringify(activities, null, 2));
