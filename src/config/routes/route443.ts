import { RouteConfig } from "../../models/types";

export const route443: RouteConfig = {
  id: "route443",
  name: { he: "כביש 443", en: "Route 443" },
  stops: [
    { id: "modiin", name: { he: "מודיעין", en: "Modi'in" }, order: 0 },
    { id: "maccabim", name: { he: "מכבים", en: "Maccabim" }, order: 1 },
    { id: "givat_zeev", name: { he: "גבעת זאב", en: "Givat Ze'ev" }, order: 2 },
    { id: "jerusalem", name: { he: "ירושלים", en: "Jerusalem" }, order: 3 },
  ],
  directions: [
    { id: "eastbound", name: { he: "לירושלים", en: "To Jerusalem" } },
    { id: "westbound", name: { he: "למודיעין", en: "To Modi'in" } },
  ],
};
