import { FastifyPluginAsync } from "fastify";
import { watchFile } from "fs";
import db from "../../db/db";

const websocketRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", { websocket: true }, async function (connection, request) {
    const wss = connection.socket;
    const wsServer = this.websocketServer;
    // const server = this.server;

    const sendToAll = (data: any) =>
      // @ts-ignore
      wsServer.clients?.forEach((client) => {
        if (client.readyState === 1) client.send(JSON.stringify({ data }));
      });

    const broadcast = (data: any) =>
      // @ts-ignore
      wsServer.clients?.forEach((client) => {
        if (client !== wss && client.readyState === 1)
          client.send(JSON.stringify({ data }));
      });

    watchFile("../../db/data.json", () => {
      const queue = db.chain.get("notifications").value();
      queue.forEach(async (item) => {
        await broadcast({ source: "db", payload: queue[0] });
        await db.chain.get("notifications").remove(queue[0]).value();
        await db.save();
      });
    });

    wss.on("message", (m: string) => {
      const dataString = m.toString();
      const { meta, payload } = JSON.parse(dataString);
      const source = request.headers["user-agent"];
      const response =
        typeof payload === "string" && JSON.parse(payload)
          ? JSON.parse(payload)
          : payload;

      if (meta === "join") sendToAll({ source, payload: response });
      else if (meta === "broadcast") broadcast({ source, payload: response });
    });

    // @ts-ignore
    wsServer.clients?.forEach((client) => {
      if (client !== wss && client.readyState === 3)
        client.send("disconnected");
    });
  });
};

export default websocketRoute;
