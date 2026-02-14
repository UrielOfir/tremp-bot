import { RouteConfig } from "../../models/types";

export const route443: RouteConfig = {
  id: "route443",
  name: { he: "כביש 443", en: "Route 443" },
  stops: [
    { id: "ginaton", name: { he: "צומת גינתון", en: "Ginaton Junction" }, order: 0 },
    { id: "ben_shemen", name: { he: "צומת בן שמן", en: "Ben Shemen Junction" }, order: 1 },
    { id: "kfar_noar", name: { he: "כפר הנוער בן שמן", en: "Ben Shemen Youth Village" }, order: 2 },
    { id: "Gimzo_Junction", name: { he: "צומת גימזו", en: "Gimzo Junction" }, order: 3 },
    { id: "Mitspe_Modiin_Junction", name: { he: "צומת מצפה מודיעין", en: "Mitspe Modi'in Junction" }, order: 4 },
    { id: "Mitkan_Adam_Junction", name: { he: "צומת מתקן אדם", en: "Mitkan Adam Junction" }, order: 5 },
    { id: "Neot_Kdumim_Junction", name: { he: "צומת נאות קדומים", en: "Neot Kdumim Junction" }, order: 6 },
    { id: "Mevo_Modiim_Junction", name: { he:  "צומת מבוא מודיעים", en: "MMevo Modi'im Junction" }, order: 7 },
    { id: "Modiin_West_Junction", name: { he:  "צומת מודיעין מערב", en: "Modi'in_West_Junction" }, order: 8 },
    { id: "Shilat_Junction", name: { he:  "צומת שילת", en: "Shilat Junction" }, order: 9 },
    { id: "Macabim_Reut_Junction", name: { he: "צומת מכבים רעות", en: "Macabim Reut Junction" }, order: 10 },
    { id: "beit_horon_interchange", name: { he: "מחלף בית חורון", en: "Beit Horon Interchange" }, order: 11 },
    { id: "Agan_HaAyalot", name: { he: "אגן האיילות", en: "Agan HaAyalot" }, order: 12 },
    { id: "ofer_camp_Junction", name: { he: "צומת מחנה עופר", en: "Ofer Camp Junction" }, order: 13 },
    { id: "atarot", name: { he: "צומת עטרות", en: "Atarot Junction" }, order: 14 },
  ],
  directions: [
    { id: "eastbound", name: { he: "לכיוון מזרח (ירושלים/עטרות)", en: "Eastbound (To Jerusalem)" } },
    { id: "westbound", name: { he: "לכיוון מערב (לוד/גינתון)", en: "Westbound (To Lod)" } },
  ],
};