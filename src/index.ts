import * as dotenv from "dotenv";
dotenv.config();

import Client from "./classes/Client";

export const client = new Client();

client.login();
client.mongoConectar();

import eventHandler from "./handlers/eventHandler";
eventHandler();

import slashCommandHandler from "./handlers/slashCommandHandler";
slashCommandHandler();