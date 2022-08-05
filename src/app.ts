import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import fastifyCors from "@fastify/cors";
import websocketPlugin from "@fastify/websocket";

// import db from "./db/db";
// import { generateId } from "./utils/idUtil";

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  fastify.register(fastifyCors, {
    origin: "*",
  });

  // @ts-ignore
  fastify.register(websocketPlugin, {
    options: {
      clientTracking: true,
    },
  });

  // const server = fastify.server;
  // server.on("save_notify", (payload: any) => {
  //   const { destination, message } = payload;

  //   db.chain.get("notifications").push({
  //     destination,
  //     message,
  //     id: generateId(),
  //     createdAt: new Date(),
  //   });

  //   db.save();
  // });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });
};
// setInterval(() => {
//   const email_queue = db.chain.get("email_queue").value();
//   email_queue?.forEach((mail) => {});
// }, 36e5);

export default app;
export { app };
