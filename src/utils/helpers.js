export function getAllActivities(acts) {
  const all = [];
  for (const d of Object.keys(acts)) {
    for (const s of ["morning", "afternoon", "evening"]) {
      for (const a of acts[d][s] || []) {
        all.push({ ...a, dayId: parseInt(d) });
      }
    }
  }
  return all;
}

export function parseDuration(d) {
  const m = d.match(/(\d+)/);
  return m ? parseInt(m[1]) : 30;
}

import { CATEGORIES } from '../data/categories';

export function estimateSteps(acts) {
  let t = 0;
  for (const a of getAllActivities(acts)) {
    const c = CATEGORIES[a.category];
    if (c) t += Math.round(c.steps * parseDuration(a.duration) / 60);
  }
  return t;
}
