const TWO_LETTER = new Set(["Tu", "Th", "Sa", "Su"]);

export type Day = "M" | "Tu" | "W" | "Th" | "F" | "Sa" | "Su";

export interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}

export interface SeperatedMeets {
  days: Day[];
  startMin: number;
  endMin: number;
}

// This helps me split up the information on when classes occur into components I can use to compare
export function SeperateMeets(meets: string): SeperatedMeets | null {
  if (!meets || typeof meets !== "string") return null;
  const [daysStr, timeStr] = meets.trim().split(/\s+/, 2);
  if (!daysStr || !timeStr) return null;

  const days: Day[] = [];
  for (let i = 0; i < daysStr.length; ) {
    const two = daysStr.slice(i, i + 2);
    if (TWO_LETTER.has(two)) {
      days.push(two as Day);
      i += 2;
    } else {
      const one = daysStr[i];
      if (!"MWF".includes(one)) {
        return null;
      }
      days.push(one as Day);
      i += 1;
    }
  }

  const m = timeStr.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!m) return null;

  const toMin = (h: string, mm: string) => parseInt(h, 10) * 60 + parseInt(mm, 10);
  const startMin = toMin(m[1], m[2]);
  const endMin = toMin(m[3], m[4]);
  if (!(startMin < endMin)) return null;

  return { days, startMin, endMin };
}

//This function lets me check if two classes overlap times
export function timesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

//This function uses my other functions to actually identify the conflicts where times and days overlap
export function coursesConflict(a: Course, b: Course): boolean {
  if (a.term.trim().toLowerCase() !== b.term.trim().toLowerCase()) return false;
  const pa = SeperateMeets(a.meets);
  const pb = SeperateMeets(b.meets);
  if (!pa || !pb) return false;
  const setA = new Set<Day>(pa.days);
  const hasCommonDay = pb.days.some(d => setA.has(d));
  if (!hasCommonDay) return false;

  return timesOverlap(pa.startMin, pa.endMin, pb.startMin, pb.endMin);
}

// Uses my coursesConflict function from above to identify all the classes that conflict and returns the list of these conflicting classes to be used to make them unselectable
export function computeConflicts(courses: Record<string, Course>,selectedIds: string[]): Set<string> {
  const conflicts = new Set<string>();
  const selected = selectedIds.map(id => [id, courses[id]] as const).filter(([, c]) => !!c) as Array<readonly [string, Course]>;
  if (selected.length === 0) return conflicts;
  for (const [id, course] of Object.entries(courses)) {
    if (selectedIds.includes(id)) continue;
    for (const [, sel] of selected) {
      if (coursesConflict(course, sel)) {
        conflicts.add(id);
        break;
      }
    }
  }
  return conflicts;
}