import { FastifyPluginAsync } from "fastify";
import db from "../../db/db";
import { generateId } from "../../utils/idUtil";

const webhookRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post<{ Body: { to: string; message: string } }>(
    "/email",
    async function (request, reply) {
      const { to, message } = request.body;
      if (!message || !to) {
        reply.code(411);
        throw new Error("message and destination needed is required");
      } else reply.code(201);

      const id = generateId();
      const createdAt = new Date();
      const data = { id, createdAt, to, message };

      // @ts-ignore
      db.chain.get("email_queue").push(data).value();

      db.save();

      const msg = db.chain.get("email_queue").find({ id }).value();
      const payload = {
        meta: "notify",
        message: msg,
      };

      this.server.emit("broadcast", payload);

      return;
    }
  );

  fastify.post<{
    Body: { destination?: string; message: string };
  }>("/notify", async function (request, reply) {
    const { destination, message } = request.body;
    if (!message) {
      reply.code(411);
      throw new Error("message and destination needed is required");
    } else reply.code(201);
    const id = generateId();
    const createdAt = new Date();
    const data = { destination, message, id, createdAt };

    // @ts-ignore
    db.chain.get("notifications").push(data).value();

    await db.save();

    const msg = db.chain.get("notifications").find({ id }).value();
    const payload = {
      meta: "notify",
      message: msg,
    };

    this.server.emit("broadcast", payload);

    return;
  });

  // fastify.get<{
  //   Querystring: { destination?: string; message: string };
  // }>("/notify", async function (request, reply) {
  //   const { destination, message } = request.query;
  //   if (!message) {
  //     reply.code(411);
  //     throw new Error("message and destination needed is required");
  //   } else reply.code(201);
  //   const id = generateId();
  //   const createdAt = new Date();
  //   const data = { destination, message, id, createdAt };

  //   // @ts-ignore
  //   db.chain.get("notifications").push(data).value();

  //   await db.save();

  //   const msg = db.chain.get("notifications").find({ id });

  //   this.server.emit("broadcast", {
  //     meta: "notify",
  //     message: msg,
  //   });
  //   return;
  // });
};

export default webhookRoute;
