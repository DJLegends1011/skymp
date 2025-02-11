import { Movement, Transform } from "./sync/movement";
import { Appearance } from "./sync/appearance";
import { Animation } from "./sync/animation";
import { Equipment } from "./sync/equipment";
import { Inventory } from "./sync/inventory";
import * as spSnippet from "./spSnippet";
import { ActorValues } from "./sync/actorvalues";
import { ChangeValuesMessage } from "./services/messages/changeValues";

export enum MsgType {
  CustomPacket = 1,
  UpdateMovement = 2,
  UpdateAnimation = 3,
  UpdateAppearance = 4,
  UpdateEquipment = 5,
  Activate = 6,
  UpdateProperty = 7,
  PutItem = 8,
  TakeItem = 9,
  FinishSpSnippet = 10,
  OnEquip = 11,
  ConsoleCommand = 12,
  CraftItem = 13,
  Host = 14,
  CustomEvent = 15,
  ChangeValues = 16,
  OnHit = 17,
  DeathStateContainer = 18,
  DropItem = 19,
  Teleport = 20,
  OpenContainer = 21,
}

export interface SetInventory {
  type: "setInventory";
  inventory: Inventory;
}

export interface CreateActorMessage {
  type: "createActor";
  idx: number;
  refrId?: number;
  baseRecordType: "DOOR" | undefined; // see PartOne.cpp
  transform: Transform;
  isMe: boolean;
  appearance?: Appearance;
  equipment?: Equipment;
  inventory?: Inventory;
  baseId?: number;
  props?: Record<string, unknown>;
}

export interface DestroyActorMessage {
  type: "destroyActor";
  idx: number;
}

export interface UpdatePropertyMessage {
  t: MsgType.UpdateProperty;
  idx: number;
  refrId: number;
  baseRecordType: string; // DOOR, ACTI, etc
  data: unknown;
  propName: string;
}

export interface SetRaceMenuOpenMessage {
  type: "setRaceMenuOpen";
  open: boolean;
}

export interface CustomPacket {
  type: "customPacket";
  content: Record<string, unknown>;
}

interface SpSnippetMsgBase {
  type: "spSnippet";
}

export type SpSnippet = SpSnippetMsgBase & spSnippet.Snippet;

export interface HostStartMessage {
  type: "hostStart";
  target: number;
}

export interface HostStopMessage {
  type: "hostStop";
  target: number;
}

export interface UpdateGamemodeDataMessage {
  type: "updateGamemodeData";
  eventSources: Record<string, string>;
  updateOwnerFunctions: Record<string, string>;
  updateNeighborFunctions: Record<string, string>;
}
