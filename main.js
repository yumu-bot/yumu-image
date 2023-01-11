import fs from "fs";
import {cardD, cardH} from "./src/card.js";

fs.writeFileSync("image/out/cardD.png", await cardD());
fs.writeFileSync("image/out/cardH.png", await cardH());