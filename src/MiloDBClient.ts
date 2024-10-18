import axios, { AxiosInstance } from "axios";
import { MiloDBConfig, SetRequest, GetResponse, DeleteResponse } from "./types";

class MiloDBClient {
  private axiosInstances: AxiosInstance[];
  private currentNodeIndex: number = 0;

  constructor(config: MiloDBConfig) {
    this.axiosInstances = config.nodes.map((node) =>
      axios.create({
        baseURL: node,
        timeout: config.timeout || 1000,
      })
    );
  }

  private getNextNode(): AxiosInstance {
    const node = this.axiosInstances[this.currentNodeIndex];
    this.currentNodeIndex =
      (this.currentNodeIndex + 1) % this.axiosInstances.length;
    return node;
  }

  async set(request: SetRequest): Promise<void> {
    const node = this.getNextNode();
    await node.post("/set", request);
  }

  async get(key: string): Promise<GetResponse> {
    const node = this.getNextNode();
    const response = await node.get(`/get/${key}`);
    return response.data;
  }

  async delete(key: string): Promise<DeleteResponse> {
    const node = this.getNextNode();
    const response = await node.delete(`/delete/${key}`);
    return response.data;
  }

  async heartbeat(): Promise<boolean> {
    const node = this.getNextNode();
    const response = await node.get("/heartbeat");
    return response.data.alive;
  }
}

export default MiloDBClient;
