import { RouteConfig } from "../../models/types";

export const route443: RouteConfig = {
  id: "route443",
  name: { he: "כביש 443", en: "Route 443" },
  stops: [
    // Western branches (off Mitspe Modi'in Junction)
    { id: "lod", name: { he: "לוד", en: "Lod" }, order: 0, hub: "Mitspe_Modiin_Junction" },
    { id: "route1_west", name: { he: "כביש 1 מערב", en: "Route 1 West" }, order: 0, hub: "Mitspe_Modiin_Junction" },
    { id: "route6_north", name: { he: "כביש 6 צפון", en: "Route 6 North" }, order: 0, hub: "Mitspe_Modiin_Junction" },
    { id: "route6_south", name: { he: "כביש 6 דרום", en: "Route 6 South" }, order: 0, hub: "Mitspe_Modiin_Junction" },

    // Main 443 axis
    { id: "Mitspe_Modiin_Junction", name: { he: "צומת מצפה מודיעין", en: "Mitspe Modi'in Junction" }, order: 0 },
    { id: "Mitkan_Adam_Junction", name: { he: "צומת מתקן אדם", en: "Mitkan Adam Junction" }, order: 1 },
    { id: "Neot_Kdumim_Junction", name: { he: "צומת נאות קדומים", en: "Neot Kdumim Junction" }, order: 2 },
    { id: "Mevo_Modiim_Junction", name: { he:  "צומת מבוא מודיעים", en: "MMevo Modi'im Junction" }, order: 3 },
    { id: "Modiin_West_Junction", name: { he:  "צומת מודיעין מערב", en: "Modi'in_West_Junction" }, order: 4 },
    { id: "Shilat_Junction", name: { he:  "צומת שילת", en: "Shilat Junction" }, order: 5 },
    { id: "Macabim_Reut_Junction", name: { he: "צומת מכבים רעות", en: "Macabim Reut Junction" }, order: 6 },
    { id: "beit_horon_interchange", name: { he: "מחלף בית חורון", en: "Beit Horon Interchange" }, order: 7 },
    { id: "Agan_HaAyalot", name: { he: "אגן האיילות", en: "Agan HaAyalot" }, order: 8 },
    { id: "ofer_camp_Junction", name: { he: "צומת מחנה עופר", en: "Ofer Camp Junction" }, order: 9 },
    { id: "atarot", name: { he: "צומת עטרות", en: "Atarot Junction" }, order: 10 },

    // Eastern branch (off Atarot)
    { id: "jerusalem", name: { he: "ירושלים", en: "Jerusalem" }, order: 10, hub: "atarot" },

    // Intermediate branch (off Shilat Junction)
    { id: "shilat_north_446", name: { he: "שילת צפון (כביש 446)", en: "Shilat North (Route 446)" }, order: 5, hub: "Shilat_Junction" },
    { id: "Modiin", name: { he: "מודיעין", en: "Modi'in" }, order: 5, hub: "Shilat_Junction" },
  ],
};