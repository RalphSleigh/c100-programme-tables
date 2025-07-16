import { promises as fs } from "fs";
import * as XLSX from "xlsx";
import { renderToString } from "react-dom/server";
import React from "react";
import { format } from "date-fns/format";

type Slot = {
  name: string;
  times: string;
};

const slot1: Slot = {
  name: "Morning",
  times: "11:00 - 12:30",
};
const slot2: Slot = {
  name: "Afternoon",
    times: "15:00 - 16:30",
};
const slot3: Slot = {
  name: "Early Evening",
    times: "16:30 - 17:45",
};
const evening1: Slot = {
  name: "Evening",
    times: "20:30 - 22:00",
};
const evening2: Slot = {
  name: "Late Evening",
    times: "22:30 - 23:30",
};

const slots: Slot[] = [slot1, slot2, slot3, evening1, evening2];

const date28th = new Date("2025-07-28T00:00:00Z");
const date29th = new Date("2025-07-29T00:00:00Z");
const date31st = new Date("2025-07-31T00:00:00Z");
const date2nd = new Date("2025-08-02T00:00:00Z");
const date4th = new Date("2025-08-04T00:00:00Z");

const dates: Date[] = [date28th, date29th, date31st, date2nd, date4th];

type SlotOnDay = {
  date: Date;
  slot: Slot;
  row: number;
};

const slotsOnDays: SlotOnDay[] = [
  {
    date: date28th,
    slot: slot1,
    row: 4,
  },
  {
    date: date28th,
    slot: slot2,
    row: 5,
  },
  {
    date: date28th,
    slot: slot3,
    row: 6,
  },
  {
    date: date29th,
    slot: slot1,
    row: 8,
  },
  {
    date: date29th,
    slot: slot2,
    row: 9,
  },
  {
    date: date29th,
    slot: slot3,
    row: 10,
  },
  {
    date: date29th,
    slot: evening1,
    row: 11,
  },
  {
    date: date29th,
    slot: evening2,
    row: 12,
  },
  {
    date: date31st,
    slot: slot1,
    row: 14,
  },
  {
    date: date31st,
    slot: slot2,
    row: 15,
  },
  {
    date: date31st,
    slot: slot3,
    row: 16,
  },
  {
    date: date31st,
    slot: evening1,
    row: 17,
  },
  {
    date: date31st,
    slot: evening2,
    row: 18,
  },
  {
    date: date2nd,
    slot: slot1,
    row: 20,
  },
  {
    date: date2nd,
    slot: slot2,
    row: 21,
  },
  {
    date: date2nd,
    slot: slot3,
    row: 22,
  },
  {
    date: date2nd,
    slot: evening1,
    row: 23,
  },
  {
    date: date2nd,
    slot: evening2,
    row: 24,
  },
  {
    date: date4th,
    slot: slot1,
    row: 26,
  },
  {
    date: date4th,
    slot: slot2,
    row: 27,
  },
  {
    date: date4th,
    slot: slot3,
    row: 28,
  },
];

type Center = {
  name: string;
  columns: number[];
};

const centers: Center[] = [
  {
    name: "Panet Utopia",
    columns: [3],
  },
  {
    name: "STEM Cell",
    columns: [4],
  },
  {
    name: "MEST-UP",
    columns: [5],
  },
  {
    name: "Arts & Crafts",
    columns: [6, 7, 8],
  },
  {
    name: "Kids Rule the World",
    columns: [9],
  },
  {
    name: "People's Printing Press",
    columns: [10, 11],
  },
  {
    name: "Ecology",
    columns: [12, 13],
  },
  {
    name: "Peace & Conflict",
    columns: [14],
  },
  {
    name: "Puzzles",
    columns: [15, 16, 17],
  },
  {
    name: "Trade Union",
    columns: [18],
  },
  {
    name: "Trailblazers",
    columns: [19],
  },
  {
    name: "Centres centre",
    columns: [20],
  },
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

async function readFileToArrayBuffer(filePath: string): Promise<ArrayBuffer> {
  const buffer = await fs.readFile(filePath);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

const xslData = await readFileToArrayBuffer("Final Agenda for Core Centres_2025.07.15.xlsx");
const programmeData = XLSX.read(xslData, { type: "array" });

const jsonData: string[][] = XLSX.utils.sheet_to_json(programmeData.Sheets[programmeData.SheetNames[0]], { header: 1 });

slotsOnDays.forEach((slot) => {
  centers.forEach((center) => {
    center.columns.forEach((column) => {
      if (jsonData[slot.row - 1][column - 2] !== undefined) {
        const title = jsonData[slot.row - 1][column - 2];
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

/* const maxActivitiesOnDay = (activities: activity[]) => {
  const activitiesBySlot = activities.reduce<number[]>((acc, activity) => {
    const slotIndex = slots.findIndex((slot) => activity.slotOnDay.slot === slot);
    acc[slotIndex] = (acc[slotIndex] || 0) + 1;
    return acc;
  }, []);
  const maxActivities = Math.max(...activitiesBySlot);
  return maxActivities;
}; */

const maxActivitiesInSlotOnDay = (day: Date, center: Center) => {
  const releventActivities = activities.filter((activity) => activity.slotOnDay.date === day && activity.center === center);
  const activitiesBySlot = releventActivities.reduce<number[]>((acc, activity) => {
    const slotIndex = slots.findIndex((slot) => activity.slotOnDay.slot === slot);
    acc[slotIndex] = (acc[slotIndex] || 0) + 1;
    return acc;
  }, []);
  const maxActivities = Math.max(...activitiesBySlot);
  return maxActivities;
};

/* 
const TableHeaderCell: React.FC<{ title: string; span: number }> = ({ span, title }) => <th colSpan={span}>{title}</th>;

const TableHeaderCenters: React.FC<{ centers: center[]; activities: activity[]}> = ({ centers, activities}) => (
  <thead>
    <tr>
      <th>Slot</th>
      {centers.map((center) => (
        <TableHeaderCell key={center.name} title={center.name} span={maxActivitiesOnDay(activities.filter((a) => a.center === center))} />
      ))}
    </tr>
  </thead>
);

const TableCentersRow: React.FC<{ slot: slot; activities: activity[] }> = ({ slot, activities }) => {
  const cells = [];
  cells.push(<td key={`${slot.name}`}>{slot.name}</td>);

  for (const center of centers) {
    const activityForCenter = activities.filter((activity) => activity.center === center);
    const maxActivities = maxActivitiesOnDay(activityForCenter);
    const activitiesForSlot = activityForCenter.filter((activity) => activity.slotOnDay.slot === slot);

    for (let i = 0; i < maxActivities; i++) {
      if (i >= activitiesForSlot.length) {
        cells.push(<td key={`${center.name}-${slot.name}-${i}`}></td>);
      } else {
        cells.push(<td key={`${center.name}-${slot.name}-${i}`}>{activitiesForSlot[i].title.split("(")[0]}</td>);
      }
    }
  } 

  return <tr>{cells}</tr>;
};

const TableForDay: React.FC<{ date: Date; slots: slot[]; activities: activity[]; centers: center[] }> = ({ date, slots, activities, centers }) => {
  const activitiesOnDay = activities.filter((activity) => activity.slotOnDay.date === date);
  return (
    <table className="programme-table">
      <caption>{date.toLocaleDateString()}</caption>
      <TableHeaderCenters centers={centers} activities={activitiesOnDay}/>
      <tbody>
        {slots.map((slot) => (
          <TableCentersRow key={`${slot.name}`} slot={slot} activities={activitiesOnDay} />
        ))}
      </tbody>
    </table>
  );
}; */

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
  return (
    <div className="activityCard">
      <strong>{activity.title.split("(")[0]}</strong>
      <div className="activity-badges">
        {activity.u12 && <span className="badge u12">U12</span>}
        {activity.ml && <span className="badge ml">ML</span>}
        {activity.s && <span className="badge s">S</span>}
        {activity.lgbt && <span className="badge lgbt">🏳️‍🌈</span>}
        {activity.prebook && <span className="badge prebook">Pre-book</span>}
        {activity.minAge && <span className="badge min-age">{activity.minAge}+</span>}
      </div>
    </div>
  );
};

const TableForCenter: React.FC<{ activities: Activity[]; center: Center }> = ({ activities, center }) => {
  const activitiesForCenter = activities.filter((activity) => activity.center === center);
  return (
    <>
      <h2>{center.name}</h2>
      <div className="center-timetable-table">
        <h3>Timetable</h3>
        <table className="programme-table">
          <thead>
            <tr>
              <th>Slot</th>
              {dates.map((date) => (
                <th key={date.toISOString()}>{format(date, "eeee do MMMM")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.name}>
                <td>
                  <p>{slot.name}</p>
                  <p className="times">{slot.times}</p>
                </td>
                {dates.map((date) => {
                  const activitiesForSlot = activitiesForCenter.filter((activity) => activity.slotOnDay.date === date && activity.slotOnDay.slot === slot);
                  return (
                    <td key={`${date.toISOString()}-${slot.name}`}>
                      {activitiesForSlot.map((activity, index) => (
                        <ActivityCard key={`${date.toISOString()}-${slot.name}-${index}`} activity={activity} />
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {dates.map((date) => {
        const activitiesForDate = activitiesForCenter.filter((activity) => activity.slotOnDay.date === date);
        return (
          <div key={date.toISOString()}>
            <h3>{format(date, "eeee do MMMM")}</h3>
            {slots.map((slot) => {
              const activitiesForSlot = activitiesForDate.filter((activity) => activity.slotOnDay.slot === slot);
              if (activitiesForSlot.length === 0) return null;
              return (
                <div key={`${date.toISOString()}-${slot.name}`}>
                  <h4>{slot.name}</h4>
                  {activitiesForSlot.map((activity, index) => {
                    return <ActivityCard key={`${date.toISOString()}-${slot.name}-${index}`} activity={activity} />;
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const htmlString = renderToString(<TableForCenter activities={activities} center={centers[0]} />);

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

await fs.writeFile("programme.html", htmlFile, "utf8");

//console.log(JSON.stringify(activities, null, 2));
