import { FastifyPluginAsync } from "fastify";

const websocketRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", { websocket: true }, async function (connection, request) {
    const wss = connection.socket;
    const wsServer = this.websocketServer;
    const server = this.server;

    server.on("broadcast", (payload) => {
      const { meta, message } = payload;
      if (meta === "notify") {
        typeof message === "object"
          ? sendToAll(JSON.stringify(message))
          : sendToAll(message.toString());
      }
    });

    const sendToAll = (payload: any) =>
      // @ts-ignore
      wsServer.clients?.forEach((client) => {
        if (client.readyState === 1) client.send(payload);
      });

    const broadcast = (payload: any) =>
      // @ts-ignore
      wsServer.clients?.forEach((client) => {
        if (client !== wss && client.readyState === 1) client.send(payload);
      });

    wss.on("message", (m: string) => {
      const dataString = m.toString();
      const { meta, payload } = JSON.parse(dataString);

      // server.emit("save_notify", {
      //   message: JSON.stringify(payload),
      //   destination: "all",
      // });

      if (meta === "join") sendToAll(payload);
      else if (meta === "broadcast") broadcast(payload);
    });

    // @ts-ignore
    wsServer.clients?.forEach((client) => {
      if (client !== wss && client.readyState === 3)
        client.send("disconnected");
    });
  });
};

export default websocketRoute;
