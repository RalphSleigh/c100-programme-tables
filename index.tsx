import { promises as fs } from 'fs';
import * as XLSX from 'xlsx';

type slot = {
    date: Date;
    slot: string;
    row: number;
}

const slots: slot[] = [{
    date: new Date('2025-07-28T00:00:00Z'),
    slot: "Slot 1 (11:00 - 12:30)",
    row: 4
    },{
    date: new Date('2025-07-28T00:00:00Z'),
    slot: "Slot 2 (15:00 - 16:30)",
    row: 5
    },{
    date: new Date('2025-07-28T00:00:00Z'),
    slot: "Slot 3 (16:30 - 17:45)",
    row: 6
    },{
    date: new Date('2025-07-29T00:00:00Z'),
    slot: "Slot 1 (11:00 - 12:30)",
    row: 8
    },{
    date: new Date('2025-07-29T00:00:00Z'),
    slot: "Slot 2 (15:00 - 16:30)",
    row: 9
    },{
    date: new Date('2025-07-29T00:00:00Z'),
    slot: "Slot 3 (16:30 - 17:45)",
    row: 10
    },{
    date: new Date('2025-07-29T00:00:00Z'),
    slot: "Evening 1 (20:30 - 22:00)",
    row: 11
    },{
    date: new Date('2025-07-29T00:00:00Z'),
    slot: "Evening (22:30 - 23:30)",
    row: 12
    },{
    date: new Date('2025-07-31T00:00:00Z'),
    slot: "Slot 1 (11:00 - 12:30)",
    row: 14
    },{
    date: new Date('2025-07-31T00:00:00Z'),
    slot: "Slot 2 (15:00 - 16:30)",
    row: 15
    },{
    date: new Date('2025-07-31T00:00:00Z'),
    slot: "Slot 3 (16:30 - 17:45)",
    row: 16
    },{
    date: new Date('2025-07-31T00:00:00Z'),
    slot: "Evening 1 (20:30 - 22:00)",
    row: 17
    },{
    date: new Date('2025-07-31T00:00:00Z'),
    slot: "Evening (22:30 - 23:30)",
    row: 18
    },{
    date: new Date('2025-08-02T00:00:00Z'),
    slot: "Slot 1 (11:00 - 12:30)",
    row: 20
    },{
    date: new Date('2025-08-02T00:00:00Z'),
    slot: "Slot 2 (15:00 - 16:30)",
    row: 21
    },{
    date: new Date('2025-08-02T00:00:00Z'),
    slot: "Slot 3 (16:30 - 17:45)",
    row: 22
    },{
    date: new Date('2025-08-02T00:00:00Z'),
    slot: "Evening 1 (20:30 - 22:00)",
    row: 23
    },{
    date: new Date('2025-08-02T00:00:00Z'),
    slot: "Evening (22:30 - 23:30)",
    row: 24
    },{
    date: new Date('2025-08-04T00:00:00Z'),
    slot: "Slot 1 (11:00 - 12:30)",
    row: 26
    },{
    date: new Date('2025-08-04T00:00:00Z'),
    slot: "Slot 2 (15:00 - 16:30)",
    row: 27
    },{
    date: new Date('2025-08-04T00:00:00Z'),
    slot: "Slot 3 (16:30 - 17:45)",
    row: 28
    }]


type center = {
    name: string;
    columns: number[];
}

const centers: center[] = [{
    name: "Panet Utopia",
    columns: [3]
},{
    name: "STEM Cell",
    columns: [4]
},{
    name: "MEST-UP",
    columns: [5]
},{
    name: "Arts & Crafts",
    columns: [6,7]
},{
    name: "Kids Rule the World",
    columns: [8]
},{
    name: "People's Printing Press",
    columns: [9,10]
},{
    name: "Ecology",
    columns: [11,12]
},{
    name: "Peace & Conflict",
    columns: [13]
},{
    name: "Puzzles",
    columns: [14,15,16]
},{
    name: "Trade Union",
    columns: [17]
},{
    name: "Trailblazers",
    columns: [18]
},{
    name: "Centres centre",
    columns: [19]
}]


type activity = {
    slot: slot;
    center: center;
    title: string;
    u12: boolean;
    ml: boolean;
    s:boolean;
    lgbt: boolean;
    minAge?: number;
}

const activities: activity[] = []

async function readFileToArrayBuffer(filePath: string): Promise<ArrayBuffer> {
    const buffer = await fs.readFile(filePath);
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

const xslData = await readFileToArrayBuffer('Final Agenda for Core Centres_2025.07.15.xlsx')
const programmeData = XLSX.read(xslData, { type: 'array' }); 

const jsonData :string[][] = XLSX.utils.sheet_to_json(programmeData.Sheets[programmeData.SheetNames[0]], { header: 1 });

slots.forEach(slot => {
    centers.forEach(center => {
        center.columns.forEach(column => {
            if (jsonData[slot.row - 1][column - 1] !== undefined) {
            const title = jsonData[slot.row - 1][column - 1]
            const activity: activity = {
                slot: slot,
                center: center,
                title: title,
                u12: title.includes('(U12)'),
                ml: title.includes('(ML)'),
                s: title.includes('(S)'),
                lgbt: title.includes('(LGBT)'), //@ts-expect-error
                minAge: title.match(/(\d+)\+/) ? parseInt(title.match(/(\d+)\+/)[1]) : undefined
            };
            activities.push(activity);
            }   
        })
    })
})

for(const activity of activities) {
    console.log(`Slot: ${activity.slot.slot}, Center: ${activity.center.name}, Title: ${activity.title}, U12: ${activity.u12}, ML: ${activity.ml}, S: ${activity.s}, LGBT: ${activity.lgbt}, Min Age: ${activity.minAge}`);
}

//console.log(JSON.stringify(activities, null, 2));